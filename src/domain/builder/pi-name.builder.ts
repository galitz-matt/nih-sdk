import { DomainError } from "../errors";
import type { PiName } from "../types/ir";

/**
 * Builder for PI name search criteria.
 *
 * The first method called determines the matching mode:
 *
 * - anyName(...) → fuzzy, project-level matching
 * - firstName/lastName/middleName → structured, same-PI matching
 *
 * These modes cannot be combined.
 */
export class PiNameBuilder {
    private readonly piName: PiName = {};

    anyName(anyName: string): PiNameAnyBuilder {
        this.piName.anyName = anyName
        return new PiNameAnyBuilder(this.piName);
    }

    firstName(firstName: string): PiNameStructuredBuilder {
        this.piName.firstName = firstName;
        return new PiNameStructuredBuilder(this.piName);
    }

    lastName(lastName: string): PiNameStructuredBuilder {
        this.piName.lastName = lastName;
        return new PiNameStructuredBuilder(this.piName);
    }

    middleName(middleName: string): PiNameStructuredBuilder {
        this.piName.middleName = middleName;
        return new PiNameStructuredBuilder(this.piName);
    }
}

export class PiNameStructuredBuilder {
    private readonly piName: PiName;
    
    constructor(piName: PiName) {
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

    build(): PiName {
        if (this.piName.anyName !== undefined) {
            throw new DomainError("Invalid State: Cannot combine anyName with firstName, lastName, and/or middleName.")
        }
        return { ...this.piName };
    }
}

export class PiNameAnyBuilder {
    private readonly piName: PiName;

    constructor(piName: PiName) {
        this.piName = piName;
    }

    build(): PiName {
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