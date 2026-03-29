export interface CoerceOptions {
	maxDepth?: number;
	maxStringSize?: number;
}

export function coerce(
	arg: any,
	deep?: boolean,
	options?: CoerceOptions,
): any;
