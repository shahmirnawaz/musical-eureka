import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingIdView, MeetingIdViewLoading, MeetingIdViewError } from "@/modules/meetings/ui/views/meeting-id-view";
import { CallView } from "@/modules/call/ui/views/call-view";

interface Props {
    params: Promise<{ meetingId: string }>;
};

const Page = async ({ params }: Props) => {
    const { meetingId } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    //pre-fetch meetings.getTranscript

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CallView meetingId={meetingId} />
        </HydrationBoundary>
    );
};

export default Page;