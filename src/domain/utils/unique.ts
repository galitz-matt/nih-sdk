import type { NonEmptyArray } from "../types/utils/non-empty";

export function unique<T>(values: readonly T[]): T[] {
    return [...new Set(values)]
}

export function uniqueNonEmpty<T>(values: NonEmptyArray<T>): NonEmptyArray<T> {
    return unique(values) as NonEmptyArray<T>
}

export function uniqueFlat<T>(...values: readonly (T | readonly T[])[]): T[] {
    return [...new Set(
        values.flatMap(value =>
            Array.isArray(value) ? value : [value]
        )
    )];
}