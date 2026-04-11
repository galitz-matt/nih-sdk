export const Field = {
    /**
     * Application ID.
     * 
     * A unique identifier of the project record in the RePORTER database
     */
    ApplId: "ApplId",
    /** 
     * Activity Code
     * 
     * A 3-character code identifying the grant, contract, or intramural activity through which a project is supported. 
     * A comprehensive list of activity codes for grants and cooperative agreements can be found here: https://grants.nih.gov/funding/activity-codes
     */
    ActivityCode: "ActivityCode",
    /**
     * Administering Institute or Center.
     * 
     * Includes A two-character code to designate the agency, NIH Institute, or Center administering the grant, IC name and abbreviation for IC name
     */
    AgencyIcAdmin: "AgencyIcAdmin",
    /**
     * Project Abstract
     */
    AbstractText: "AbstractText",
    /**
     * Agency Code
     * 
     * Code for Agency that is responsible for the administering of a research grant, project, or contract. 
     */
    AgencyCode: "AgencyCode",
    /**
     * Funding Institute or Centers
     * 
     * The NIH Institute or Center(s) providing funding for a project are
    designated by their acronyms (see Institute/Center acronyms). Project funding information is
    available only for NIH, CDC, FDA, and ACF projects
     */
    AgencyIcFundings: "AgencyIcFundings",
    /**
     * Arra Indicator
     * 
     * “Y” indicates a project supported by funds appropriated through the American Recovery and Reinvestment Act of 2009.
     */
    ArraFunded: "ArraFunded",
    /**
     * Total Project Funding
     * 
     * Total project funding from all NIH Institute and Centers for a
    given fiscal year. Costs are available only for:

    • NIH, CDC, FDA, and ACF grant awards (only the parent record of multi-project grants).

    • NIH intramural projects (activity codes beginning with “Z”) in FY 2007 and later fiscal
    years.

    • NIH contracts (activity codes beginning with “N”).

    For multi-project grants, Total_Cost includes funding for all the constituent subprojects. This
    data element will have total cost of each subproject if the project is a subproject.
     */
    AwardAmount: "AwardAmount",
    /**
     * Award Notice Date
     * 
     * The Notice of Grant Award issue date.
     */
    AwardNoticeDate: "AwardNoticeDate",
    /**
     * A single-digit code identifying the type of application received and
    processed. Application type codes include the following:

    1 = New application

    2 = Competing continuation (also, competing renewal)

    3 = Application for additional (supplemental) support. There are
    two kinds of Type 3 competing revisions (which are peer-reviewed
    and administrative supplements)

    4 = Competing extension for an R37 award or first non-competing
    year of a Fast-Track SBIR/STTR award. This includes the
    following Type 4 subclassifications:

    4C = Competing Type 4

    4N = Noncompeting Type 4

    5 = Non-competing continuation

    6 = Change of Organization Status (Successor-In-Interest)

    7 = Change of grantee institution

    8 = Change of Institute or Division (Type 5 transfer to another
    NIH IC)

    9 = Change of NIH awarding Institute or Division (on a competing
    continuation)
     */
    AwardType: "AwardType",
    /**
     * Budget End Date
     * 
     * The date when a project’s funding for a particular fiscal year ends.
     */
    BudgetEnd: "BudgetEnd",
    /**
     * Budget Start Date
     * 
     * The date when a project’s funding for a particular fiscal year begins.
     */
    BudgetStart: "BudgetStart",
    /**
     * CFDA Code
     * 
     * Federal programs are assigned a number in the Catalog of Federal Domestic Assistance (CFDA), which is referred to as the "CFDA code." 
     */
    CfdaCode: "CfdaCode",
    /**
     * Congressional District
     * 
     * The congressional district in which the business office of the
    grantee organization or contractor is located. Note that this may be different from the research
    performance site.
     */
    CongDist: "CongDist",
    /**
     * Name of PI Contact
     * 
     * When multiple PD/PIs are designated, NIH requires that the
    applicant organization identify one of the PD/PIs as the Contact
    PD/PI to serve as a primary point of contact. Serving as Contact
    PD/PI confers no special authorities or responsibilities within the
    project team.
     */
    ContactPiName: "ContactPiName",
    /**
     * Core Project Number
     * 
     * An identifier for each research project, used to associate the project
    with publication and patent records. This identifier is not specific to any particular year of the
    project. It consists of the project activity code, administering IC, and serial number (a
    concatenation of Activity, Administering_IC, and Serial_Number).
     */
    CoreProjectNum: "CoreProjectNum",
    /**
     * NIH COVID-19 Response
     * 
     * NIH COVID-19 Response: These special selectors will return
    projects awarded to study COVID-19 and related topics, as funded under:

    • RegCV - NIH regular appropriations funding

    • CV - Coronavirus Preparedness and Response Supplemental
    Appropriations Act, 2020

    • C3 - CARES Act (Coronavirus Aid, Relief, and Economic Security
    Act)

    • C4 - Paycheck Protection Program and Health Care Enhancement
    Act

    • C5 - Coronavirus Response and Relief Supplemental
    Appropriations Act, 2021

    • C6 - American Rescue Plan Act of 2021
     */
    CovidResponse: "CovidResponse",
    /**
     * Date Added
     * 
     * Date Added is the date when an awarded project record is added to the RePORTER site
     */
    DateAdded: "DateAdded",
    /**
     * Total of Direct Cost Funding
     * 
     * Total direct cost funding for a project from all NIH Institute and
    Centers for a given fiscal year. Costs are available only for NIH awards funded in FY 2012
    onward. Direct cost amounts are not available for SBIR/STTR awards.
     */
    DirectCostAmount: "DirectCostAmt",
    /**
     * Fiscal Year
     * 
     * The fiscal year appropriation from which project funds were obligated.
     */
    FiscalYear: "FiscalYear",
    /**
     * Full Study Section
     * 
     * A six-digit number assigned in serial number order within each administering organization. 
     */
    FullStudySection: "FullStudySection",
    /**
     * Funding Mechanism
     * 
     * The major mechanism categories used in NIH Budget mechanism
    tables for the President’s budget. Extramural research awards are divided into three main
    funding mechanisms: grants, cooperative agreements, and contracts. A funding mechanism is
    the type of funded application or transaction used at the NIH. Within each funding mechanism
    NIH includes programs. Programs can be further refined by specific activity codes.

    RP = Non-SBIR/STTR Research Projects

    SB = SBIR/STTR Research Projects

    RC = Research Centers 

    OR = Other Research-Related

    TR = Training, Individual,

    TI = Training, Institutional,

    CO = Construction Grants

    NSRDC = Non-SBIR/STTR Contracts

    SRDC = SBIR/STTR Contracts,

    IAA = Interagency Agreements

    IM = Intramural Research

    OT = Other

    UK = Unknown

    CP = Cancer Control
     */
    FundingMechanism: "FundingMechanism",
    /**
     * Total of Indirect Cost Funding
     * 
     * Total indirect cost funding for a project from all NIH Institute and
    Centers for a given fiscal year. Costs are available only for NIH awards funded in FY 2012 and
    onward. Indirect cost amounts are not available for SBIR/STTR awards.
     */
    IndirectCostAmount: "IndirectCostAmt",
    /**
     * Active Project Indicator
     * 
     * Indicates whether a project is active. An active project is whose
    latest Budget End Date has not occurred yet. The project becomes inactive when the latest
    Budget End date has past current date.
     */
    IsActive: "IsActive",
    /**
     * Newly Added Project Indicator
     * 
     * Indicates whether a project is newly added to the system. A project
    is considered newly added only when the project is loaded in the past two data refreshes. Projects
    will not be considered as newly added projects after 3rd data refresh.
     */
    IsNew: "IsNew",
    /**
     * The major mechanism categories used in NIH Budget mechanism
    tables for the President’s budget. Extramural research awards are divided into three main
    funding mechanisms: grants, cooperative agreements, and contracts. A funding mechanism is
    the type of funded application or transaction used at the NIH. Within each funding mechanism
    NIH includes programs. Programs can be further refined by specific activity codes.

    RP = Non-SBIR/STTR Research Projects

    SB = SBIR/STTR Research Projects

    RC = Research Centers

    OR = Other Research-Related

    TR = Training, Individual,

    TI = Training, Institutional,

    CO = Construction Grants

    NSRDC = Non-SBIR/STTR Contracts

    SRDC = SBIR/STTR Contracts,

    IAA = Interagency Agreements

    IM = Intramural Research

    Other = Other (OT), Unknown (UK), and Cancer Control (CP)

    Note: Users use value "Other" to search for combined Funding Mechanisms "UK", "OT", and
    "CP"
     */
    MechanismCodeDc: "MechanismCodeDc",
    /**
     * Funding Opportunity Announcement
     * 
     * The number of the funding opportunity announcement, if any,
    under which the project application was solicited. Funding opportunity announcements may be
    categorized as program announcements, requests for applications, notices of funding
    availability, solicitations, or other names depending on the agency and type of program.
    Funding opportunity announcements can be found at Grants.gov/FIND and in the NIH Guide to
    Grants and Contracts.
     */
    OpportunityNumber: "OpportunityNumber",
    /**
     * Organization
     * 
     * Educational institution, research organization, business, or
    government agency receiving funding for the grant, contract, cooperative agreement, or
    intramural project.
     */
    Organization: "Organization",
    /**
     * Organization Type
     * 
     * Generic name for the grouping of components across an institution
    who has applied for or receives NIH funding. The official name as used by NIH is Major
    Component Combining Name
     */
    OrganizationType: "OrganizationType",
    /**
     * Public Health Relevance
     * 
     * Submitted as part of a grant application, this statement articulates a project's potential to improve public health.
     */
    PhrText: "PhrText",
    /**
     * Project Terms
     * 
     * Prior to fiscal year 2008, these were thesaurus terms assigned by
    NIH CRISP indexers. For projects funded in fiscal year 2008 and later, these are concepts that
    are mined from the project's title, abstract, and specific aims using an automated text mining
    tool
     */
    PrefTerms: "PrefTerms",
    /**
     * Principal Investigators
     * 
     * Principal Investigator(s) designated by the organization to direct the research project.
     */
    PrincipalInvestigators: "PrincipalInvestigators",
    /**
     * Program Officers
     * 
     * An Institute staff member who coordinates the substantive aspects of a project from planning the request for proposal to oversight of awards.
     */
    ProgramOfficers: "ProgramOfficers",
    /**
     * Project Details Page URL
     * 
     * URL for project details on RePORTER
     */
    ProjectDetailUrl: "ProjectDetailUrl",
    /**
     * Project End Date
     * 
     * The current end date of the project, including any future years for
    which commitments have been made. For subprojects of a multi-project grant, this is the end
    date of the parent award. Upon competitive renewal of a grant, the project end date is extended
    by the length of the renewal award.
     */
    ProjectEndDate: "ProjectEndDate",
    /**
     * Full Project Number
     * 
     * Commonly referred to as a grant number, intramural project, or
    contract number. For grants, this unique identification number is composed of the type code,
    activity code, Institute/Center code, serial number, support year, and (optional) a suffix code to
    designate amended applications and supplements.
     */
    ProjectNum: "ProjectNum",
    /**
     * Project Number Components Split
     * 
     * For grants, this unique identification number is composed of the type code, activity code, Institute/Center code, serial number, support year, and/or suffix code.
     */
    ProjectNumSplit: "ProjectNumSplit",
    /**
     * Project Serial Number
     * 
     * A six-digit number assigned in serial number order within each administering organization. 
     */
    ProjectSerialNum: "ProjectSerialNum",
    /**
     * Project Start Date
     * 
     * The start date of a project. For subprojects of a multi-project grant, this is the start date of the parent award.
     */
    ProjectStartDate: "ProjectStartDate",
    /**
     * Project Title
     * 
     * Title of the funded grant, contract, or intramural (sub)project.
     */
    ProjectTitle: "ProjectTitle",
    /**
     * NIH Spending Categories Code
     * 
     * Code of spending categories.
     */
    SpendingCategories: "SpendingCategories",
    /**
     * NIH Spending Categories
     * 
     * Congressionally mandated reporting categories into which NIH
    projects are categorized. Available for fiscal years 2008 and later. Each project’s spending
    category designations for each fiscal year are made available the following year as part of the
    next President’s Budget request. See the Research, Condition, and Disease Categorization
    System for more information on the categorization process. A complete list of numeric
    identifiers for Spending Categories for FY2020 can be found here: https://api.reporter.nih.gov/documents/Data%20Elements%20for%20RePORTER%20Project%20API_V2.pdf
     */
    SpendingCategoriesDesc: "SpendingCategoriesDesc",
    /**
     * Sub Project ID
     * 
     * A unique numeric designation assigned to subprojects of a “parent” multi-project research grant.
     */
    SubProjectId: "SubprojectId",
    /**
     * RCDC Thesaurus Terms
     * 
     * The RCDC thesaurus combines terms and concepts from several
    sources:

    • National Library of Medicine’s MeSH (Medical Subject Headings)
    thesaurus

    • CRISP thesaurus

    • The National Cancer Institute’s thesaurus

    • Metathesaurus

    • Jablonsky’s dictionary

    • Other specific types of concepts from NIH Institutes and Centers

    • Additional words or phrases added by NIH scientific experts to ensure capture of specific areas
     */
    Terms: "Terms",
} as const
export type Field = typeof Field[keyof typeof Field]