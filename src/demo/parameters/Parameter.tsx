import React, { ReactNode, useEffect, useState } from "react";
import { ShortcutsParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ParameterProps } from "../CSSDemo";
import { ActionFullWidthShowMoreParameter } from "./ActionFullWidthShowMoreParameter";
import { EnumParameter } from "./EnumParameter";
import { ErrorParameter } from "./ErrorParameter";
import { ExpansionParameter } from "./ExpansionParameter";
import { ShortcutsDictionaryParameter } from "./ShortcutsDictionaryParameter";
import { ShortcutsMultilineTextInputParameter } from "./ShortcutsMultilineTextInputParameter";

export {
	EnumParameter,
	ExpansionParameter,
	ErrorParameter,
	ActionFullWidthShowMoreParameter,
	ShortcutsMultilineTextInputParameter
};

export function Parameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsParameterSpec>) {
	if (data.Class === "WFEnumerationParameter") {
		return (
			<EnumParameter
				paramKey={paramKey}
				data={data}
				parameters={parameters}
				updateParameter={updateParameter}
				visible={visible}
			/>
		);
	} else if (data.Class === "WFExpandingParameter") {
		return (
			<ExpansionParameter
				paramKey={paramKey}
				data={data}
				parameters={parameters}
				updateParameter={updateParameter}
				visible={visible}
			/>
		);
	} else if (data.Class === "WFDictionaryParameter") {
		return (
			<ShortcutsDictionaryParameter
				paramKey={paramKey}
				data={data}
				parameters={parameters}
				updateParameter={updateParameter}
				visible={visible}
			/>
		);
	} else if (data.Class === "WFTextInputParameter" && data.Multiline) {
		return (
			<ShortcutsMultilineTextInputParameter
				paramKey={paramKey}
				data={data}
				parameters={parameters}
				updateParameter={updateParameter}
				visible={visible}
			/>
		);
	} else {
		return (
			<ErrorParameter
				paramKey={paramKey}
				data={data}
				parameters={parameters}
				updateParameter={updateParameter}
				visible={visible}
			/>
		);
	}
}

export function Parameters() {}

export function ParameterBase({
	className,
	children,
	name,
	visible,
	initAnimation,
	...more
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	className?: string;
	children: ReactNode;
	name: string;
	visible: boolean;
	initAnimation?: boolean; //
}) {
	let [ourViewState, setOurViewState] = useState<
		"visible" | "revealing" | "collapsing" | "collapsed"
	>(visible ? (initAnimation ? "collapsed" : "visible") : "collapsed");
	useEffect(() => {
		if (
			visible &&
			(ourViewState === "revealing" || ourViewState === "visible")
		) {
			return;
		}
		if (
			!visible &&
			(ourViewState === "collapsing" || ourViewState === "collapsed")
		) {
			return;
		}
		if (visible) {
			setOurViewState("revealing");
			setTimeout(() => {
				setOurViewState("visible");
			}, 20);
			// return () => clearTimeout(timeout);
			return;
		}
		if (ourViewState !== "collapsing") {
			setOurViewState("collapsing");
		}
		setTimeout(() => {
			setOurViewState("collapsed");
		}, 100);
		// return () => clearTimeout(timeout);
	}, [ourViewState, visible]);
	return (
		<section
			className={"parameter " + (className || "") + " " + ourViewState}
			aria-label={name + ", parameter"}
			{...more}
		>
			{children}
		</section>
	);
}

export function LabeledParameterBase({
	label,
	children,
	className,
	onClick,
	visible
}: {
	className?: string;
	label: string;
	children: ReactNode;
	onClick?: () => void;
	visible: boolean;
}) {
	return (
		<ParameterBase
			className={className}
			name={label}
			onClick={onClick}
			visible={visible}
		>
			<div className="label">
				<div>{label}</div>
			</div>
			<div className="value">
				<div>{children}</div>
			</div>
		</ParameterBase>
	);
}
