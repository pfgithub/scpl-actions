import React, {
	ReactNode,
	useRef,
	useEffect,
	useMemo,
	useCallback
} from "react";
import { allActions, getActionFromName } from "scpl";
import { getActionFromID } from "scpl/built/src/ActionData";
import {
	WFAction,
	WFParameter,
	WFParameters,
	WFTextParameter
} from "scpl/built/src/OutputData";
import {
	ShortcutsParameterSpec,
	ShortcutsEnumerationParameterSpec,
	ShortcutsBaseParameterSpec,
	ShortcutsExpandingParameterSpec,
	ShortcutsTextInputParameterSpec
} from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ShortcutsParameterRelationResourceRelationSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsResourceSpec";

//@ts-ignore
import * as cssexported from "./CSSDemo.scss";
import { useState } from "react";

import { Icon, IconButton, IconString } from "./Icon";

import { Parameter } from "./parameters/Parameter";
import { ShortcutsDictionaryParameter } from "./parameters/ShortcutsDictionaryParameter";

export let cssdata: { scale: string } = cssexported;

export type ParameterSummaryItem =
	| string
	| { details: ShortcutsParameterSpec; value: WFParameter };

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; error: (error: Error) => React.ReactNode },
	{ hasError: Error | undefined }
> {
	constructor(props: {
		children: React.ReactNode;
		error: (error: Error) => React.ReactNode;
	}) {
		super(props);
		this.state = { hasError: undefined };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: error };
	}

	render() {
		if (this.state.hasError) {
			return this.props.error(this.state.hasError);
		}

		return this.props.children;
	}
}

export default function CSSDemo(props: {}): JSX.Element {
	let [actionOutput, setActionOutput] = useState<WFAction>({
		WFWorkflowActionIdentifier: "is.workflow.actions.runjavascriptonwebpage",
		WFWorkflowActionParameters: {}
	});
	let [actionJSON, setActionJSON] = useState("");
	useEffect(() => {
		setActionJSON(JSON.stringify(actionOutput, null, "\t"));
	}, [actionOutput]);
	let [key, setKey] = useState(0);
	return (
		<div className="cssdemo">
			<button onClick={() => setKey(key + 1)}>Refresh</button>
			<div className="connector space" />
			{[
				<ErrorBoundary
					key={"" + key}
					error={e => (
						<div className="action">
							<pre className="error">
								<code>{e.name + ": " + e.message + "\n\n" + e.stack}</code>
							</pre>
						</div>
					)}
				>
					<Action
						actionOutput={actionOutput}
						setActionOutput={setActionOutput}
					/>
				</ErrorBoundary>
			]}
			<div className="connector space" />
			<div className="action">
				<textarea
					rows={actionJSON.split("\n").length}
					style={{ width: "100%", resize: "none" }}
					value={actionJSON}
					onChange={e => setActionJSON(e.currentTarget.value)}
					onBlur={() => {
						setActionOutput(JSON.parse(actionJSON));
					}}
				></textarea>
			</div>
		</div>
	);
}

export type UpdateParametersCallback = (
	key: string,
	newParameter: WFParameter
) => void;

function relationResourceCompare(
	currentValue: any,
	relation: ShortcutsParameterRelationResourceRelationSpec | "??",
	argValues: any[]
) {
	const argValue = argValues[0];
	const currentValueNum = +currentValue;
	const isNum = !isNaN(currentValueNum);
	switch (relation) {
		case "==":
			return argValues.some(
				(val: string | number | boolean | object | undefined) =>
					val === currentValue
			);
		case "!=":
			if (
				typeof currentValue === "string" ||
				typeof currentValue === "number" ||
				typeof currentValue === "boolean"
			) {
				return argValues.indexOf(currentValue) === -1;
			}
			return false;
		case ">=":
			if (!isNum) {
				return false;
			}
			return currentValueNum >= +argValue;
		case "<=":
			if (!isNum) {
				return false;
			}
			return currentValueNum <= +argValue;
		case ">":
			if (!isNum) {
				return false;
			}
			return currentValueNum > +argValue;
		case "<":
			if (!isNum) {
				return false;
			}
			return currentValueNum < +argValue;
		case "??":
			return currentValue !== undefined;
		default:
			throw new Error(
				`RelationResource relation type ${relation} is not implemented.`
			);
	}
	return false;
}

