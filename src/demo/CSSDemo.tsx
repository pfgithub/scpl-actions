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
	WFShortcut
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
import { useFetch } from "./useFetch";
import * as bplistparser from "bplist-parser";
import uuidv4 from "uuid/v4";

//@ts-ignore
bplistparser.maxObjectCount = 9999999;

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

let urlQueryParams = new URLSearchParams(document.location.search);
let icloudUrlToLoad = urlQueryParams.get("icloud");
let fileUrlToLoad = icloudUrlToLoad
	? "https://shortcutsweb.app/inspectshortcut?id=" +
	  icloudUrlToLoad.match(/[a-z0-9]{32}/)
	: urlQueryParams.get("file");

export default function Loader(props: {}) {
	let [loadStatus, startLoad] = useFetch(
		{ start: "later", get: "arraybuffer" },
		fileUrlToLoad || "none"
	);
	if (loadStatus.state === "none") {
		return <button onClick={() => startLoad()}>Load</button>;
	}
	if (loadStatus.state === "loaded") {
		let parsedBuffer = bplistparser.parseBuffer<WFShortcut>(
			new Buffer(loadStatus.response)
		);

		console.log("LOAD STATE IS LOADED. THIS SHOULD NEVER UPDATE.");

		return (
			<ShortcutViewerEditor
				shortcut={parsedBuffer}
				meta={{ name: "Unknown" }}
			/>
		);
	}
	return (
		<pre>
			{fileUrlToLoad}
			{"\n\n"}
			{JSON.stringify(loadStatus, null, "\t")}
		</pre>
	);
	// return <input value={fileUrlToLoad || "none"} />;
}

export function ShortcutViewerEditor({
	shortcut,
	meta
}: {
	shortcut: WFShortcut;
	meta: { name: string };
}) {
	let [editedShortcut, setEditedShortcut] = useState(
		useMemo(() => {
			// make sure that every action has a uuid. only do this once.
			// for scpl: improve performance by providing consistent uuids to cssdemo.
			shortcut[0].WFWorkflowActions.forEach(action => {
				if (!action.WFWorkflowActionParameters) {
					action.WFWorkflowActionParameters = {};
				}
				if (typeof action.WFWorkflowActionParameters.UUID !== "string") {
					action.WFWorkflowActionParameters.UUID = uuidv4();
				}
			});
			return shortcut;
		}, [shortcut])
	);
	let [editedShortcutJSON, setEditedShortcutJSON] = useState("");
	useEffect(() => {
		setEditedShortcutJSON(JSON.stringify(editedShortcut, null, "\t"));
	}, [editedShortcut]);
	// assign each action a unique id (for performance)
	return (
		<div>
			<div className="cssdemo">
				{editedShortcut[0].WFWorkflowActions.map((action, i) => {
					let key = action.WFWorkflowActionParameters!.UUID;
					return (
						<>
							<div className="connector space" />
							<ErrorBoundary
								key={"" + key}
								error={e => (
									<div className="action">
										<pre className="error">
											<code>
												{e.name + ": " + e.message + "\n\n" + e.stack}
											</code>
										</pre>
									</div>
								)}
							>
								<Action
									actionOutput={action}
									setActionOutput={newAction => {
										let copiedActions = [
											...editedShortcut[0].WFWorkflowActions
										];
										copiedActions[i] = newAction;
										setEditedShortcut([
											{
												...editedShortcut[0],
												WFWorkflowActions: copiedActions
											}
										]);
									}}
								/>
							</ErrorBoundary>
						</>
					);
				})}
				<div className="connector space" />
				<div className="action">
					<textarea
						rows={editedShortcutJSON.split("\n").length}
						style={{ width: "100%", resize: "none" }}
						value={editedShortcutJSON}
						onChange={e => setEditedShortcutJSON(e.currentTarget.value)}
						onBlur={() => {
							setEditedShortcut(JSON.parse(editedShortcutJSON));
						}}
					></textarea>
				</div>
			</div>
		</div>
	);
}

export function CSSDemo(props: {}): JSX.Element {
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
