import React, {
	ReactNode,
	useRef,
	useEffect,
	useMemo,
	useCallback
} from "react";

export function Parameter({
	className,
	children,
	name,
	...more
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	className?: string;
	children: ReactNode;
	name: string;
}) {
	return (
		<section
			className={"parameter " + (className || "")}
			aria-label={name + ", parameter"}
			{...more}
		>
			{children}
		</section>
	);
}