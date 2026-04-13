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
    private readonly piName: NameCriteriaIr = {};

    anyName(anyName: string): NameCriteriaIrAnyBuilder {
        this.piName.anyName = anyName
        return new NameCriteriaIrAnyBuilder(this.piName);
    }

    firstName(firstName: string): NameCriteriaIrStructuredBuilder {
        this.piName.firstName = firstName;
        return new NameCriteriaIrStructuredBuilder(this.piName);
    }

    lastName(lastName: string): NameCriteriaIrStructuredBuilder {
        this.piName.lastName = lastName;
        return new NameCriteriaIrStructuredBuilder(this.piName);
    }

    middleName(middleName: string): NameCriteriaIrStructuredBuilder {
        this.piName.middleName = middleName;
        return new NameCriteriaIrStructuredBuilder(this.piName);
    }
}

export class NameCriteriaIrStructuredBuilder {
    private readonly piName: NameCriteriaIr;
    
    constructor(piName: NameCriteriaIr) {
        this.piName = piName;
    }

    firstName(firstName: string): this {
        this.piName.firstName = firstName;
        return this;
    }

    lastName(lastName: string): this {
        this.piName.lastName = lastName;
        return this;
    }

    middleName(middleName: string): this {
        this.piName.middleName = middleName;
        return this;
    }

    build(): NameCriteriaIr {
        if (this.piName.anyName !== undefined) {
            throw new DomainError("Invalid State: Cannot combine anyName with firstName, lastName, and/or middleName.")
        }
        return { ...this.piName };
    }
}

export class NameCriteriaIrAnyBuilder {
    private readonly piName: NameCriteriaIr;

    constructor(piName: NameCriteriaIr) {
        this.piName = piName;
    }

    build(): NameCriteriaIr {
        if (
            this.piName.firstName !== undefined ||
            this.piName.lastName !== undefined ||
            this.piName.middleName !== undefined
        ) {
            throw new DomainError("Invalid State: Cannot combine anyName with firstName, lastName, and/or middleName.")
        }

        return { ...this.piName };
    }
}