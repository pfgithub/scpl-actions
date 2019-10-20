import React from "react";
import { WFParameters } from "scpl/built/src/OutputData";
import { Icon } from "../Icon";
import { LabeledParameterBase } from "./Parameter";
import { UpdateParametersCallback } from "./Action";
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
