export const CovidResponse = {
    NihRegularAppropriationsFundingUsedForCovid19Research: "Reg-CV",
    NihCovid19SpecialAppropriationsFunding: ["CV", "C3", "C4", "C5", "C6"],
    CvCoronavirusPreparednessAndResponseSupplementalAppropriationsAct: "CV",
    C3CaresActCoronavirusAidReliefAndEconomicSecurityAct: "C3",
    C4PaycheckProtectionProgramAndHealthCareEnhancementAct: "C4",
    C5CoronavirusResponseAndReliefSupplementalAppropriationsAct: "C5",
    C6AmericanRescuePlanActOf2021: "C6",
} as const;

export type CovidResponse = typeof CovidResponse[keyof typeof CovidResponse];