export function Action({
	actionOutput,
	setActionOutput
}: {
	actionOutput: WFAction;
	setActionOutput: (val: WFAction) => void;
}): JSX.Element {
	let identifier = actionOutput.WFWorkflowActionIdentifier;

	let actionDetails = getActionFromID(identifier)!._data;
	let parameterSummary = useMemo<ParameterSummaryItem[]>(
		() =>
			(actionDetails.ParameterSummary as string)
				.split(/\$\{(.+?)\}/)
				.map((el, i) =>
					i % 2 === 1
						? {
								details: actionDetails.Parameters!.find(p => p.Key === el)!,
								value: actionOutput.WFWorkflowActionParameters![el]
						  }
						: el
				),
		[
			actionDetails.ParameterSummary,
			actionDetails.Parameters,
			actionOutput.WFWorkflowActionParameters
		]
	);
	let updateParameter = useCallback<UpdateParametersCallback>(
		(key, newParameter) =>
			setActionOutput({
				...actionOutput,
				WFWorkflowActionParameters: {
					...actionOutput.WFWorkflowActionParameters,
					[key]: newParameter
				}
			}),
		[actionOutput, setActionOutput]
	);
	let showMore = !!actionOutput.WFWorkflowActionParameters!["__ScPLShowMore"];
	console.log(actionOutput);
	return (
		<>
			<div className="action">
				<ActionTitle icon={"download"} name={actionDetails.Attribution!} />
				<ActionParameterSummary
					items={parameterSummary}
					parameters={actionOutput.WFWorkflowActionParameters!}
					updateParameter={updateParameter}
				/>
				<ActionFullWidthShowMoreParameter
					paramKey={"__ScPLShowMore"}
					parameters={actionOutput.WFWorkflowActionParameters!}
					updateParameter={updateParameter}
					visible={true}
				/>
				{actionDetails.Parameters!.map(param => {
					let show = showMore
						? (param.RequiredResources
								? param.RequiredResources.every(resource => {
										if (typeof resource === "string") {
											return true;
										}
										if (
											resource.WFResourceClass === "WFParameterRelationResource"
										) {
											if (
												relationResourceCompare(
													actionOutput.WFWorkflowActionParameters![
														resource.WFParameterKey
													],
													resource.WFParameterRelation || "==",
													(resource as any).WFParameterValues || [
														(resource as any).WFParameterValue
													]
												)
											) {
												return true;
											}
											return false;
										}
								  })
								: true) &&
						  parameterSummary.every(item =>
								typeof item === "string" ? true : param.Key !== item.details.Key
						  )
						: false;
					if (param.Class === "WFEnumerationParameter") {
						return (
							<EnumParameter
								paramKey={param.Key}
								data={param}
								parameters={actionOutput.WFWorkflowActionParameters!}
								updateParameter={updateParameter}
								visible={show}
							/>
						);
					} else if (param.Class === "WFExpandingParameter") {
						return (
							<ExpansionParameter
								paramKey={param.Key}
								data={param}
								parameters={actionOutput.WFWorkflowActionParameters!}
								updateParameter={updateParameter}
								visible={show}
							/>
						);
					} else if (param.Class === "WFDictionaryParameter") {
						return (
							<ShortcutsDictionaryParameter
								paramKey={param.Key}
								data={param}
								parameters={actionOutput.WFWorkflowActionParameters!}
								updateParameter={updateParameter}
								visible={show}
							/>
						);
					} else if (
						param.Class === "WFTextInputParameter" &&
						param.Multiline
					) {
						return (
							<ShortcutsMultilineTextInputParameter
								paramKey={param.Key}
								data={param}
								parameters={actionOutput.WFWorkflowActionParameters!}
								updateParameter={updateParameter}
								visible={show}
							/>
						);
					} else {
						return (
							<ErrorParameter
								paramKey={param.Key}
								data={param}
								parameters={actionOutput.WFWorkflowActionParameters!}
								updateParameter={updateParameter}
								visible={show}
							/>
						);
					}
				})}
			</div>
		</>
	);
}

