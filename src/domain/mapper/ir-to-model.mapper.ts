import type { PublicationsSearch } from "../../infra/types/model/projects-input.model";
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
}