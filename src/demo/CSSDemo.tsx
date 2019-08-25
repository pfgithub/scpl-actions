import React, { ReactNode, useRef } from "react";

//@ts-ignore
import * as cssexported from "./CSSDemo.scss";
import { useState } from "react";
import { startDragWatcher } from "./util";

let cssdata: { scale: string } = cssexported;

type IconString =
	| "download"
	| "calculator"
	| "wifi"
	| "scripting"
	| "text"
	| "remove"
	| "reorder"
	| "add";

export default function CSSDemo(props: {}): JSX.Element {
	return (
		<div className="cssdemo">
			<Action icon="download" name="Network" />
		</div>
	);
}

/*
"is.workflow.actions.downloadurl": {
		"ActionClass": "WFDownloadURLAction",
		"ActionKeywords": [
			"URL",
			"web",
			"display",
			"site",
			"open",
			"show",
			"post",
			"put",
			"api",
			"curl",
			"wget",
			"http",
			"headers",
			"request",
			"form"
		],
		"Attribution": "Network",
		"Category": "Web",
		"Description": {
			"DescriptionNote": "To make a multipart HTTP request, choose \"Form\" as the request body type and add files as field values.",
			"DescriptionResult": "The fetched data",
			"DescriptionSummary": "Gets the contents of URLs passed into the action. Useful for downloading files and web content, or for making API requests."
		},
		"IconName": "Downloads.png",
		"Input": {
			"Multiple": true,
			"ParameterKey": "WFURL",
			"Required": true,
			"Types": ["WFURLContentItem"]
		},
		"InputPassthrough": false,
		"LastModifiedDate": "2016-11-11T06:00:00.000Z",
		"Name": "Get Contents of URL",
		"Output": {
			"Multiple": true,
			"OutputName": "Contents of URL",
			"Types": ["public.data"]
		},
		"ParameterSummary": "Get contents of ${WFURL}",
		"Parameters": [
			{
				"AllowsMultipleValues": false,
				"AutocapitalizationType": "None",
				"Class": "WFTextInputParameter",
				"DisableAutocorrection": true,
				"Key": "WFURL",
				"KeyboardType": "URL",
				"Label": "URL",
				"Placeholder": "URL",
				"TextContentType": "URL"
			},
			{
				"Class": "WFEnumerationParameter",
				"DefaultValue": "GET",
				"Description": "The HTTP method to use.",
				"DoNotLocalizeValues": true,
				"Items": ["GET", "POST", "PUT", "PATCH", "DELETE"],
				"Key": "WFHTTPMethod",
				"Label": "Method"
			},
			{
				"Class": "WFExpandingParameter",
				"Key": "ShowHeaders",
				"Label": "Headers"
			},
			{
				"Class": "WFDictionaryParameter",
				"ItemTypeName": "header",
				"Key": "WFHTTPHeaders",
				"Label": "Headers",
				"RequiredResources": [
					{
						"WFParameterKey": "ShowHeaders",
						"WFParameterValue": true,
						"WFResourceClass": "WFParameterRelationResource"
					}
				]
			},
			{
				"Class": "WFEnumerationParameter",
				"DefaultValue": "JSON",
				"DisallowedVariableTypes": ["Ask", "Variable"],
				"Items": ["JSON", "Form", "File"],
				"Key": "WFHTTPBodyType",
				"Label": "Request Body",
				"RequiredResources": [
					{
						"WFParameterKey": "WFHTTPMethod",
						"WFParameterRelation": "!=",
						"WFParameterValues": ["GET"],
						"WFResourceClass": "WFParameterRelationResource"
					}
				]
			},
			{
				"AllowedValueTypes": [0, 5],
				"Class": "WFDictionaryParameter",
				"ItemTypeName": "field",
				"Key": "WFFormValues",
				"Label": "Form Values",
				"RequiredResources": [
					{
						"WFParameterKey": "WFHTTPBodyType",
						"WFParameterValue": "Form",
						"WFResourceClass": "WFParameterRelationResource"
					},
					{
						"WFParameterKey": "WFHTTPMethod",
						"WFParameterRelation": "!=",
						"WFParameterValues": ["GET"],
						"WFResourceClass": "WFParameterRelationResource"
					}
				]
			},
			{
				"AllowedValueTypes": [0, 1, 2, 3, 4],
				"Class": "WFDictionaryParameter",
				"ItemTypeName": "field",
				"Key": "WFJSONValues",
				"Label": "JSON Values",
				"RequiredResources": [
					{
						"WFParameterKey": "WFHTTPBodyType",
						"WFParameterValue": "JSON",
						"WFResourceClass": "WFParameterRelationResource"
					},
					{
						"WFParameterKey": "WFHTTPMethod",
						"WFParameterRelation": "!=",
						"WFParameterValues": ["GET"],
						"WFResourceClass": "WFParameterRelationResource"
					}
				]
			},
			{
				"Class": "WFVariablePickerParameter",
				"Key": "WFRequestVariable",
				"Label": "File",
				"RequiredResources": [
					{
						"WFParameterKey": "WFHTTPBodyType",
						"WFParameterValue": "File",
						"WFResourceClass": "WFParameterRelationResource"
					},
					{
						"WFParameterKey": "WFHTTPMethod",
						"WFParameterRelation": "!=",
						"WFParameterValues": ["GET"],
						"WFResourceClass": "WFParameterRelationResource"
					}
				]
			}
		],
		"RequiredResources": ["WFRemoteServerAccessResource"],
		"ResidentCompatible": true,
		"ShortName": "Download URL",
		"Subcategory": "URLs"
	},
*/

