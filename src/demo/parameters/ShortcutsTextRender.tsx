import React, { useState } from "react";
import { ShortcutsTextInputParameterSpec } from "scpl/built/src/Data/ActionDataTypes/ShortcutsParameterSpec";
import { WFParameters, WFTextParameter } from "scpl/built/src/OutputData";
import { ParameterSummaryItem, UpdateParametersCallback } from "./Action";

export function ShortcutsTextRender({text}: {text: WFTextParameter}){
	if(typeof text === "string"){
		return <span className="WFTextTokenString">{text}</span>;
	}
	return <span className="WFTextTokenString">{text.Value.string}</span>
}