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
	WFTextParameter
} from "scpl/built/src/OutputData";
import {
	ShortcutsParameterSpec,
	ShortcutsEnumerationParameterSpec,
	ShortcutsBaseParameterSpec,
	ShortcutsExpandingParameterSpec,
	ShortcutsTextInputParameterSpec
} from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { Highlight } from "./Highlight";

//@ts-ignore
import * as cssexported from "./CSSDemo.scss";
import { useState } from "react";

import { Icon, IconButton, IconString } from "./Icon";

import { ParameterBase } from "./parameters/Parameter";
import { ShortcutsDictionaryParameter } from "./parameters/ShortcutsDictionaryParameter";
import { TextWithVariables } from "./TextWithVariables";
import { Action, UpdateParametersCallback } from "./parameters/Action";

export let cssdata: { scale: string } = cssexported;

export class ErrorBoundary extends React.Component<
	{ children: React.ReactNode; error: (error: Error) => React.ReactNode },
	{ hasError: Error | undefined }
> {
	constructor(props: {
		children: React.ReactNode;
		error: (error: Error) => React.ReactNode;
	}) {
		super(props);
		this.state = { hasError: undefined };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: error };
	}

	render() {
		if (this.state.hasError) {
			return this.props.error(this.state.hasError);
		}

		return this.props.children;
	}
}

export default function CSSDemo(props: {}): JSX.Element {
	let [actionOutput, setActionOutput] = useState<WFAction>({
		WFWorkflowActionIdentifier: "is.workflow.actions.downloadurl",
		WFWorkflowActionParameters: {}
	});
	let [actionJSON, setActionJSON] = useState("");
	useEffect(() => {
		setActionJSON(JSON.stringify(actionOutput, null, "\t"));
	}, [actionOutput]);
	let [key, setKey] = useState(0);
	return (
		<div className="cssdemo">
			<TextWithVariables />
			<button onClick={() => setKey(key + 1)}>Refresh</button>
			<div className="connector space" />
			{[
				<ErrorBoundary
					key={"" + key}
					error={e => (
						<div className="action">
							<pre className="error">
								<code>{e.name + ": " + e.message + "\n\n" + e.stack}</code>
							</pre>
						</div>
					)}
				>
					<Action
						actionOutput={actionOutput}
						setActionOutput={setActionOutput}
					/>
				</ErrorBoundary>
			]}
			<div className="connector space" />
			<div className="action">
				<textarea
					rows={actionJSON.split("\n").length}
					style={{ width: "100%", resize: "none" }}
					value={actionJSON}
					onChange={e => setActionJSON(e.currentTarget.value)}
					onBlur={() => {
						setActionOutput(JSON.parse(actionJSON));
					}}
				></textarea>
			</div>
		</div>
	);
}

export type ParameterProps<T extends ShortcutsBaseParameterSpec> = {
	paramKey: string;
	data: T;
	parameters: WFParameters;
	updateParameter: UpdateParametersCallback;
	visible: boolean;
};

type _pc<N extends string> = {
	Class: N;
};
