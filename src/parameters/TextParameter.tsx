import React, { useState, useEffect, useCallback } from "react";
import { WFTextInputParameter } from "scpl/built/src/Parameters/WFTextInputParameter";

const ESCAPEDQUOTEDSTRING = (value: string) =>
	value
		.replace(/(["\\\n])/g, d => (d === "\n" ? "\\n" : `\\${d}`))
		.replace(/\r/g, "");
const DQUOTEDSTRING = (value: string) => `"${ESCAPEDQUOTEDSTRING(value)}"`;

export function TextParameter(props: {
	parameter: WFTextInputParameter;
	updateArgumentValue: (value: string) => void;
}) {
	let [textValue, setTextValue] = useState("text...");
	useEffect(() => {
		props.updateArgumentValue(DQUOTEDSTRING(textValue));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [textValue]);

	let changeCallback = useCallback(
		e => setTextValue(e.currentTarget.value),
		[]
	);

	return (
		<div>
			{props.parameter._data.Multiline ? (
				<textarea value={textValue} onChange={changeCallback} />
			) : (
				<input type="text" value={textValue} onChange={changeCallback} />
			)}
		</div>
	);
}
