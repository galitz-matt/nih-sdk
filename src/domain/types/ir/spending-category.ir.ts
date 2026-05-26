import type { SpendingCategory } from "../enum/spending-category"
import type { NonEmptyArray } from "../utils/non-empty"

export type SpendingCategoryIr = {
    values: NonEmptyArray<SpendingCategory>;
    matchAll?: boolean;
}