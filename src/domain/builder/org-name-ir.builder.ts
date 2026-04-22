import type { OrgNameIr } from "../types/ir/org-name.ir";

export class OrgNameIrBuilder {
  private readonly ir: Partial<OrgNameIr> = {};

  public constructor() {}

  name(value: string): this {
    this.ir.name = value;
    return this;
  }

  exact(): this {
    this.ir.kind = "exact";
    return this;
  }

  partial(): this {
    this.ir.kind = "partial"
    return this;
  }

  build(): OrgNameIr {
    const kind = this.ir.kind ?? "partial";

    if (!this.ir.name) {
        throw new Error("orgName: 'name' must be provided before build()");
    }

    return {
      name: this.ir.name!, // safe due to state constraint
      kind,
    };
  }
}