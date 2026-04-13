import { DomainError } from "../errors";
import type { NameCriteriaIr } from "../types/ir";

/**
 * Builder for PI/PO name search criteria.
 *
 * The first method called determines the matching mode:
 *
 * - anyName(...) → fuzzy, project-level matching
 * - firstName/lastName/middleName → structured, same-PI matching
 *
 * These modes cannot be combined.
 */
export class NameCriteriaIrBuilder {
    private readonly ir: NameCriteriaIr = {};

    anyName(anyName: string): NameCriteriaIrAnyBuilder {
        this.ir.anyName = anyName
        return new NameCriteriaIrAnyBuilder(this.ir);
    }

    firstName(firstName: string): NameCriteriaIrStructuredBuilder {
        this.ir.firstName = firstName;
        return new NameCriteriaIrStructuredBuilder(this.ir);
    }

    lastName(lastName: string): NameCriteriaIrStructuredBuilder {
        this.ir.lastName = lastName;
        return new NameCriteriaIrStructuredBuilder(this.ir);
    }

    middleName(middleName: string): NameCriteriaIrStructuredBuilder {
        this.ir.middleName = middleName;
        return new NameCriteriaIrStructuredBuilder(this.ir);
    }
}

export class NameCriteriaIrStructuredBuilder {
    private readonly ir: NameCriteriaIr;
    
    constructor(piName: NameCriteriaIr) {
        this.ir = piName;
    }

    firstName(firstName: string): this {
        this.ir.firstName = firstName;
        return this;
    }

    lastName(lastName: string): this {
        this.ir.lastName = lastName;
        return this;
    }

    middleName(middleName: string): this {
        this.ir.middleName = middleName;
        return this;
    }

    build(): NameCriteriaIr {
        if (this.ir.anyName !== undefined) {
            throw new DomainError("Invalid State: Cannot combine anyName with firstName, lastName, and/or middleName.")
        }
        return { ...this.ir };
    }
}

export class NameCriteriaIrAnyBuilder {
    private readonly ir: NameCriteriaIr;

    constructor(piName: NameCriteriaIr) {
        this.ir = piName;
    }

    build(): NameCriteriaIr {
        if (
            this.ir.firstName !== undefined ||
            this.ir.lastName !== undefined ||
            this.ir.middleName !== undefined
        ) {
            throw new DomainError("Invalid State: Cannot combine anyName with firstName, lastName, and/or middleName.")
        }

        return { ...this.ir };
    }
}