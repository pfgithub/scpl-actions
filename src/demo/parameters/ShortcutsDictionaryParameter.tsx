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
import { ShortcutsParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";

import {Parameter} from "./Parameter";
import {cssdata} from "../CSSDemo";
import {Icon, IconButton} from "../Icon";

import { useState } from "react";
import { startDragWatcher } from "../util";

type DictionaryParameterValueType =
	| { key: string; type: "string"; value: string; uid: string }
	| { key: string; type: "number"; value: string; uid: string }
	| {
			key: string;
			type: "array";
			value: DictionaryParameterValueType[];
			uid: string;
	  }
	| {
			key: string;
			type: "dictionary";
			value: DictionaryParameterValueType[];
			uid: string;
	  }
	| { key: string; type: "boolean"; value: string; uid: string };

export function ShortcutsDictionaryParameter({
	items
}: {
	items: DictionaryParameterValueType[];
}) {
	let [fakeItems, setFakeItems] = useState(items);
	let [dragging, setDragging] = useState<
		| {
				uid: string;
				position: number;
				startIndex: number;
				index: number;
				dragging: boolean;
		  }
		| undefined
	>(undefined);
	let [removing, setRemoving] = useState<{ uid: string } | undefined>(
		undefined
	);
	let topElem = useRef<HTMLDivElement>(null);
	return (
		<div className="dictionaryparameter">
			<div ref={topElem} />
			{fakeItems.map((item, i) => {
				let isDragging = dragging && dragging.uid === item.uid;
				let isRemoving = removing && removing.uid === item.uid;
				return [
					<Parameter
						name={"unnamed dictionary"}
						key={item.uid}
						className={
							"dictionary " +
							(isDragging && dragging!.dragging ? "dragging " : " ") +
							(isRemoving ? "removing " : " ")
						}
						style={
							isDragging
								? {
										transform:
											"translate(0, " +
											Math.min(
												Math.max(
													dragging!.position,
													-44 * +cssdata.scale -
														dragging!.startIndex * 88 * +cssdata.scale
												),
												fakeItems.length * 88 * +cssdata.scale +
													44 * +cssdata.scale -
													dragging!.startIndex * 88 * +cssdata.scale
											) +
											"px)"
								  }
								: dragging
								? {
										transform:
											"translate(0, " +
											(i >= dragging.startIndex && i <= dragging.index
												? -88 * +cssdata.scale
												: i <= dragging.startIndex && i >= dragging.index
												? 88 * +cssdata.scale
												: 0) +
											"px)"
								  }
								: {}
						}
					>
						<div className="remove">
							<div>
								<IconButton
									icon="remove"
									onClick={e => setRemoving({ uid: item.uid })}
								/>
							</div>
						</div>
						<div className="key">
							<div>{item.key}</div>
						</div>
						<div className="line"></div>
						<div className="value">
							<div>{item.value}</div>
						</div>
						<div
							className="reorder"
							touch-action="none"
							onPointerDown={async e => {
								setDragging(
									(dragging = {
										uid: item.uid,
										position: 0,
										startIndex: i,
										index: i,
										dragging: true
									})
								);
								let lastPos = e.clientY;
								let lastOffset = 0;
								e.preventDefault();
								e.stopPropagation();
								await startDragWatcher(e.nativeEvent, e => {
									e.preventDefault();
									e.stopPropagation();
									let currentOffset = lastOffset + (e.clientY - lastPos);
									let realPosition = i * 88 * +cssdata.scale;
									let newRealPosition = realPosition + currentOffset;
									let newExpectedIndex = Math.round(
										newRealPosition / (88 * +cssdata.scale)
									);
									newExpectedIndex = Math.max(
										Math.min(newExpectedIndex, items.length - 1),
										0
									);
									setDragging(
										(dragging = {
											uid: item.uid,
											position: currentOffset,
											startIndex: dragging!.startIndex,
											index: newExpectedIndex,
											dragging: true
										})
									);
									lastOffset = currentOffset;
									lastPos = e.clientY;
								});
								let currentOffset = dragging!.position;
								let newExpectedIndex = dragging!.index;
								console.log(newExpectedIndex);
								setDragging(
									(dragging = {
										uid: dragging!.uid,
										position:
											(newExpectedIndex - dragging!.startIndex) *
											88 *
											+cssdata.scale,
										startIndex: dragging!.startIndex,
										index: newExpectedIndex,
										dragging: false
									})
								);
								await new Promise(r => setTimeout(r, 100));
								if (newExpectedIndex !== dragging!.startIndex) {
									let fakeItemsCopy = fakeItems.slice();
									fakeItemsCopy.splice(
										newExpectedIndex,
										0,
										...fakeItemsCopy.splice(dragging!.startIndex, 1)
									);
									setFakeItems(fakeItemsCopy);
									fakeItems = fakeItemsCopy;
									currentOffset -= (newExpectedIndex - i) * 88 * +cssdata.scale;
									i = newExpectedIndex;
								}
								setDragging(undefined);
							}}
						>
							<div>
								<Icon icon="reorder" />
							</div>
						</div>
						{removing ? (
							<div
								className="clickawayhandler"
								onClick={() => setRemoving(undefined)}
							></div>
						) : null}
						<button
							className={"deletebtn " + (removing ? "deleting" : "")}
							onClick={() => {
								setRemoving(undefined);
								setFakeItems(fakeItems.filter((_, index) => index !== i));
							}}
						>
							Delete
						</button>
					</Parameter>
				];
			})}
			<Parameter name={"add new field"} className={"addnewfield"}>
				<div className="add">
					<div>
						<IconButton icon="add" />
					</div>
				</div>
				<div className="description">
					<div>Add new field</div>
				</div>
				{removing ? (
					<div
						className="clickawayhandler"
						onClick={() => setRemoving(undefined)}
					></div>
				) : null}
			</Parameter>
		</div>
	);
}