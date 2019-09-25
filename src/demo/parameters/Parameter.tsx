import React, {
	ReactNode,
	useRef,
	useState,
	useEffect,
	useMemo,
	useCallback
} from "react";

export function Parameter({
	className,
	children,
	name,
	visible,
	initAnimation,
	...more
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	className?: string;
	children: ReactNode;
	name: string;
	visible: boolean;
	initAnimation?: boolean; //
}) {
	let [ourViewState, setOurViewState] = useState<
		"visible" | "revealing" | "collapsing" | "collapsed"
	>(visible ? (initAnimation ? "collapsed" : "visible") : "collapsed");
	useEffect(() => {
		if (
			visible &&
			(ourViewState === "revealing" || ourViewState === "visible")
		) {
			return;
		}
		if (
			!visible &&
			(ourViewState === "collapsing" || ourViewState === "collapsed")
		) {
			return;
		}
		if (visible) {
			setOurViewState("revealing");
			setTimeout(() => {
				setOurViewState("visible");
			}, 20);
			// return () => clearTimeout(timeout);
			return;
		}
		if (ourViewState !== "collapsing") {
			setOurViewState("collapsing");
		}
		setTimeout(() => {
			setOurViewState("collapsed");
		}, 100);
		// return () => clearTimeout(timeout);
	}, [ourViewState, visible]);
	return (
		<section
			className={"parameter " + (className || "") + " " + ourViewState}
			aria-label={name + ", parameter"}
			{...more}
		>
			{children}
		</section>
	);
}
