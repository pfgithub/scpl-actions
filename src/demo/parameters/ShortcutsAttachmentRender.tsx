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

export function ShortcutsAttachmentRender({
	attachment
}: {
	attachment: WFAttachmentData;
}) {
	let attachmentText = "";
	let attachmentIcon: BuiltinIcon | undefined = undefined;
	let attachmentExtraTextData = "";
	if (attachment.Type === "Variable") {
		let a = attachment as WFVariableAttachmentData;
		attachmentText = a.VariableName;
	} else if (attachment.Type === "ActionOutput") {
		let a = attachment as WFMagicVariableAttachmentData;
		attachmentText = a.OutputName;
		// get icon from OutputUUID;
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
			if (agg.Type === "WFDictionaryValueVariableAggrandizement") {
				attachmentExtraTextData = agg.DictionaryKey;
			}
		});
	}
	return (
		<button className="variable" onClick={e => e.stopPropagation()}>
			{attachmentText}
			{attachmentIcon ? <ActionIcon icon={attachmentIcon} /> : null}
			{attachmentExtraTextData ? (
				<span className="extratextdata">.{attachmentExtraTextData}</span>
			) : null}
		</button>
	);
}
