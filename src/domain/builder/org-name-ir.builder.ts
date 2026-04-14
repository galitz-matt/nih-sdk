import type { OrgNameIr } from "../types/ir";

/**
 * Builder for Organization Name search criteria
 * 
 * Name must be provided, build() cannot be called before name()
 */
export class OrgNameIrBuilder {
    name(name: string): OrgNamedIrBuilder {
        return new OrgNamedIrBuilder({
            name,
            kind: "partial"
        });
    }
}

export class OrgNamedIrBuilder {
    private readonly ir: OrgNameIr;

    constructor(ir: OrgNameIr) {
        this.ir = ir;
    }

    exact(): this {
        this.ir.kind = "exact";
        return this;
    }

    partial(): this {
        this.ir.kind = "partial";
        return this;
    }

    build(): OrgNameIr {
        this.ir.kind = this.ir.kind ?? "partial";
        return this.ir;
    }
}