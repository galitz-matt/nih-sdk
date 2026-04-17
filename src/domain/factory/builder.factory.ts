import { type NameCriteriaIrStartBuilder, NameCriteriaIrBuilderImpl } from "../builder/name-criteria-ir.builder";
import { OrgNameIrBuilder } from "../builder/org-name-ir.builder";

export function pi(): NameCriteriaIrStartBuilder {
    return new NameCriteriaIrBuilderImpl as unknown as NameCriteriaIrStartBuilder;
}

export function po(): NameCriteriaIrStartBuilder {
    return new NameCriteriaIrBuilderImpl as unknown as NameCriteriaIrStartBuilder;
}

export function orgName(): OrgNameIrBuilder {
    return new OrgNameIrBuilder();
}