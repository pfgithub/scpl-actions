import React, { useState } from "react";
import {
	ShortcutsTextInputParameterSpec,
	ShortcutsStepperParameterSpec,
} from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFParameters,
	WFTextParameter,
	WFAttachmentParameter,
} from "shortcuts3types/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";
import { ShortcutsTextRender } from "./ShortcutsTextRender";
import { ShortcutsSerializationTypeRender } from "./ShortcutsSerializationTypeRender";
import { ShortcutData } from "./ShortcutData";

export function ParameterSummaryItemComponent({
	item,
	shortcut,
	parameters,
	updateParameter,
}: {
	item: ParameterSummaryItem;
	shortcut: ShortcutData;
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
				value={(item.value || "") as WFTextParameter}
				onChange={v => updateParameter(item.details.Key, v)}
				shortcut={shortcut}
			/>
		);
	}
	if (item.details.Class === "WFStepperParameter") {
		return (
			<SummaryStepperParameter
				data={item.details}
				value={
					(item.value || item.details.DefaultValue || 1) as
						| number
						| WFAttachmentParameter
				}
				onChange={v => updateParameter(item.details.Key, v)}
			/>
		);
	}
	return <div className="error">Unsupported class {item.details.Class}</div>;
}

export function ActionParameterSummary({
	items,
	shortcut,
	parameters,
	updateParameter,
}: {
	items: ParameterSummaryItem[];
	shortcut: ShortcutData;
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
						shortcut={shortcut}
						parameters={parameters}
						updateParameter={updateParameter}
					/>
				);
			})}
		</div>
	);
}

// REMINDER REMINDER REMINDER REMINDER REMINDER REMINDER
// REMINDER    ShortcutsParameterOverrideSpec   REMINDER
// REMINDER REMINDER REMINDER REMINDER REMINDER REMINDER

export function SummaryTextInput({
	data,
	value,
	onChange,
	shortcut,
}: {
	data: ShortcutsTextInputParameterSpec;
	value: WFTextParameter;
	onChange: (v: WFTextParameter) => void;
	shortcut: ShortcutData;
}) {
	// let [editing, setEditing] = useState(false);
	let [editingValue, setEditingValue] = useState<string | undefined>(undefined);
	let makeEditingValue = (value: WFTextParameter): string => {
		return JSON.stringify(value);
	};
	let unmakeEditingValue = (v: string): WFTextParameter => {
		return JSON.parse(v);
	};

	if (editingValue === undefined) {
		if (!value) {
			return (
				<span
					className="input placeholder"
					onClick={e => setEditingValue(makeEditingValue(""))}
				>
					{"" + data.Placeholder}
				</span> // !!!!accessability
			);
		}
		return (
			<span
				className="input"
				onClick={e => setEditingValue(makeEditingValue(value))}
			>
				<ShortcutsSerializationTypeRender shortcut={shortcut} value={value} />
			</span> // !!!!accessability
		);
	}
	return (
		<input
			className="input"
			value={editingValue}
			autoFocus
			placeholder={"" + data.Placeholder}
			onChange={e => setEditingValue(e.currentTarget.value)}
			onBlur={e => {
				setEditingValue(undefined);
				onChange(unmakeEditingValue(e.currentTarget.value));
			}} // !!!!bad
		/>
	);
}

export function SummaryStepperParameter({
	value,
	onChange,
	data,
}: {
	value: number | WFAttachmentParameter;
	data: ShortcutsStepperParameterSpec;
	onChange: (v: WFTextParameter) => void;
}) {
	return (
		<span className="input">
			{value}{" "}
			{(
				(value === 1 ? data.StepperNoun : data.StepperPluralNoun) || ""
			).toLowerCase()}
		</span> // !!!!accessability
	);
}
