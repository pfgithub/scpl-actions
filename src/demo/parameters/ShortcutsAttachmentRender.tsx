import React, { useState } from "react";
import { ShortcutsTextInputParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFParameters,
	WFTextParameter,
	WFAttachmentData
} from "shortcuts3types/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";

export function ShortcutsAttachmentRender({
	attachment
}: {
	attachment: WFAttachmentData;
}) {
	return (
		<button className="variable" onClick={e => e.stopPropagation()}>
			{JSON.stringify(attachment)}
		</button>
	);
}
