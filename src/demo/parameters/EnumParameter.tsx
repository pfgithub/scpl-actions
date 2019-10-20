import React, {
	ReactNode,
	useRef,
	useEffect,
	useMemo,
	useCallback
} from "react";
import { allActions, getActionFromName } from "scpl";
import { getActionFromID } from "scpl/built/src/ActionData";
import {
	WFAction,
	WFParameter,
	WFParameters,
	WFTextParameter,
	WFDictionaryParameter
} from "scpl/built/src/OutputData";
import {
	ShortcutsParameterSpec,
	ShortcutsDictionaryParameterSpec,
	ShortcutsEnumerationParameterSpec
} from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";

import { ParameterBase, LabeledParameterBase } from "./Parameter";
import { cssdata, ParameterProps } from "../CSSDemo";
import { Icon, IconButton } from "../Icon";

import { useState } from "react";
import { startDragWatcher } from "../util";

export function EnumParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsEnumerationParameterSpec>) {
	return (
		<LabeledParameterBase label={data.Label || "???"} visible={visible}>
			<SegmentedButton
				values={data.Items}
				selected={
					(parameters[paramKey] as string) ||
					// !!!!!!!!!!!might be variable
					data.DefaultValue ||
					"this should never happen"
				}
				onChange={ns => updateParameter(paramKey, ns)}
			/>
		</LabeledParameterBase>
	);
}

export function SegmentedButton({
	values,
	selected,
	onChange
}: {
	values: string[];
	selected: string;
	onChange: (newSelected: string) => void;
}) {
	let [idPrefix] = useState("" + Math.random());
	let ref = useRef<HTMLDivElement>(null);
	let width = ref && ref.current ? ref.current.clientWidth : 10000;
	return (
		<form>
			<div ref={ref} className="segmentedbutton">
				{values.map((value, i) => (
					<React.Fragment key={value}>
						<input
							type="radio"
							checked={value === selected}
							onChange={e => e.currentTarget.checked && onChange(value)}
							id={value + "-" + idPrefix}
							name="selection"
						></input>
						<label
							htmlFor={value + "-" + idPrefix}
							className={`${
								true &&
								i !== values.length - 1 &&
								value !== selected &&
								values[i + 1] !== selected
									? "rightline"
									: ""
							} ${
								true &&
								i !== 0 &&
								value !== selected &&
								values[i - 1] !== selected
									? "leftline"
									: ""
							}`}
						>
							<div>{value}</div>
						</label>
					</React.Fragment>
				))}
			</div>
		</form>
	);
}
