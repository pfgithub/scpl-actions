import { useEffect, useState, DependencyList } from "react";

async function perr<T>(
	cb: Promise<T>
): Promise<
	{ error: Error; result: undefined } | { error: undefined; result: T }
> {
	let result: T | undefined = undefined;
	try {
		result = await cb;
	} catch (error) {
		return { error: error, result: undefined };
	}
	return { result, error: undefined };
}

export function templateGenerator<InType>(helper: (str: InType) => string) {
	type ValueArrayType = (InType | string | { __raw: string })[];
	return (strings: TemplateStringsArray, ...values: ValueArrayType) => {
		const result: ValueArrayType = [];
		strings.forEach((str, i) => {
			result.push(raw(str), values[i] || "");
		});
		return result
			.map(el =>
				typeof (el as { __raw: string }).__raw === "string"
					? (el as { __raw: string }).__raw
					: helper(el as InType)
			)
			.join("");
	};
}

export const url = templateGenerator((v: string) => encodeURIComponent(v));

export function raw(string: TemplateStringsArray | string) {
	return { __raw: `${string}` };
}

export function useAsyncEffect(cb: () => Promise<void>, deps?: DependencyList) {
	useEffect(() => {
		cb();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
}

export type LoadStatus<T> =
	| { state: "none" }
	| { state: "loading" }
	| { state: "error"; message: string }
	| { state: "loaded"; response: T };

export function useFetch<ResponseType>(options: {
	start: "immediate" | "later";
	get: "json";
}): [LoadStatus<ResponseType>, (...params: Parameters<typeof fetch>) => void];

export function useFetch<ResponseType extends string = string>(options: {
	start: "immediate" | "later";
	get: "text";
}): [LoadStatus<ResponseType>, (...params: Parameters<typeof fetch>) => void];

export function useFetch<
	ResponseType extends ArrayBuffer = ArrayBuffer
>(options: {
	start: "immediate" | "later";
	get: "arraybuffer";
}): [LoadStatus<ResponseType>, (...params: Parameters<typeof fetch>) => void];

export function useFetch<ResponseType>(
	options: { start: "immediate" | "later"; get: "json" },
	...initialParams: Parameters<typeof fetch>
): [
	LoadStatus<ResponseType>,
	(...params: Parameters<typeof fetch> | []) => void
];

export function useFetch<ResponseType extends string = string>(
	options: { start: "immediate" | "later"; get: "text" },
	...initialParams: Parameters<typeof fetch>
): [
	LoadStatus<ResponseType>,
	(...params: Parameters<typeof fetch> | []) => void
];

export function useFetch<ResponseType extends ArrayBuffer = ArrayBuffer>(
	options: { start: "immediate" | "later"; get: "arraybuffer" },
	...initialParams: Parameters<typeof fetch>
): [
	LoadStatus<ResponseType>,
	(...params: Parameters<typeof fetch> | []) => void
];

export function useFetch<ResponseType>(
	options: {
		start: "immediate" | "later";
		get: "json" | "text" | "arraybuffer";
	},
	...initialParams: Parameters<typeof fetch> | []
): [
	LoadStatus<ResponseType>,
	(...params: Parameters<typeof fetch> | []) => void
] {
	let [loadStatus, setLoadStatus] = useState<LoadStatus<ResponseType>>({
		state: "none"
	});
	let [triggerRetry, setTriggerRetry] = useState<
		undefined | { trigger: true; params: Parameters<typeof fetch> }
	>(
		options.start === "immediate"
			? { trigger: true, params: initialParams as Parameters<typeof fetch> }
			: undefined
	);
	useAsyncEffect(async () => {
		if (!triggerRetry) {
			return;
		}
		if (loadStatus.state === "error") {
			setLoadStatus({ state: "loading" });
			await new Promise(r => setTimeout(r, 250)); // make it seem like something is happening when you retry on error (otherwise it might not even be visible)
		}
		setLoadStatus({ state: "loading" });
		let fetched = await perr(fetch(...triggerRetry.params));
		if (fetched.error) {
			return setLoadStatus({
				state: "error",
				message: fetched.error.toString()
			});
		}
		if (fetched.result.status !== 200) {
			return setLoadStatus({
				state: "error",
				message:
					"Got status " +
					fetched.result.status +
					". Message: " +
					(await fetched.result.text())
			});
		}
		if (options.get === "json") {
			let resultText = await fetched.result.text();
			let resultJson;
			try {
				resultJson = JSON.parse(resultText);
			} catch (e) {
				return setLoadStatus({
					state: "error",
					message:
						"Error parsing JSON in result: " +
						e.message +
						e.stack +
						", text is\n" +
						resultText
				});
			}
			return setLoadStatus({
				state: "loaded",
				response: resultJson
			});
		}
		if (options.get === "text") {
			return setLoadStatus({
				state: "loaded",
				response: ((await fetched.result.text()) as unknown) as ResponseType
			});
		}
		if (options.get === "arraybuffer") {
			return setLoadStatus({
				state: "loaded",
				response: ((await fetched.result.arrayBuffer()) as unknown) as ResponseType
			});
		}
	}, [triggerRetry]);
	return [
		loadStatus,
		(...params: Parameters<typeof fetch> | []) => {
			setLoadStatus({ state: "loading" }); // prevent loops
			setTriggerRetry({
				trigger: true,
				params:
					params.length > 0
						? (params as Parameters<typeof fetch>)
						: (initialParams as Parameters<typeof fetch>)
			});
		}
	];
}
