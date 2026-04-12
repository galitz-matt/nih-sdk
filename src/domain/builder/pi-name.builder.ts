import type { PiName } from "../types/ir";

export class PiNameBuilder {
    private readonly piName: PiName = {};

    anyName(anyName: string): this {
        this.piName.anyName = anyName
        return this;
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
        return { ...this.piName };
    }
}