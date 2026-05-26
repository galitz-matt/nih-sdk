export function unique<T>(values: readonly T[]): T[] {
    return [...new Set(values)]
}

export function uniqueFlat<T>(...values: readonly (T | readonly T[])[]): T[] {
    return [...new Set(
        values.flatMap(value =>
            Array.isArray(value) ? value : [value]
        )
    )];
}