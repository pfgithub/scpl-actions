import React from "react";
import "./LoadingSpinner.scss";

export function LoadingSpinner(){
	return <div className="spinner">{new Array(12).fill(0).map((_, i) => {
		return <div className={"bar"+(i+1)} key={""+i}></div>
	})}</div>
}