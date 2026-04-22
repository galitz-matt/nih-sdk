import type { NameCriteriaIr } from "../types/ir/name-criteria.ir";

export class NameCriteriaIrBuilder {
  private readonly ir: Partial<NameCriteriaIr> = {};

  anyName(value: string): this {
    this.ir.anyName = value;
    return this;
  }

  firstName(value: string): this {
    this.ir.firstName = value;
    return this;
  }

  lastName(value: string): this {
    this.ir.lastName = value;
    return this;
  }

  middleName(value: string): this {
    this.ir.middleName = value;
    return this;
  }

  build(): NameCriteriaIr {


    return this.ir as NameCriteriaIr;
  }
}