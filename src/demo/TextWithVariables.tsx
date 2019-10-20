import React, { useRef, useEffect } from "react";
import "./TextWithVariables.scss";

export function textWithVariablesInit(): HTMLDivElement {
	let node = document.createElement("div");
	node.classList.add("textinput");
	node.contentEditable = "true";
	node.innerHTML =
		'Text With <a class="variable" spellcheck="false">Variable Test</a> Variables.';
	node.addEventListener("input", () => {
		console.log(node.textContent);
		console.log(node.innerHTML);
		// node.innerHTML = node.innerHTML;
	});
	node.addEventListener("copy", e => {
		const selection = window.getSelection();
		console.log(e.clipboardData);
	});
	document.addEventListener("selectionchange", e => {
		const selection = window.getSelection();
		console.log(selection, e);
	});
	return node;
}

export function TextWithVariables() {
	let ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref && ref.current) {
			let twv = textWithVariablesInit();
			ref.current!.appendChild(twv);
		}
	}, [ref]);
	return <div ref={ref} />;
}
