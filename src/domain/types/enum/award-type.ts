export const AwardType = {
    NewApplication: "1",
    CompetingContinuationOrRenewal: "2",
    ApplicationForAdditionalSupport: "3",
    CompetingExtensionOrNonCompetingFastTrack: "4",
    CompetingType4: "4C",
    NonCompetingType4: "4N",
    NonCompetingContinuation: "5",
    ChangeOfOrganizationStatus: "6",
    ChangeOfGranteeInstitution: "7",
    ChangeOfInstituteOrDivision: "8",
    ChangeOfNihAwardingInstituteOrDivision: "9",
} as const;

export type AwardType = typeof AwardType[keyof typeof AwardType];