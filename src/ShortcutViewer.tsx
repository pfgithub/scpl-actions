import * as bplistparser from "bplist-parser";
import React, { useEffect, useMemo, useState } from "react";
import { ShortcutsBaseParameterSpec } from "shortcuts3types/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFAction,
	WFParameters,
	WFShortcut,
} from "shortcuts3types/built/src/OutputData";
import uuidv4 from "uuid/v4";
//@ts-ignore
import * as cssexported from "./ShortcutViewer.scss";
import { Action, UpdateParametersCallback } from "./parameters/Action";
import { useFetch } from "./useFetch";
import { LoadingSpinner } from "./LoadingSpinner";
import { ShortcutData } from "./parameters/ShortcutData";
import { getActionFromID } from "shortcuts3types";

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
		fileUrlToLoad || "none",
	);
	let [showFinal, setShowFinal] = useState(false);
	if (loadStatus.state === "none") {
		return <button onClick={() => startLoad()}>Load</button>;
	}
	if (loadStatus.state === "loaded") {
		if (!showFinal) {
			setTimeout(() => setShowFinal(true), 0);
			return (
				<div>
					Rendering...
					<LoadingSpinner />
				</div>
			);
		}
		let parsedBuffer: WFShortcut | undefined;

		try {
			parsedBuffer = bplistparser.parseBuffer<WFShortcut>(
				new Buffer(loadStatus.response),
			);
		} catch (e) {
			parsedBuffer = undefined;
			console.log(loadStatus.response);
			console.log(fileUrlToLoad);
			alert("failed to load");
		}

		if (parsedBuffer) {
			console.log("LOAD STATE IS LOADED. THIS SHOULD NEVER UPDATE.");

			return (
				<ShortcutViewerEditor
					shortcut={parsedBuffer}
					meta={{ name: "Unknown" }}
				/>
			);
		} else {
			return <div>Error!</div>;
		}
	}
	return (
		<div>
			<pre>
				{fileUrlToLoad}
				{"\n\n"}
				{JSON.stringify(loadStatus, null, "\t")}
			</pre>
			<LoadingSpinner />
		</div>
	);
	// return <input value={fileUrlToLoad || "none"} />;
}

export function ShortcutViewerEditor({
	shortcut,
	meta,
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
				action.WFWorkflowActionParameters.UUID = action.WFWorkflowActionParameters.UUID.toLowerCase();
			});
			return shortcut;
		}, [shortcut]),
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

	let shortcutData: ShortcutData = new ShortcutData();

	let [rerender, setRerender] = useState(0);

	editedShortcut[0].WFWorkflowActions.map((action, i) => {
		let uid = action.WFWorkflowActionParameters!.UUID as string;
		let _tempAction = getActionFromID(action.WFWorkflowActionIdentifier);
		shortcutData.setActionForUUID(uid, {
			data: action,
			spec: _tempAction ? _tempAction._data : undefined,
			jumpTo: () => alert("Not Initialized"),
		}); // TODO maybe set index to show if a variable exists or is broken?
	});

	return (
		<div>
			<div className="cssdemo">
				<div className="shortcutnameboundingbox">
					<div className={"shortcutnameicon " + iconExpectedColor}>
						{String.fromCodePoint(
							editedShortcut[0].WFWorkflowIcon.WFWorkflowIconGlyphNumber,
						)}
					</div>
				</div>
				{useMemo(
					() =>
						editedShortcut[0].WFWorkflowActions.map((action, i) => {
							let key = action.WFWorkflowActionParameters!.UUID;

							let controlFlowMode = action.WFWorkflowActionParameters!
								.WFControlFlowMode;
							let thisIndentLevel = indentLevel;
							let thisIsCollapsed = indentIsCollapsed[0];
							let thisDefaultCollapseMode = !!(action.WFWorkflowActionParameters!
								.__ScPLIndentCollapsed === undefined
								? true
								: action.WFWorkflowActionParameters!.__ScPLIndentCollapsed);
							let collapseClose:
								| { actionCount: number; indent: number }
								| undefined;
							if (controlFlowMode !== undefined) {
								if (controlFlowMode === 0) {
									indentLevel++;
									indentIsCollapsed.unshift(
										thisIsCollapsed || thisDefaultCollapseMode,
									);
								} else if (controlFlowMode === 1) {
									thisIndentLevel--;
									let wasClosed = indentIsCollapsed.shift();
									thisIsCollapsed = indentIsCollapsed[0];
									if (wasClosed) {
										collapseClose = {
											indent: indentIsCollapsed.length + 1,
											actionCount: -1,
										};
									}
									indentIsCollapsed.unshift(
										thisIsCollapsed || thisDefaultCollapseMode,
									);
								} else if (controlFlowMode === 2) {
									indentLevel--;
									thisIndentLevel = indentLevel;
									let wasClosed = indentIsCollapsed.shift();
									thisIsCollapsed = indentIsCollapsed[0];
									if (wasClosed) {
										collapseClose = {
											indent: indentIsCollapsed.length + 1,
											actionCount: -1,
										};
									}
								}
							}
							if (thisIsCollapsed) {
								return null;
							}
							return (
								<React.Fragment key={"" + key}>
									{collapseClose ? (
										<>
											<div className="connector space" />
											<div className={"action indent" + collapseClose.indent}>
												{collapseClose.actionCount} actions collapsed.{" "}
												<button>View actions</button>
											</div>
										</>
									) : null}
									<div className="connector space" />
									<ErrorBoundary
										error={e => (
											<div className={"action indent" + thisIndentLevel}>
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
											setActionOutputNoRerender={newAction => {
												editedShortcut[0].WFWorkflowActions[i] = newAction;
												setRerender(rerender + 1);
											}}
											indentLevel={thisIndentLevel}
											shortcut={shortcutData}
										/>
									</ErrorBoundary>
								</React.Fragment>
							);
						}),
					//eslint-disable-next-line react-hooks/exhaustive-deps
					[
						//eslint-disable-next-line react-hooks/exhaustive-deps
						editedShortcut[0].WFWorkflowActions,
					],
				)}
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
	shortcut: ShortcutData;
};

type _pc<N extends string> = {
	Class: N;
};
