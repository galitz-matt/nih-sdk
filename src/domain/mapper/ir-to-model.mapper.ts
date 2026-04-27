import type { NameCriteria } from "../types/model/projects-search-input.model";
import type { NameCriteriaIr } from "../types/ir/name-criteria.ir";

export class IrToModelMapper {
    static toNameCriteria(piName: NameCriteriaIr): NameCriteria {
        const res: NameCriteria = {};
        if (piName.anyName !== undefined) res.any_name;
        if (piName.firstName !== undefined) res.first_name = piName.firstName;
        if (piName.lastName !== undefined) res.last_name = piName.lastName;
        if (piName.middleName !== undefined) res.middle_name = piName.middleName;
        return res;
    }
}