export function SummaryTextInput({
	value,
	onChange
}: {
	value: string;
	onChange: (v: string) => void;
}) {
	// let ref = useRef<HTMLDivElement>(null);
	// useEffect(() => {
	// 	ref.current!.textContent = value
	// 	//eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	//
	// return (
	// 	<div
	// 		className="input"
	// 		contentEditable={true}
	// 		ref={ref}
	// 		onInput={e => {
	// 			onChange(e.currentTarget.textContent || "");
	// 		}}
	// 	></div>
	// );
	// return (
	// 	<AutosizeInput
	// 		className="input"
	// 		value={value}
	// 		onChange={e => onChange(e.currentTarget.value)}
	// 	/>
	// );

	let [editing, setEditing] = useState(false);

	if (!editing) {
		return (
			<span className="input" onClick={e => setEditing(true)}>
				{value}
			</span> // !!!!accessability
		);
	}
	return (
		<input
			className="input"
			value={value}
			autoFocus
			onChange={e => onChange(e.currentTarget.value)}
			onBlur={e => setEditing(false)} // !!!!bad
		/>
	);
}

export function LabeledParameter({
	label,
	children,
	className,
	onClick,
	visible
}: {
	className?: string;
	label: string;
	children: ReactNode;
	onClick?: () => void;
	visible: boolean;
}) {
	return (
		<Parameter
			className={className}
			name={label}
			onClick={onClick}
			visible={visible}
		>
			<div className="label">
				<div>{label}</div>
			</div>
			<div className="value">
				<div>{children}</div>
			</div>
		</Parameter>
	);
}

export type ParameterProps<T extends ShortcutsBaseParameterSpec> = {
	paramKey: string;
	data: T;
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
	visible: boolean;
};

export function ExpansionParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsExpandingParameterSpec>) {
	return (
		<LabeledParameter
			label={data.Label || "???"}
			onClick={() => updateParameter(paramKey, !parameters[paramKey])}
			visible={visible}
		>
			<Icon icon={parameters[paramKey] ? "expandopen" : "expandclosed"} />
		</LabeledParameter>
	);
}

export function ErrorParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsBaseParameterSpec>) {
	return (
		<LabeledParameter label={data.Label || "???"} visible={visible}>
			Not Supported // todo json editor
		</LabeledParameter>
	);
}

type _pc<N extends string> = {
	Class: N;
};

export function ShortcutsMultilineTextInputParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsTextInputParameterSpec>) {
	/*
	{
	"AutocapitalizationType": "None",
	"Class": "WFTextInputParameter",
	"DefaultValue": "var result = [];\n// Get all links from the page\nvar elements = document.querySelectorAll(\"a\");\nfor (let element of elements) {\n\tresult.push({\n\t\t\"url\": element.href,\n\t\t\"text\": element.innerText\n\t});\n}\n\n// Call completion to finish\ncompletion(result);",
	"DisableAutocorrection": true,
	"DisableSmartDashes": true,
	"DisableSmartQuotes": true,
	"Key": "WFJavaScript",
	"Label": "JavaScript",
	"Multiline": true,
	"Placeholder": "JavaScript",
	"SyntaxHighlightingType": "JavaScript"
},
	
	*/
	// if(multiline)
	let parameterValue =
		((parameters[paramKey] as WFTextParameter) as string) ||
		data.DefaultValue ||
		"";
	return (
		<Parameter
			name={paramKey}
			visible={visible}
			className={
				"multilinetext " +
				(data.SyntaxHighlightingType ? "size604 " : "size243 ")
			}
		>
			<div className="textpreview">
				<pre>
					<code>{parameterValue}</code>
				</pre>
			</div>
			<textarea
				className="texteditor"
				value={parameterValue}
				onChange={e => updateParameter(paramKey, e.currentTarget.value)}
			></textarea>
		</Parameter>
	);
}

