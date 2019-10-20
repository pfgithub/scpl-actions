import React, { useRef, useState } from "react";
import { ShortcutsDictionaryParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import {
	WFDictionaryParameter,
	WFTextParameter
} from "scpl/built/src/OutputData";
import { cssdata, ParameterProps } from "../CSSDemo";
import { Icon, IconButton } from "../Icon";
import { startDragWatcher } from "../util";
import { ParameterBase } from "./Parameter";
import { ShortcutsTextRender } from "./ShortcutsTextRender";

type DictionaryParameterValueType =
	| {
			key: WFTextParameter;
			type: "string";
			value: WFTextParameter;
			uid: string;
	  }
	| {
			key: WFTextParameter;
			type: "number";
			value: WFTextParameter;
			uid: string;
	  }
	| {
			key: WFTextParameter;
			type: "array";
			value: DictionaryParameterValueType[];
			uid: string;
	  }
	| {
			key: WFTextParameter;
			type: "dictionary";
			value: DictionaryParameterValueType[];
			uid: string;
	  }
	| { key: string; type: "boolean"; value: string; uid: string };

export function ShortcutsDictionaryParameter({
	paramKey,
	data,
	parameters,
	updateParameter,
	visible
}: ParameterProps<ShortcutsDictionaryParameterSpec>) {
	let paramValue = parameters[paramKey] as WFDictionaryParameter;
	let [fakeItems, setFakeItems] = useState<DictionaryParameterValueType[]>(
		paramValue
			? paramValue.Value.WFDictionaryFieldValueItems.map(
					(i, index): DictionaryParameterValueType => {
						if (i.WFItemType === 0) {
							return {
								key: i.WFKey,
								uid: "" + index,
								type: "string",
								value: i.WFValue
							};
						} else {
							return (undefined as unknown) as DictionaryParameterValueType;
						}
					}
			  )
			: []
	);
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
	let [removing, setRemoving] = useState<
		| { uid: string; removing: true | false | "cancel"; index: number }
		| undefined
	>(undefined);
	let topElem = useRef<HTMLDivElement>(null);
	return (
		<div className="dictionaryparameter">
			<div ref={topElem} />
			{fakeItems.flatMap((item, i) => {
				let isDragging = dragging && dragging.uid === item.uid;
				let isRemoving = removing && removing.uid === item.uid;
				let clearRemoving = async (v: false | "cancel") => {
					if (!removing) {
						return;
					}
					setRemoving({ ...removing, removing: v });
					await new Promise(r => setTimeout(r, 100));
					setRemoving(undefined);
				};
				return [
					<ParameterBase
						name={"unnamed dictionary"}
						key={item.uid}
						visible={visible && !(isRemoving && removing!.removing === false)}
						initAnimation={true}
						className={
							"dictionary " +
							(isDragging && dragging!.dragging
								? "dragging "
								: isDragging
								? "dropping "
								: "") +
							(isRemoving && removing!.removing === true ? "removing " : "") +
							(!dragging && !removing ? "static " : "")
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
									onClick={e =>
										setRemoving({ uid: item.uid, removing: true, index: i })
									}
								/>
							</div>
						</div>
						<div className="key">
							<div>
								<ShortcutsTextRender text={item.key} />
							</div>
						</div>
						<div className="line"></div>
						<div className="value">
							<div>{JSON.stringify(item.value)}</div>
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
										Math.min(newExpectedIndex, fakeItems.length - 1),
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
								onClick={() => clearRemoving("cancel")}
							></div>
						) : null}
						<button
							className={"deletebtn " + (removing ? "deleting" : "")}
							onClick={async () => {
								await clearRemoving(false);
								setFakeItems(fakeItems.filter((_, index) => index !== i));
							}}
						>
							Delete
						</button>
					</ParameterBase>
				];
			})}
			<ParameterBase
				name={"add new field"}
				className={"addnewfield"}
				visible={visible}
				onClick={() => {
					let fakeItemsCopy = fakeItems.filter(q => q);
					fakeItemsCopy.push({
						key: "" + Math.random(),
						type: "string",
						value: "" + Math.random(),
						uid: "" + Math.random()
					});
					setFakeItems(fakeItemsCopy);
				}}
			>
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
			</ParameterBase>
		</div>
	);
}
