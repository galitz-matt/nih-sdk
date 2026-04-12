import type { PiName } from "../types/ir";
import type { NameCriteria } from "../types/request";

export class IrToDtoMapper {
    static toNameCriteria(piName: PiName): NameCriteria {
        return {
            any_name: piName.anyName,
            first_name: piName.firstName,
            last_name: piName.lastName,
            middle_name: piName.middleName
        };
    }
}