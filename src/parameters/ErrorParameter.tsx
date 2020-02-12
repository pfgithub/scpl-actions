import React from "react";
import { ShortcutsBaseParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ParameterProps } from "../ShortcutViewer";
import { LabeledParameterBase } from "./Parameter";

export function ErrorParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible,
	error,
}: ParameterProps<ShortcutsBaseParameterSpec> & { error?: string }) {
	return (
		<LabeledParameterBase label={data.Label || data.Class} visible={visible}>
			<span className="error">
				{error ? error : "not sure how to display parameter " + data.Class}
			</span>
		</LabeledParameterBase>
	);
}
