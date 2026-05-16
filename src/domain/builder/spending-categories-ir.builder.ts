import { DomainError } from "../errors";
import type { SpendingCategory } from "../types/enum/spending-category";
import type { SpendingCategoryIr } from "../types/ir/spending-category.ir";

export class SpendingCategoriesIrBuilder {
    private readonly ir: Partial<SpendingCategoryIr> = {}

    /**
     * Filter projects with all of provided spending categories (AND)
     * @param categories - spending categories
     */
    all(...categories: SpendingCategory[]): this {
        this.ir.values = categories;
        this.ir.match_all = true;
        return this;
    }

    /**
     * Match projects with any of provided spending categories (OR)
     * @param categories - spending categories
     */
    any(...categories: SpendingCategory[]): this {
        this.ir.values = categories
        this.ir.match_all = false;
        return this;
    }

    build(): SpendingCategoryIr {
        if (!this.ir.values || this.ir.values.length === 0) {
            throw new DomainError("spendingCategories: provide at least one spending category before build()")
        }
        return this.ir as SpendingCategoryIr
    }
}