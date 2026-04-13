import { NameCriteriaIrBuilder } from "../builder/name-criteria-ir.builder";
import { OrgNameIrBuilder } from "../builder/org-name-ir.builder";

export function pi(): NameCriteriaIrBuilder {
    return new NameCriteriaIrBuilder();
}

export function po(): NameCriteriaIrBuilder {
    return new NameCriteriaIrBuilder();
}

export function orgName(): OrgNameIrBuilder {
    return new OrgNameIrBuilder();
}