export function Action({
	icon,
	name
}: {
	icon: IconString;
	name: string;
}): JSX.Element {
	return (
		<div className="action">
			<ActionTitle icon={icon} name={name} />
			<ActionParameterSummary
				text={[
					"Get contents of ",
					{ type: "input", value: "https://google.com" }
				]}
			/>
			<ActionFullWidthShowMoreParameter open={true} />
			<EnumParameter
				label="Method"
				values={["GET", "POST", "PUT", "PATCH", "DELETE"]}
				selected="POST"
			/>
			<ExpansionParameter label={"Headers"} open={false} />
			<EnumParameter
				label="Request Body"
				values={["JSON", "Form", "File"]}
				selected="JSON"
			/>
			<ShortcutsDictionaryParameter
				items={[
					{ key: "key", value: "value", type: "string", uid: "0" },
					{ key: "other key", value: "other value", type: "string", uid: "1" },
					{ key: "third key", value: "third value", type: "string", uid: "2" }
				]}
			/>
		</div>
	);
}

type DictionaryParameterValueType =
	| { key: string; type: "string"; value: string; uid: string }
	| { key: string; type: "number"; value: string; uid: string }
	| {
			key: string;
			type: "array";
			value: DictionaryParameterValueType[];
			uid: string;
	  }
	| {
			key: string;
			type: "dictionary";
			value: DictionaryParameterValueType[];
			uid: string;
	  }
	| { key: string; type: "boolean"; value: string; uid: string };

export function Parameter({
	className,
	children,
	name,
	...more
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	className?: string;
	children: ReactNode;
	name: string;
}) {
	return (
		<section
			className={"parameter " + (className || "")}
			aria-label={name + ", parameter"}
			{...more}
		>
			{children}
		</section>
	);
}

export function LabeledParameter({
	label,
	children,
	className
}: {
	className?: string;
	label: string;
	children: ReactNode;
}) {
	return (
		<Parameter className={className} name={label}>
			<div className="label">
				<div>{label}</div>
			</div>
			<div className="value">
				<div>{children}</div>
			</div>
		</Parameter>
	);
}

