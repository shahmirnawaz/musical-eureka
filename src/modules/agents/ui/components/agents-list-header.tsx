"use client";

import { Plus, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
    const [filters, setFilters] = useAgentsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = !!filters.search;
    
    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE
        });
    };
    return (
        <>
            <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="w-4 h-4" />
                        New Agent
                    </Button>
                </div>
                <div className="flex items-center gap-x-2 p-1">
                    <AgentsSearchFilter />
                    {isAnyFilterModified && (
                        <Button onClick={onClearFilters} variant="outline" size="sm">
                            <XCircleIcon />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};