export const AwardType = {
    CompetingRenewal: "2;4C;9",
    New: "1",
    Noncompeting: "4N;5;6;7;8",
    RevisionOrSupplement: "3",
} as const;

export type AwardType = typeof AwardType[keyof typeof AwardType];