export function EnumParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsEnumerationParameterSpec>) {
	return (
		<LabeledParameter label={data.Label || "???"} visible={visible}>
			<SegmentedButton
				values={data.Items}
				selected={
					(parameters[paramKey] as string) ||
					// !!!!!!!!!!!might be variable
					data.DefaultValue ||
					"this should never happen"
				}
				onChange={ns => updateParameter(paramKey, ns)}
			/>
		</LabeledParameter>
	);
}

export function SegmentedButton({
	values,
	selected,
	onChange
}: {
	values: string[];
	selected: string;
	onChange: (newSelected: string) => void;
}) {
	let [idPrefix] = useState("" + Math.random());
	let ref = useRef<HTMLDivElement>(null);
	let width = ref && ref.current ? ref.current.clientWidth : 10000;
	return (
		<form>
			<div ref={ref} className="segmentedbutton">
				{values.map((value, i) => (
					<React.Fragment key={value}>
						<input
							type="radio"
							checked={value === selected}
							onChange={e => e.currentTarget.checked && onChange(value)}
							id={value + "-" + idPrefix}
							name="selection"
						></input>
						<label
							htmlFor={value + "-" + idPrefix}
							className={`${
								true &&
								i !== values.length - 1 &&
								value !== selected &&
								values[i + 1] !== selected
									? "rightline"
									: ""
							} ${
								true &&
								i !== 0 &&
								value !== selected &&
								values[i - 1] !== selected
									? "leftline"
									: ""
							}`}
						>
							<div>{value}</div>
						</label>
					</React.Fragment>
				))}
			</div>
		</form>
	);
}

export function ActionFullWidthShowMoreParameter({
	paramKey,
	parameters,
	updateParameter,
	visible
}: {
	paramKey: string;
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
	visible: boolean;
}) {
	let value = parameters[paramKey];
	return (
		<LabeledParameter
			className="showmore"
			label={value ? "Show Less" : "Show More"}
			onClick={() => updateParameter(paramKey, !value)}
			visible={visible}
		>
			<Icon icon={value ? "expandopen" : "expandclosed"} />
		</LabeledParameter>
	);
}

export function ParameterSummaryItem({
	item,
	parameters,
	updateParameter
}: {
	item: ParameterSummaryItem;
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
}) {
	if (typeof item === "string") {
		return <React.Fragment>{item}</React.Fragment>;
	}
	if (item.details.Class === "WFTextInputParameter") {
		let parameterValue = parameters[item.details.Key] as WFTextParameter;
		return (
			<SummaryTextInput
				value={(item.value || "") as string}
				onChange={v => updateParameter(item.details.Key, v)}
			/>
		);
	}
	return <div className="error">Unsupported class {item.details.Class}</div>;
}

export function ActionParameterSummary({
	items,
	parameters,
	updateParameter
}: {
	items: ParameterSummaryItem[];
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
}) {
	return (
		<div className="parametersummary">
			{items.map((v, i) => {
				// i should be good enough to use as a key
				return (
					<ParameterSummaryItem
						key={i}
						item={v}
						parameters={parameters}
						updateParameter={updateParameter}
					/>
				);
			})}
		</div>
	);
}

export function ActionTitle({
	icon,
	name
}: {
	icon: IconString;
	name: string;
}) {
	return (
		<h3 className="title">
			<Icon icon={icon} />
			<div className="titletext">
				<div>{name}</div>
			</div>
			<IconButton icon="delete" />
		</h3>
	);
}
