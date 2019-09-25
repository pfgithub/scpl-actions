import hljs from "highlight.js";
import './Highlight.scss';

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
	ShortcutsDictionaryParameterSpec
} from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";

import { cssdata, ParameterProps } from "./CSSDemo";
import { Icon, IconButton } from "./Icon";

import { useState } from "react";
import { startDragWatcher } from "./util";

export function Highlight({language, children: code}: {language: string, children: string}){
	let ref = useRef<HTMLElement>(null);
	useEffect(() => {
		if(ref.current){
			hljs.highlightBlock(ref.current);
		}
	}, [code])
	return <code className={language} ref={ref}>{code}</code>
}