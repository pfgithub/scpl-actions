import React from "react";
import { ShortcutsBaseParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ParameterProps } from "../CSSDemo";
import { LabeledParameterBase } from "./Parameter";

export function ErrorParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsBaseParameterSpec>) {
	return (
		<LabeledParameterBase label={data.Label || data.Class} visible={visible}>
			Not Supported // todo json editor
		</LabeledParameterBase>
	);
}
