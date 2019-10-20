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
	WFTextParameter,
	WFDictionaryParameter
} from "scpl/built/src/OutputData";
import {
	ShortcutsParameterSpec,
	ShortcutsDictionaryParameterSpec
} from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";

import { ParameterBase } from "./Parameter";
import { cssdata, ParameterProps } from "../CSSDemo";
import { Icon, IconButton } from "../Icon";

import { useState } from "react";
import { startDragWatcher } from "../util";

export function ParameterSummary({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsDictionaryParameterSpec>) {
	// let parameterSummary = useMemo<ParameterSummaryItem[]>(
	// 	() =>
	// 		actionDetails.ParameterSummary
	// 			? (actionDetails.ParameterSummary as string)
	// 					.split(/\$\{(.+?)\}/)
	// 					.map((el, i) =>
	// 						i % 2 === 1
	// 							? {
	// 									details: actionDetails.Parameters!.find(p => p.Key === el)!,
	// 									value: actionOutput.WFWorkflowActionParameters![el]
	// 							  }
	// 							: el
	// 					)
	// 			: [],
	// 	[
	// 		actionDetails.ParameterSummary,
	// 		actionDetails.Parameters,
	// 		actionOutput.WFWorkflowActionParameters
	// 	]
	// );
}

// export function ParameterSummaryItem({
// 	item,
// 	parameters,
// 	updateParameter
// }: {
// 	item: ParameterSummaryItem;
// 	parameters: WFParameters;
// 	updateParameter: UpdateParametersCallback;
// }) {
// 	if (typeof item === "string") {
// 		return <React.Fragment>{item}</React.Fragment>;
// 	}
// 	if (item.details.Class === "WFTextInputParameter") {
// 		let parameterValue = parameters[item.details.Key] as WFTextParameter;
// 		return (
// 			<SummaryTextInput
// 				value={(item.value || "") as string}
// 				onChange={v => updateParameter(item.details.Key, v)}
// 			/>
// 		);
// 	}
// 	return <div className="error">Unsupported class {item.details.Class}</div>;
// }
//
// export function ActionParameterSummary({
// 	items,
// 	parameters,
// 	updateParameter
// }: {
// 	items: ParameterSummaryItem[];
// 	parameters: WFParameters;
// 	updateParameter: UpdateParametersCallback;
// }) {
// 	return (
// 		<div className="parametersummary">
// 			{items.map((v, i) => {
// 				// i should be good enough to use as a key
// 				return (
// 					<ParameterSummaryItem
// 						key={i}
// 						item={v}
// 						parameters={parameters}
// 						updateParameter={updateParameter}
// 					/>
// 				);
// 			})}
// 		</div>
// 	);
// }
