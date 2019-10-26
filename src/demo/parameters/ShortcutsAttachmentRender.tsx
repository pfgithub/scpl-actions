import React, { useState } from "react";
import { ShortcutsTextInputParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFParameters,
	WFTextParameter,
	WFAttachmentData,
	WFVariableAttachmentData,
	WFMagicVariableAttachmentData
} from "shortcuts3types/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";
import { BuiltinIcon } from "../icons";
import { ActionIcon } from "../Icon";
import { ShortcutData } from "./ShortcutData";

export function ShortcutsAttachmentRender({
	shortcut,
	attachment
}: {
	shortcut: ShortcutData;
	attachment: WFAttachmentData;
}) {
	let attachmentText = "";
	let attachmentIcon: BuiltinIcon | undefined = undefined;
	let attachmentAsType = "";
	let attachmentGetType = "";
	let attachmentForKeyType = "";
	let variableIsBroken = false;
	let jumpCallback: () => void | undefined;
	let [variableEditorOpen, setVariableEditorOpen] = useState(false);
	if (attachment.Type === "Variable") {
		let a = attachment as WFVariableAttachmentData;
		attachmentText = a.VariableName;
	} else if (attachment.Type === "ActionOutput") {
		let a = attachment as WFMagicVariableAttachmentData;
		attachmentText = a.OutputName;
		let actionData = shortcut.getActionFromUUID(a.OutputUUID);
		if (!actionData) variableIsBroken = true;
		else {
			attachmentIcon = actionData.spec ? actionData.spec.IconName : undefined;
			jumpCallback = actionData.jumpTo;
		}
	} else if (attachment.Type === "Clipboard") {
		attachmentText = "Clipboard";
		attachmentIcon = "Clipboard.png";
	} else if (attachment.Type === "Ask") {
		attachmentText = "Ask Each Time";
	} else if (attachment.Type === "CurrentDate") {
		attachmentText = "Current Date";
		attachmentIcon = "Date.png";
	} else if (attachment.Type === "ExtensionInput") {
		attachmentText = "Shortcut Input";
		attachmentIcon = "ShortcutsExtension.png";
	} else if (attachment.Type === "Input") {
		attachmentText = "Action Input";
	}
	if (attachment.Aggrandizements) {
		attachment.Aggrandizements.forEach(agg => {
			if (agg.Type === "WFCoercionVariableAggrandizement") {
				attachmentAsType = agg.CoercionItemClass;
			}
			if (agg.Type === "WFPropertyVariableAggrandizement") {
				attachmentGetType = agg.PropertyName;
			}
			if (agg.Type === "WFDictionaryValueVariableAggrandizement") {
				attachmentForKeyType = agg.DictionaryKey;
			}
		});
	}
	return (
		<button
			className={"variable" + (variableIsBroken ? " broken" : "")}
			onClick={e => {
				e.stopPropagation();
				// setVariableEditorOpen(!variableEditorOpen);
				if (jumpCallback) jumpCallback();
			}}
		>
			{attachmentIcon ? <ActionIcon icon={attachmentIcon} /> : null}
			{attachmentText}
			{attachmentAsType ? (
				<span className="astype"> as {attachmentAsType}</span>
			) : null}
			{attachmentGetType ? (
				<span className="gettype"> get {attachmentGetType}</span>
			) : null}
			{attachmentForKeyType ? (
				<span className="forkey"> key {attachmentForKeyType}</span>
			) : null}
		</button>
	);
}
