import type { FullStudySection } from "../../infra/types/model/projects-input.model";

export class FullStudySectionBuilder {
    private readonly studySection: FullStudySection = {};

    /**
     * Set the Integrated Review Group (IRG) code.
     * 
     * An IRG is a high-level organizational cluster of related Scientific Review
     * Groups (SRGs) within NIH CSR. Multiple study sections typically belong to the same IRG.
     * 
     * Examples: "RPHB", "AARR", etc.
     * 
     * @param irgCode - IRG identifier
     */
    irgCode(irgCode: string): this {
        this.studySection.irg_code = irgCode;
        return this;
    }

    /**
     * Set the scientific review group (SRG) code
     * 
     * The SRG is the specific study section or review panel responsible for evaluating the application.
     * 
     * Examples: "MDCN", "AIP", "BMIT-A", etc.
     * 
     * @param srgCode - SRG identifier
     */
    srgCode(srgCode: string): this {
        this.studySection.srg_code = srgCode;
        return this;
    }

    /**
     * Set the scientific review group (SRG) flex code 
     * 
     * Internal NIH classification field associated with the Scientific Review Group.
     * The exact meaning is not publicly documented by NIH (as of yet, 6/6/2026)
     * 
     * @param srgFlex - NIH internal SRG flex code
     */
    srgFlex(srgFlex: string): this {
        this.studySection.srg_flex = srgFlex;
        return this;
    }

    /**
     * Set the Scientific Review Administrator (SRA) designer code.
     * 
     * Identifies the NIH Scientific Review Administrator responsible for
     * coordinating the review meeting or study seciton.
     * 
     * The code appears to be an internal NIH staff identifier.
     * 
     * @param code - SRA designator code
     */
    sraDesignatorCode(code: string): this {
        this.studySection.sra_designator_code = code;
        return this;
    }

    /**
     * Set the SRA flex code.
     * 
     * Internal NIH administrative classification associated with the Scientific Review Administrator.
     * The exact meaning is not publicly documented by NIH (as of yet, 6/6/2026). 
     * 
     * @param code - NIH internal SRA flex code
     */
    sraFlexCode(code: string): this {
        this.studySection.sra_flex_code = code;
        return this;
    }

    /**
     * Set the study section group code.
     * 
     * Internal grouping identifier used to organize study sections within an Integrated Review Group (IRG)
     * or review administration structure
     * 
     * @param code - Group identifier
     */
    groupCode(code: string): this {
        this.studySection.group_code = code;
        return this;
    }

    /**
     * Set the full study section name.
     * 
     * This is the human-readable name of the Scientific Review Group (SRG)
     * that evaluates grant applications for scientific and technical merit.
     * 
     * Example:
     * "Molecular and Cellular Endocrinology Study Section"
     * 
     * @param name - Full study section name
     */
    name(name: string): this {
        this.studySection.name = name;
        return this;
    }

    /**
     * Set the NIH study section URL.
     *
     * Typically links to the NIH CSR page describing the study section
     * or review group.
     *
     * @param url - Study section webpage URL
     */
    url(url: string): this {
        this.studySection.url = url;
        return this;
    }

    /**
     * Set the committee identifier.
     *
     * Internal NIH committee ID corresponding to the study section record.
     * Appears to be a stable database identifier rather than a publicly
     * meaningful code.
     *
     * @param id - Committee identifier
     */
    cmteId(id: number): this {
        this.studySection.cmte_id = id;
        return this;
    }

    /**
     * Set the cluster IRG code.
     *
     * Higher-level organizational grouping of Integrated Review Groups (IRGs).
     * Appears to be used internally by NIH CSR to categorize related review
     * domains.
     *
     * The exact meaning is not publicly documented by NIH (as of yet, 6/6/2026)
     *
     * @param code - Cluster IRG identifier
     */
    clusterIrgCode(code: string): this {
        this.studySection.cluster_irg_code = code;
        return this;
    }

    build(): FullStudySection {
        return { ...this.studySection };
    }
}
