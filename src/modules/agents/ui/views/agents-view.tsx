"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";

export const AgentsView = () => {
    const [filters, setFilters] = useAgentsFilters();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns}/>
            <DataPagination 
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
            />

            {data.items.length === 0 && <EmptyState title="Create a New Agent" description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call." />}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState 
            title="Loading Agents" 
            description="Please wait this may take a few seconds" />
    );
};

export const AgentsViewError = () => {
    return (
        <ErrorState 
            title="Error loading agents" 
            description="Something went wrong. Please try again" />
    );
};