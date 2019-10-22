import React, { useState } from "react";
import { ShortcutsTextInputParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFParameters,
	WFTextParameter
} from "shortcuts3types/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";
import { ShortcutsAttachmentRender } from "./ShortcutsAttachmentRender";

import "./ShortcutsTextRender.scss";

export function ShortcutsTextRender({ text }: { text: WFTextParameter }) {
	if (typeof text === "string") {
		return <span className="WFTextTokenString">{text}</span>;
	}
	if (text.Value.string == null) {
		return <span className="error">Text has no string</span>;
	}
	let textParts = text.Value.string.split("\ufffc");
	let char = 0;
	return (
		<span className="WFTextTokenString">
			{textParts.map((part, i) => {
				char += part.length;
				let attachment = text.Value.attachmentsByRange[`{${char}, 1}`];
				char++;
				if (attachment) {
					return (
						<>
							{part}
							<ShortcutsAttachmentRender attachment={attachment} />
						</>
					);
				}
				return <>{part}</>;
			})}
		</span>
	);
}
