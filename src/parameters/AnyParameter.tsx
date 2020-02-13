import React from "react";
import { ShortcutsBaseParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ParameterProps } from "../ShortcutViewer";
import { LabeledParameterBase } from "./Parameter";
import { ShortcutsSerializationTypeRender } from "./ShortcutsSerializationTypeRender";

export function AnyParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible,
	error,
	shortcut,
}: ParameterProps<ShortcutsBaseParameterSpec> & { error?: string }) {
	return (
		<LabeledParameterBase label={data.Label || data.Class} visible={visible}>
			<ShortcutsSerializationTypeRender shortcut={shortcut} value={parameters[paramKey]} />
		</LabeledParameterBase>
	);
}
