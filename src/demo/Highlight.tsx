import hljs from "highlight.js";
import React, { useEffect, useRef } from "react";
import "./Highlight.scss";

export function Highlight({
	language,
	children: code
}: {
	language: string;
	children: string;
}) {
	let ref = useRef<HTMLElement>(null);
	useEffect(() => {
		if (ref.current) {
			hljs.highlightBlock(ref.current);
		}
	}, [code]);
	return (
		<code className={language} ref={ref}>
			{code}
		</code>
	);
}
