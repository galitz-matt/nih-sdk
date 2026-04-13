import type { NameCriteriaIr } from "../types/ir";
import type { NameCriteria } from "../types/request";

export class IrToDtoMapper {
    static toNameCriteria(piName: NameCriteriaIr): NameCriteria {
        const res: NameCriteria = {};
        if (piName.anyName !== undefined) res.any_name = piName.anyName;
        if (piName.firstName !== undefined) res.first_name = piName.firstName;
        if (piName.lastName !== undefined) res.last_name = piName.lastName;
        if (piName.middleName !== undefined) res.middle_name = piName.middleName;

        return res;
    }
}