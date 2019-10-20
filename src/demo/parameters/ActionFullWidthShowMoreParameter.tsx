import React from "react";
import { WFParameters } from "shortcuts3types/built/src/OutputData";
import { Icon } from "../Icon";
import { UpdateParametersCallback } from "./Action";
import { LabeledParameterBase } from "./Parameter";

export function ActionFullWidthShowMoreParameter({
	paramKey,
	parameters,
	updateParameter,
	visible
}: {
	paramKey: string;
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
	visible: boolean;
}) {
	let value = parameters[paramKey];
	return (
		<LabeledParameterBase
			className="showmore"
			label={value ? "Show Less" : "Show More"}
			onClick={() => updateParameter(paramKey, !value)}
			visible={visible}
		>
			<Icon icon={value ? "expandopen" : "expandclosed"} />
		</LabeledParameterBase>
	);
}
