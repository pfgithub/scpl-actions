import React, { useState } from "react";
import { ShortcutsTextInputParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFParameters,
	WFTextParameter,
	WFParameter,
} from "shortcuts3types/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";
import { ShortcutsAttachmentRender } from "./ShortcutsAttachmentRender";

import "./ShortcutsTextRender.scss";
import { ShortcutsTextRender } from "./ShortcutsTextRender";
import { ShortcutData } from "./ShortcutData";

export function ShortcutsErrorRender({
	value,
}: {
	shortcut: ShortcutData;
	value: WFParameter;
}) {
	return (
		<span className="error">
			Not implemented yet: {(value as any).WFSerializationType}.{" "}
			<button
				onClick={() => {
					let text = JSON.stringify(value, null, "\t");
					const myWindow = window.open("", "_blank", "location=no");
					if (!myWindow) {
						alert("Failed to open window.");
						return;
					}
					const codeTag = myWindow.document.createElement("textarea");
					codeTag.setAttribute("id", "hello");
					codeTag.setAttribute(
						"style",
						"position:fixed;top:0;left:0;width:100%;height:100%;",
					);
					codeTag.value = text;
					myWindow.document.body.appendChild(codeTag);
					const textarea = codeTag;
					const range = myWindow.document.createRange();
					range.selectNode(textarea);
					const selection = myWindow.getSelection();
					selection && selection.addRange(range);
					textarea.select();
				}}
			>
				View JSON
			</button>
		</span>
	);
}

export function ShortcutsSerializationTypeRender({
	value,
	shortcut,
}: {
	value: WFParameter;
	shortcut: ShortcutData;
}) {
	if (value === "") {
		return (
			<span className="error">
				Empty content. This should have been caught earlier.
			</span>
		);
	}
	if (typeof value === "string") {
		return <ShortcutsTextRender shortcut={shortcut} text={value} />;
	}
	if (typeof value === "number") {
		return <ShortcutsTextRender shortcut={shortcut} text={"" + value} />;
	}
	if (typeof value === "boolean") {
		return <ShortcutsTextRender shortcut={shortcut} text={"" + value} />;
	}
	if (Array.isArray(value)) {
		return <ShortcutsErrorRender shortcut={shortcut} value={value} />;
		// return <ShortcutsListRender items={value} />; // WFParameter[] and a plus button
	}
	if (value.WFSerializationType === "WFTextTokenString") {
		return <ShortcutsTextRender shortcut={shortcut} text={value} />;
	}
	if (value.WFSerializationType === "WFTextTokenAttachment") {
		return (
			<ShortcutsAttachmentRender shortcut={shortcut} attachment={value.Value} />
		);
	}
	if (value.WFSerializationType === "WFDictionaryFieldValue") {
		return <ShortcutsErrorRender shortcut={shortcut} value={value} />;
	}
	if (value.WFSerializationType === "WFTimeOffsetValue") {
		return <ShortcutsErrorRender shortcut={shortcut} value={value} />;
	}
	if (value.WFSerializationType === "WFContentPredicateTableTemplate") {
		return <ShortcutsErrorRender shortcut={shortcut} value={value} />;
	}
	if (value.WFSerializationType === "WFErrorParameter") {
		return <ShortcutsErrorRender shortcut={shortcut} value={value} />;
	}
	return <ShortcutsErrorRender shortcut={shortcut} value={value} />;
}