export function ShortcutsDictionaryParameter({
	items
}: {
	items: DictionaryParameterValueType[];
}) {
	let [fakeItems, setFakeItems] = useState(items);
	let [dragging, setDragging] = useState<
		| {
				uid: string;
				position: number;
				startIndex: number;
				index: number;
				dragging: boolean;
		  }
		| undefined
	>(undefined);
	let topElem = useRef<HTMLDivElement>(null);
	return (
		<div className="dictionaryparameter">
			<div ref={topElem} />
			{fakeItems.map((item, i) => {
				let isDragging = dragging && dragging.uid === item.uid;
				return [
					/*
					a
					  (2)
					b 
					c (3) so c, b needs to go up
					*/
					<Parameter
						name={"unnamed dictionary"}
						key={item.uid}
						className={
							"dictionary " +
							(isDragging && dragging!.dragging ? "dragging" : "")
						}
						style={
							isDragging
								? {
										transform: "translate(0, " + dragging!.position + "px)"
								  }
								: dragging
								? {
										transform:
											"translate(0, " +
											(i >= dragging.startIndex && i <= dragging.index
												? -88 * +cssdata.scale
												: i <= dragging.startIndex && i >= dragging.index
												? 88 * +cssdata.scale
												: 0) +
											"px)"
								  }
								: {}
						}
					>
						<div className="remove">
							<div>
								<Icon icon="remove" />
							</div>
						</div>
						<div className="key">
							<div>{item.key}</div>
						</div>
						<div className="line"></div>
						<div className="value">
							<div>{item.value}</div>
						</div>
						<div
							className="reorder"
							touch-action="none"
							onPointerDown={async e => {
								setDragging(
									(dragging = {
										uid: item.uid,
										position: 0,
										startIndex: i,
										index: i,
										dragging: true
									})
								);
								let lastPos = e.clientY;
								let lastOffset = 0;
								e.preventDefault();
								e.stopPropagation();
								await startDragWatcher(e.nativeEvent, e => {
									e.preventDefault();
									e.stopPropagation();
									let currentOffset = lastOffset + (e.clientY - lastPos);
									let realPosition = i * 88 * +cssdata.scale;
									let newRealPosition = realPosition + currentOffset;
									let newExpectedIndex = Math.round(
										newRealPosition / (88 * +cssdata.scale)
									);
									newExpectedIndex = Math.max(
										Math.min(newExpectedIndex, items.length - 1),
										0
									);
									setDragging(
										(dragging = {
											uid: item.uid,
											position: currentOffset,
											startIndex: dragging!.startIndex,
											index: newExpectedIndex,
											dragging: true
										})
									);
									lastOffset = currentOffset;
									lastPos = e.clientY;
								});
								let currentOffset = dragging!.position;
								let newExpectedIndex = dragging!.index;
								console.log(newExpectedIndex);
								setDragging(
									(dragging = {
										uid: dragging!.uid,
										position:
											(newExpectedIndex - dragging!.startIndex) *
											88 *
											+cssdata.scale,
										startIndex: dragging!.startIndex,
										index: newExpectedIndex,
										dragging: false
									})
								);
								await new Promise(r => setTimeout(r, 100));
								if (newExpectedIndex !== dragging!.startIndex) {
									let fakeItemsCopy = fakeItems.slice();
									fakeItemsCopy.splice(
										newExpectedIndex,
										0,
										...fakeItemsCopy.splice(dragging!.startIndex, 1)
									);
									setFakeItems(fakeItemsCopy);
									fakeItems = fakeItemsCopy;
									currentOffset -= (newExpectedIndex - i) * 88 * +cssdata.scale;
									i = newExpectedIndex;
								}
								setDragging(undefined);
							}}
						>
							<div>
								<Icon icon="reorder" />
							</div>
						</div>
					</Parameter>
				];
			})}
			<Parameter name={"add new field"} className={"addnewfield"}>
				<div className="add">
					<div>
						<Icon icon="add" />
					</div>
				</div>
				<div className="description">
					<div>Add new field</div>
				</div>
			</Parameter>
		</div>
	);
}

export function ExpansionParameter({
	label,
	open
}: {
	label: string;
	open: boolean;
}) {
	return (
		<LabeledParameter label={label}>
			<div
				className={"icon " + (open ? "expandopen" : "expandclosed")}
				aria-label={"expand " + (open ? "open" : "closed")}
			></div>
		</LabeledParameter>
	);
}

export function EnumParameter({
	label,
	values,
	selected
}: {
	label: string;
	values: string[];
	selected: string;
}) {
	return (
		<LabeledParameter label={label}>
			<SegmentedButton values={values} selected={selected} />
		</LabeledParameter>
	);
}

export function SegmentedButton({
	values,
	selected
}: {
	values: string[];
	selected: string;
}) {
	let [idPrefix] = useState("" + Math.random());
	let [realSelected, setRealSelected] = useState(selected);
	return (
		<form>
			<div className="segmentedbutton">
				{values.map((value, i) => (
					<React.Fragment key={value}>
						<input
							type="radio"
							checked={value === realSelected}
							onChange={e => e.currentTarget.checked && setRealSelected(value)}
							id={value + "-" + idPrefix}
							name="selection"
						></input>
						<label
							htmlFor={value + "-" + idPrefix}
							className={`${
								true &&
								i !== values.length - 1 &&
								value !== realSelected &&
								values[i + 1] !== realSelected
									? "rightline"
									: ""
							} ${
								true &&
								i !== 0 &&
								value !== realSelected &&
								values[i - 1] !== realSelected
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

export function ActionFullWidthShowMoreParameter({ open }: { open: boolean }) {
	return (
		<LabeledParameter
			className="showmore"
			label={open ? "Show Less" : "Show More"}
		>
			<div
				className={"icon " + (open ? "expandopen" : "expandclosed")}
				aria-label={"expand " + (open ? "open" : "closed")}
			></div>
		</LabeledParameter>
	);
}

export function ActionParameterSummary({
	text
}: {
	text: (string | { type: "input"; value: string })[];
}) {
	return (
		<div className="parametersummary">
			{text.map((v, i) => {
				// i should be good enough to use as a key
				if (typeof v === "string") {
					return <React.Fragment key={i}>{v}</React.Fragment>;
				}
				return (
					<div className="input" key={i} contentEditable={true}>
						{v.value}
					</div>
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
			<button className="icon delete" aria-label={"delete action"}></button>
		</h3>
	);
}

export function Icon({ icon }: { icon: IconString }) {
	return <div className={"icon " + icon} aria-label={icon + " icon"}></div>;
}
