import React, { useCallback, useMemo, useRef } from "react";
import { getActionFromID } from "shortcuts3types/built/src/ActionData";
import { ShortcutsActionSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsActionSpec";
import { ShortcutsParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ShortcutsParameterRelationResourceRelationSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsResourceSpec";
import { WFAction, WFParameter } from "shortcuts3types/built/src/OutputData";
import { Icon, IconButton, IconString, ActionIcon } from "../Icon";
import {
	ActionFullWidthShowMoreParameter,
	Parameter,
	ErrorParameter
} from "./Parameter";
import { ActionParameterSummary } from "./Summary";
import { BuiltinIcon } from "../icons";
import { ShortcutData } from "./ShortcutData";
import { ErrorBoundary } from "../ShortcutViewer";

export type UpdateParametersCallback = (
	key: string,
	newParameter: WFParameter
) => void;

export type ParameterSummaryItem =
	| string
	| { details: ShortcutsParameterSpec; value: WFParameter };

export function Action({
	actionOutput,
	setActionOutput,
	indentLevel,
	shortcut
}: {
	actionOutput: WFAction;
	setActionOutput: (val: WFAction) => void;
	indentLevel: number;
	shortcut: ShortcutData;
}): JSX.Element {
	let identifier = actionOutput.WFWorkflowActionIdentifier;
	let _tempAction = getActionFromID(identifier);
	if (!_tempAction) {
		return <>"error action not found with name " + {identifier}</>;
	}
	return (
		<DefinitelyAction
			actionOutput={actionOutput}
			setActionOutput={setActionOutput}
			actionDetails={_tempAction._data}
			indentLevel={indentLevel}
			shortcut={shortcut}
		/>
	);
}

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
}

export function DefinitelyAction({
	actionOutput,
	setActionOutput,
	actionDetails,
	indentLevel,
	shortcut
}: {
	actionOutput: WFAction;
	setActionOutput: (val: WFAction) => void;
	actionDetails: ShortcutsActionSpec;
	indentLevel: number;
	shortcut: ShortcutData;
}): JSX.Element {
	let parameterSummary = useMemo<ParameterSummaryItem[]>(
		() =>
			actionDetails.ParameterSummary
				? typeof actionDetails.ParameterSummary === "string"
					? actionDetails.ParameterSummary.split(/\$\{(.+?)\}/).map((el, i) =>
							i % 2 === 1
								? {
										details: actionDetails.Parameters!.find(p => p.Key === el)!,
										value: actionOutput.WFWorkflowActionParameters![el]
								  }
								: el
					  )
					: []
				: [],
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
	let remainingParameters = actionDetails.Parameters
		? actionDetails.Parameters!.filter(param =>
				parameterSummary.every(item =>
					typeof item === "string" ? true : param.Key !== item.details.Key
				)
		  )
		: [];

	let useShowMoreButton = !(
		actionDetails.ParameterCollapsingBehavior === "Never" ||
		parameterSummary.length === 0
	);
	if (
		actionOutput.WFWorkflowActionParameters!["__ScPLShowMore"] === undefined
	) {
		actionOutput.WFWorkflowActionParameters!["__ScPLShowMore"] =
			actionDetails.ParameterCollapsingBehavior === "DefaultBeginExpanded"
				? true
				: false;
	}
	let showMore = useShowMoreButton
		? !!actionOutput.WFWorkflowActionParameters!["__ScPLShowMore"]
		: true;
	let selfRef = useRef<HTMLDivElement>(null);
	if (selfRef.current) {
		shortcut.updateActionForUUID(
			actionOutput.WFWorkflowActionParameters!.UUID as string,
			{
				jumpTo: () => {
					selfRef.current!.scrollIntoView({ behavior: "smooth" });
				}
			}
		);
	}
	let showCode = !!actionOutput.WFWorkflowActionParameters!["__ScPLShowCode"];
	return (
		<>
			<div
				ref={selfRef}
				className={
					"action " +
					((actionDetails.ActionClass === "WFCommentAction" ? "comment " : "") +
						`indent${Math.min(indentLevel, 4)} `)
				}
			>
				<ActionTitle
					icon={actionDetails.IconName || "NoIcon.png"}
					name={
						actionDetails.Attribution ||
						(parameterSummary.length === 0
							? actionDetails.Name
							: actionDetails.Category) ||
						"could not determine name"
					}
					onAboutClick={() => updateParameter("__ScPLShowCode", !showCode)}
					onCollapseClick={() =>
						updateParameter(
							"__ScPLIndentCollapsed",
							!actionOutput.WFWorkflowActionParameters!.__ScPLIndentCollapsed
						)
					}
				/>
				{showCode ? (
					<textarea
						className="codedisplay"
						value={JSON.stringify(actionOutput, null, "\t")}
					/>
				) : null}
				{parameterSummary.length > 0 ? (
					<ActionParameterSummary
						items={parameterSummary}
						shortcut={shortcut}
						parameters={actionOutput.WFWorkflowActionParameters!}
						updateParameter={updateParameter}
					/>
				) : null}
				{remainingParameters.length > 0 ? (
					<>
						{useShowMoreButton ? (
							<ActionFullWidthShowMoreParameter
								paramKey={"__ScPLShowMore"}
								parameters={actionOutput.WFWorkflowActionParameters!}
								updateParameter={updateParameter}
								visible={true}
							/>
						) : null}
						{remainingParameters.map(param => {
							let show = showMore
								? param.RequiredResources
									? param.RequiredResources.every(resource => {
											if (typeof resource === "string") {
												return true;
											}
											if (
												resource.WFResourceClass ===
												"WFParameterRelationResource"
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
									: true
								: false;
							return (
								<Parameter
									key={param.Key}
									paramKey={param.Key}
									data={param}
									parameters={actionOutput.WFWorkflowActionParameters!}
									updateParameter={updateParameter}
									visible={show}
									shortcut={shortcut}
								/>
							);
						})}
					</>
				) : null}
			</div>
		</>
	);
}

export function ActionTitle({
	icon,
	name,
	onAboutClick,
	onCollapseClick
}: {
	icon: BuiltinIcon;
	name: string;
	onAboutClick: () => void;
	onCollapseClick: () => void;
}) {
	return (
		<h3 className="title">
			<ActionIcon icon={icon} />
			<div className="titletext">
				<div>{name}</div>
			</div>
			<div className="actionicons">
				<IconButton icon="expandclosed" onClick={onAboutClick} />
				<IconButton icon="expandopen" onClick={onCollapseClick} />
				<IconButton icon="delete" />
			</div>
		</h3>
	);
}
