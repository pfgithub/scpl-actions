declare module "bplist-parser" {
	export function parseFile<T>(
		file: string | Buffer,
		callback: (err: Error | undefined, result?: T) => void
	);

	export function parseBuffer<T>(buffer: Buffer): T;
}
