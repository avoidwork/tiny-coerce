export interface CoerceOptions {
	maxStringSize?: number;
}

export function coerce(arg: any, options?: CoerceOptions): any;
