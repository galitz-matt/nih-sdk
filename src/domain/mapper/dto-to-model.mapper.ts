import type { NameCriteria } from "../types/model/request";
import type { NameCriteriaDto } from "../types/dto/name-criteria.dto";

export class DtoToModelMapper {
    static toNameCriteria(piName: NameCriteriaDto): NameCriteria {
        const res: NameCriteria = {};
        if (piName.anyName !== undefined) res.any_name;
        if (piName.firstName !== undefined) res.first_name = piName.firstName;
        if (piName.lastName !== undefined) res.last_name = piName.lastName;
        if (piName.middleName !== undefined) res.middle_name = piName.middleName;
        return res;
    }
}