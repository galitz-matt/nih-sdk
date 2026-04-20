import { FiscalYear } from "../enum/fiscal-year"

const ALL = FiscalYear.ALL

export type FiscalYearIr =
    | {
        kind: "all"
    }
    | {
        kind: "notAll"
        years: Exclude<FiscalYear, typeof ALL>
    }