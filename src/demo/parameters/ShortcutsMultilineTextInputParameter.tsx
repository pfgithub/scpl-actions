import React, { useRef } from "react";
import { WFTextParameter } from "scpl/built/src/OutputData";
import { ShortcutsTextInputParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { Highlight } from "../Highlight";
import { ParameterProps } from "../CSSDemo";
import { useState } from "react";
import { ParameterBase } from "./Parameter";
export function ShortcutsMultilineTextInputParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsTextInputParameterSpec>) {
	/*
    {
    "AutocapitalizationType": "None",
    "Class": "WFTextInputParameter",
    "DefaultValue": "var result = [];\n// Get all links from the page\nvar elements = document.querySelectorAll(\"a\");\nfor (let element of elements) {\n\tresult.push({\n\t\t\"url\": element.href,\n\t\t\"text\": element.innerText\n\t});\n}\n\n// Call completion to finish\ncompletion(result);",
    "DisableAutocorrection": true,
    "DisableSmartDashes": true,
    "DisableSmartQuotes": true,
    "Key": "WFJavaScript",
    "Label": "JavaScript",
    "Multiline": true,
    "Placeholder": "JavaScript",
    "SyntaxHighlightingType": "JavaScript"
},
    
    */
	// if(multiline)
	let parameterValue =
		((parameters[paramKey] as WFTextParameter) as string) ||
		data.DefaultValue ||
		"";
	let [scrollTop, setScrollTop] = useState(0);
	let preRef = useRef<HTMLPreElement>(null); // for ios overscroll support (state breaks it)
	return (
		<ParameterBase
			name={paramKey}
			visible={visible}
			className={
				"multilinetext " +
				(data.SyntaxHighlightingType ? "size604 " : "size243 ")
			}
		>
			<div
				className={
					"textpreview " + (data.SyntaxHighlightingType ? "code" : "text")
				}
			>
				{data.SyntaxHighlightingType ? (
					<pre ref={preRef}>
						<Highlight language={data.SyntaxHighlightingType!.toLowerCase()}>
							{"" + parameterValue}
						</Highlight>
					</pre>
				) : (
					<>{"" + parameterValue}</>
				)}
			</div>
			<textarea
				className={
					"texteditor " + (data.SyntaxHighlightingType ? "code" : "text")
				}
				value={parameterValue}
				spellCheck={false}
				autoCorrect={undefined}
				onChange={e => updateParameter(paramKey, e.currentTarget.value)}
				onScroll={
					e =>
						(preRef.current!.style.transform = `translate(0, ${-e.currentTarget
							.scrollTop}px)`) // unfortunately, .scrollTop disables overscroll on iOS safari (but not mac safari)
				}
			></textarea>
		</ParameterBase>
	);
}
