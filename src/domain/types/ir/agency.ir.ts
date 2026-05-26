import type { Agency } from "../enum/agency"
import type { NonEmptyArray } from "../utils/non-empty"

export type AgencyIr = {
    agencies: NonEmptyArray<Agency>,
    isAdministering?: boolean,
    isFunding?: boolean
}