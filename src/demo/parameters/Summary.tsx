import React, { useState } from "react";
import { ShortcutsTextInputParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { WFParameters, WFTextParameter } from "scpl/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";

export function ParameterSummaryItemComponent({
	item,
	parameters,
	updateParameter
}: {
	item: ParameterSummaryItem;
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
}) {
	if (typeof item === "string") {
		return <React.Fragment>{item}</React.Fragment>;
	}
	if (item.details.Class === "WFTextInputParameter") {
		let parameterValue = parameters[item.details.Key] as WFTextParameter;
		return (
			<SummaryTextInput
				data={item.details}
				value={(item.value || "") as string}
				onChange={v => updateParameter(item.details.Key, v)}
			/>
		);
	}
	return <div className="error">Unsupported class {item.details.Class}</div>;
}

export function ActionParameterSummary({
	items,
	parameters,
	updateParameter
}: {
	items: ParameterSummaryItem[];
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
}) {
	return (
		<div className="parametersummary">
			{items.map((v, i) => {
				// i should be good enough to use as a key
				return (
					<ParameterSummaryItemComponent
						key={i}
						item={v}
						parameters={parameters}
						updateParameter={updateParameter}
					/>
				);
			})}
		</div>
	);
}

export function SummaryTextInput({
	value,
	onChange,
	data
}: {
	value: string;
	data: ShortcutsTextInputParameterSpec;
	onChange: (v: string) => void;
}) {
	let [editing, setEditing] = useState(false);

	if (!editing) {
		if (!value) {
			return (
				<span className="input placeholder" onClick={e => setEditing(true)}>
					{"" + data.Placeholder}
				</span> // !!!!accessability
			);
		}
		return (
			<span className="input" onClick={e => setEditing(true)}>
				{value}
			</span> // !!!!accessability
		);
	}
	return (
		<input
			className="input"
			value={value}
			autoFocus
			placeholder={"" + data.Placeholder}
			onChange={e => onChange(e.currentTarget.value)}
			onBlur={e => setEditing(false)} // !!!!bad
		/>
	);
}
