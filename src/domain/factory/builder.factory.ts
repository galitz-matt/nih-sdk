import { OrgNameIrBuilder } from "../builder/org-name-ir.builder";
import { NameCriteriaIrBuilder } from "../builder/name-criteria-ir.builder";

export function pi(): NameCriteriaIrBuilder {
    return new NameCriteriaIrBuilder();
}

export function po(): NameCriteriaIrBuilder {
    return new NameCriteriaIrBuilder();
}

export function orgName(): OrgNameIrBuilder {
    return new OrgNameIrBuilder();
}