import React from "react";
import { ShortcutsExpandingParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { ParameterProps } from "../CSSDemo";
import { Icon } from "../Icon";
import { LabeledParameterBase } from "./Parameter";
export function ExpansionParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsExpandingParameterSpec>) {
	return (
		<LabeledParameterBase
			label={data.Label || "???"}
			onClick={() => updateParameter(paramKey, !parameters[paramKey])}
			visible={visible}
		>
			<Icon icon={parameters[paramKey] ? "expandopen" : "expandclosed"} />
		</LabeledParameterBase>
	);
}
