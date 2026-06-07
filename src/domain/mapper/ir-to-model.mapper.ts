import type { AdvancedTextSearch, PublicationsSearch } from "../../infra/types/model/projects-input.model";
import type { AdvancedTextSearchIr } from "../types/ir/advanced-text-search.ir";
import type { PublicationsSearchIr } from "../types/ir/publications-search.ir";

export class IrToModelMapper {
    static toPublicationsSearch(ir: PublicationsSearchIr): PublicationsSearch {
        return {
            publications_text_search: ir.text,
            pm_id: ir.pmIds?.map(id => id.toString()),
            pmc_id: ir.pmcIds?.map(id => id.toString()),
            appl_id: ir.applicationIds,
            core_project_nums: ir.coreProjectNumbers,
            get_non_nih_pubs: ir.includeNonNih ?? false,
            filter_appl_ids: ir.filterApplicationIds ?? false
        };
    }

    static toAdvancedTextSearch(ir: AdvancedTextSearchIr): AdvancedTextSearch {
        return {
            operator: ir.kind === "expr"
                ? "advanced"
                : ir.kind,
            search_field: ir.field,
            search_region: ir.region,
            search_text: ir.kind === "expr"
                ? ir.expr
                : ir.terms.join(" ")
        };
    }
}