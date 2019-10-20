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

import {
	ParameterBase,
	Parameter,
	ActionFullWidthShowMoreParameter
} from "./Parameter";
import { cssdata, ParameterProps } from "../CSSDemo";

import { useState } from "react";
import { startDragWatcher } from "../util";

import { Icon, IconButton, IconString } from "../Icon";
import { ShortcutsActionSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsActionSpec";
import { ShortcutsParameterRelationResourceRelationSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsResourceSpec";
import { ActionParameterSummary } from "./Summary";

export type UpdateParametersCallback = (
	key: string,
	newParameter: WFParameter
) => void;

export type ParameterSummaryItem =
	| string
	| { details: ShortcutsParameterSpec; value: WFParameter };

export function Action({
	actionOutput,
	setActionOutput
}: {
	actionOutput: WFAction;
	setActionOutput: (val: WFAction) => void;
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
	return false;
}

export function DefinitelyAction({
	actionOutput,
	setActionOutput,
	actionDetails
}: {
	actionOutput: WFAction;
	setActionOutput: (val: WFAction) => void;
	actionDetails: ShortcutsActionSpec;
}): JSX.Element {
	let parameterSummary = useMemo<ParameterSummaryItem[]>(
		() =>
			actionDetails.ParameterSummary
				? (actionDetails.ParameterSummary as string)
						.split(/\$\{(.+?)\}/)
						.map((el, i) =>
							i % 2 === 1
								? {
										details: actionDetails.Parameters!.find(p => p.Key === el)!,
										value: actionOutput.WFWorkflowActionParameters![el]
								  }
								: el
						)
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
					return (
						<Parameter
							paramKey={param.Key}
							data={param}
							parameters={actionOutput.WFWorkflowActionParameters!}
							updateParameter={updateParameter}
							visible={show}
						/>
					);
				})}
			</div>
		</>
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
