import { DomainError } from "../errors";
import { CongDistGroup } from "../types/enum/cong-dist";
import type { ProjectsInput } from "../types/model/projects-input.model";

// TODO: centralize domain validation
export class ProjectsQueryValidator {
    static validate(payload: ProjectsInput): void {
        this.validateSpendingCategories(payload);
    }

    static validateCongDists(payload: ProjectsInput): void {
        const congDists = payload.criteria?.cong_dists
        if (!congDists) return;

        const states = payload.criteria?.org_states
        if (!states || states.length === 0) {
            // TODO: make this dynamic
            throw new DomainError("congDists: must initialize orgStates with OrgState(s) associated with provided CongDist(s)");
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
                    `congDists: include the orgState associated with congDist: ${dist}\n`
                )
        }
    }

    static validateLimit(payload: ProjectsInput): void {
        
    }

    static validateSpendingCategories(payload: ProjectsInput): void {
        const invalidFiscalYears = payload.criteria.fiscal_years?.filter(
            y => y < 2008
        );
        if (invalidFiscalYears && invalidFiscalYears.length > 0) {
            throw new DomainError(
                "spendingCategories: Fiscal years prior to 2008 are incompatible with spendingCategories filter.\n" +
                `Remove years ${invalidFiscalYears} from fiscalYears() or remove spendingCategories() from query`
            )
        }
    }

    private static hasCongDists(state: string): state is keyof typeof CongDistGroup {
        return state in CongDistGroup
    }
}