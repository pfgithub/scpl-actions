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
	WFTextParameter
} from "scpl/built/src/OutputData";
import { ShortcutsParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";

export type IconString =
	| "download"
	| "calculator"
	| "wifi"
	| "scripting"
	| "text"
	| "remove"
	| "reorder"
	| "add"
	| "expandopen"
	| "expandclosed"
	| "delete";

export function Icon({ icon }: { icon: IconString }) {
	return <div className={"icon " + icon} aria-label={icon + " icon"}></div>;
}

export function IconButton(
	props: { icon: IconString } & React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>
) {
	return (
		<button
			className={"icon " + props.icon}
			aria-label={props.icon + ""}
			{...props}
		></button>
	);
}