import { DomainError } from "../errors";
import { CongDist, CongDistGroup } from "../types/enum/cong-dist";
import type { Field } from "../types/enum/field";
import type { FiscalYear } from "../types/enum/fiscal-year";
import type { OrgState } from "../types/enum/org-state";
import type { ProjectsInput, PublicationsSearch, SpendingCategoriesCriteria } from "../../infra/types/model/projects-input.model";
import { MAX_AWARD_AMOUNT, MIN_AWARD_AMOUNT } from "../constants/amount-range";

export class ProjectsQueryValidator {
    static validate(payload: ProjectsInput): void {
        this.validateApplIds(payload.criteria.appl_ids);
        this.validateAwardAmountRange(payload.criteria.award_amount_range?.min_amount, payload.criteria.award_amount_range?.max_amount);
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

    static validateAwardAmountRange(min: number | undefined, max: number | undefined): void {
        if (min && min < MIN_AWARD_AMOUNT) {
            throw new DomainError(`Invalid minimum award amount: must be greater than or equal to ${MIN_AWARD_AMOUNT}`);
        }
        if (max && max > MAX_AWARD_AMOUNT) {
            throw new DomainError(`Invalid maximum award amount: must be less than or equal to ${MAX_AWARD_AMOUNT}`);
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

    static validatePublications(search: PublicationsSearch): void {
        if (search.publications_text_search?.length ?? 0 > 2500) {
            throw new DomainError("Text too long: Publications search text cannot exceed 2500 characters");
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

    static validateSubProjectFilter(
        isSubProject: boolean,
        excludeSubProjects: boolean
    ) {
        if (isSubProject && excludeSubProjects) {
            throw new DomainError(
                "onlySubProjects and excludeSubProjects methods cannot be included in same query.\n" +
                "Remove onlySubProjects or excludeSubProjects call from the query."
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