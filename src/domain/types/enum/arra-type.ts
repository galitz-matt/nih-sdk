export const ArraType = {
    NihArraFundedProjects: ["CER", "GO", "CG", "MA"],
    ComparativeEffectivenessResearchArraSetAside: "CER",
    GrandOpportunities: "GO",
    ChallengeGrants: "CG",
    MiscellaneousArra: "MA",
} as const;

export type ArraType = typeof ArraType[keyof typeof ArraType];