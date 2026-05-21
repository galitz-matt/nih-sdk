import { DomainError } from "../errors";
import { CongDist, CongDistGroup } from "../types/enum/cong-dist";
import type { Field } from "../types/enum/field";
import type { FiscalYear } from "../types/enum/fiscal-year";
import type { OrgState } from "../types/enum/org-state";
import type { ProjectsInput, SpendingCategoriesCriteria } from "../../infra/types/model/projects-input.model";

// TODO: centralize domain validation
export class ProjectsQueryValidator {
    static validate(payload: ProjectsInput): void {
        this.validateApplIds(payload.criteria.appl_ids);
        this.validateCongDists(payload.criteria.cong_dists, payload.criteria.org_states);
        this.validateFields(payload.include_fields, payload.exclude_fields);
        this.validateLimit(payload.limit);
        this.validateOffset(payload.offset);
        this.validateGrantNumbers(payload.criteria.project_nums);
        this.validateSpendingCategories(payload.criteria.spending_categories, payload.criteria.fiscal_years);
    }

    static validateApplIds(applIds: number[] | undefined): void {
        if (!applIds) return;

        if (applIds.length > 1000) {
            throw new DomainError("Too many applIds: Count of provided application IDs cannot exceed 1000");
        }
    }

    static validateCongDists(congDists: CongDist[] | undefined, states: OrgState[] | undefined): void {
        if (!congDists) return;

        if (!states || states.length === 0) {
            // TODO: make this dynamic
            throw new DomainError("Invalid congDists: Must initialize orgStates with OrgState(s) associated with provided CongDist(s)");
        }
        
        for (const dist of congDists) {
            const validDists = new Set<string>(
                states.flatMap(state => {
                    if (!this.hasCongDists(state)) return [];
                    return CongDistGroup[state];
                })
            )
            if (!validDists.has(dist))
                // TODO: implement dynamic tips
                // what state should be included for specified congDist(s)
                // correct usage snippet
                throw new DomainError(
                    `Invalid congDists: include the orgState associated with congDist: ${dist}\n`
                );
        }
    }

    static validateFields(include: Field[] | undefined, exclude: Field[] | undefined): void {
        if (!include || !exclude) return;

        const includeSet = new Set(include);
        const excludeSet = new Set(exclude);
        const conflicts = [...includeSet.intersection(excludeSet)];
        if (conflicts.length === 0) return;

        throw new DomainError(
            `Overlapping includeFields and excludeFields: set of includeFields() and excludeFields() arguments must be disjoint.` +
            `Remove the following fields from includeFields() or excludeFields:\n${this.formatList(conflicts)}`
        );
    }

    static validateLimit(limit: number | undefined): void {
        if (!limit) return;

        if (limit <= 0 || limit > 500) {
            throw new DomainError("Invalid limit: Must be a positive integer less than or equal to 500");
        }
    }

    static validateOffset(offset: number | undefined): void {
        if (!offset) return;

        if (offset < 0 || offset >= 15000) {
            throw new DomainError("Invalid offset: Must be a non-negative integer less than 15000");
        }
    }

    static validateGrantNumbers(nums: string[] | undefined): void {
        if (!nums) return;

        if (nums.length > 1000) {
            throw new DomainError("Too many projectNums: Count of provided project numbers cannot exceed 1000");
        }
    }

    static validateSpendingCategories(
        categories: SpendingCategoriesCriteria | undefined, 
        fiscalYears: FiscalYear[] | undefined
    ): void {
        if (!categories) return;

        const invalidFiscalYears = fiscalYears?.filter(
            y => y < 2008
        );
        if (invalidFiscalYears && invalidFiscalYears.length > 0) {
            throw new DomainError(
                "spendingCategories: Fiscal years prior to 2008 are incompatible with spendingCategories filter.\n" +
                `Remove spendingCategories() from query or remove the following fiscal years from fiscalYear():\n${this.formatList(invalidFiscalYears)}`
            );
        }
    }

    private static hasCongDists(state: string): state is keyof typeof CongDistGroup {
        return state in CongDistGroup;
    }

    private static formatList(fields: (string | number)[]): string {
        return fields.map(f => ` - ${f}`).join("\n");
    }

}