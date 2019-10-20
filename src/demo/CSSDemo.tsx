import * as bplistparser from "bplist-parser";
import React, { useEffect, useMemo, useState } from "react";
import { ShortcutsBaseParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { WFAction, WFParameters, WFShortcut } from "scpl/built/src/OutputData";
import uuidv4 from "uuid/v4";
//@ts-ignore
import * as cssexported from "./CSSDemo.scss";
import { Action, UpdateParametersCallback } from "./parameters/Action";
import { useFetch } from "./useFetch";

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

	let iconExpectedColor =
		"c" +
		(editedShortcut[0].WFWorkflowIcon.WFWorkflowIconStartColor >>> 8)
			.toString(16)
			.padStart(6, "0")
			.toUpperCase();

	let indentLevel = 0;
	let indentIsCollapsed: boolean[] = [];
	// TODO allow collapsing indents

	return (
		<div>
			<div className="cssdemo">
				<div className="shortcutnameboundingbox">
					<div className={"shortcutnameicon " + iconExpectedColor}>
						{String.fromCodePoint(
							editedShortcut[0].WFWorkflowIcon.WFWorkflowIconGlyphNumber
						)}
					</div>
				</div>
				{editedShortcut[0].WFWorkflowActions.map((action, i) => {
					let key = action.WFWorkflowActionParameters!.UUID;
					let controlFlowMode = action.WFWorkflowActionParameters!
						.WFControlFlowMode;
					let thisIndentLevel = indentLevel;
					let thisIsCollapsed = indentIsCollapsed[0];
					if (controlFlowMode !== undefined) {
						if (controlFlowMode === 0) {
							indentLevel++;
							indentIsCollapsed.unshift(
								thisIsCollapsed ||
									!!action.WFWorkflowActionParameters!.__ScPLIndentCollapsed
							);
						} else if (controlFlowMode === 1) {
							thisIndentLevel--;
							indentIsCollapsed.shift();
							thisIsCollapsed = indentIsCollapsed[0];
							indentIsCollapsed.unshift(
								thisIsCollapsed ||
									!!action.WFWorkflowActionParameters!.__ScPLIndentCollapsed
							);
						} else if (controlFlowMode === 2) {
							indentLevel--;
							thisIndentLevel = indentLevel;
							indentIsCollapsed.shift();
							thisIsCollapsed = indentIsCollapsed[0];
						}
					}
					if (thisIsCollapsed) {
						return null;
					}
					return (
						<React.Fragment key={"" + key}>
							<div className="connector space" />
							<ErrorBoundary
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
									indentLevel={thisIndentLevel}
								/>
							</ErrorBoundary>
						</React.Fragment>
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
