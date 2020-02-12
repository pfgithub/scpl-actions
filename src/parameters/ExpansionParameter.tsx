import React from "react";
import { ShortcutsExpandingParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ParameterProps } from "../ShortcutViewer";
import { Icon } from "../Icon";
import { LabeledParameterBase } from "./Parameter";

export function ExpansionParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible,
}: ParameterProps<ShortcutsExpandingParameterSpec>) {
	return (
		<LabeledParameterBase
			label={data.Label || data.Class}
			onClick={() => updateParameter(paramKey, !parameters[paramKey])}
			visible={visible}
		>
			<Icon icon={parameters[paramKey] ? "expandopen" : "expandclosed"} />
		</LabeledParameterBase>
	);
}
