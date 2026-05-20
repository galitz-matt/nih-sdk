export const ApplicationTypeCode = {
    New: 1,
    Renewal: 2,
    Revision: 3,
    Extension: 4,
    NonCompetingContinuation: 5,
    ChangeOfOrganizationStatus: 6,
    ChangeOfGranteeOrTrainingInstituion: 7,
    ChangeOfInstituteOrCenterNonCompetingContinuation: 8,
    ChangeOfInstituteOrCenterRenewal: 9
} as const
export type ApplicationTypeCode = typeof ApplicationTypeCode[keyof typeof ApplicationTypeCode];