import { OrgNameIrBuilder } from "../builder/org-name-ir.builder";
import { NameCriteriaBuilder } from "../builder/name-criteria.builder";

export function pi(): NameCriteriaBuilder {
    return new NameCriteriaBuilder();
}

export function po(): NameCriteriaBuilder {
    return new NameCriteriaBuilder();
}

export function orgName(): OrgNameIrBuilder {
    return new OrgNameIrBuilder();
}