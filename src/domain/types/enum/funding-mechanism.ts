export const FundingMechanism = {
    ResearchProjectGrants: "RPG",
    ResearchCenters: "RC",
    OtherResearchRelated: "OR",
    TrainingIndividual: "TR",
    TrainingInstitutional: "TI",
    ConstructionGrants: "CO",
    RAndDContracts: "RDC",
    InteragencyAgreements: "IAA",
    IntramuralResearch: "IM",
    Other: "OT;UK;CP",
    NonSbirSttr: "RP",
    SbirSttr: "SB",
    NonSbirSttrContracts: "NSRDC",
    SbirSttrContracts: "SRDC",
} as const;

export type FundingMechanism = typeof FundingMechanism[keyof typeof FundingMechanism];