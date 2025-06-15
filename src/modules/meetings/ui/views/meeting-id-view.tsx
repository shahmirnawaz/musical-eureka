"use client";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "@/modules/meetings/ui/components/meeting-id-view-header";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "@/modules/meetings/ui/components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CanceledState } from "../components/canceled-state";
import { ProcessingState } from "../components/processing-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [UpdateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "This action cannot be undone and will remove this meeting"
    );



    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));


const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            //TODO: invalidate free tier usage
            router.push("/meetings");
        },
    }),
);

const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
};

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCanceled = data.status === "canceled";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";

    return (
        <>
            <RemoveConfirmation />
            <UpdateMeetingDialog
                open={UpdateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                    meetingId={meetingId}
                    meetingName={data?.name || ""}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onRemove={handleRemoveMeeting}
                />
                {isCanceled && <CanceledState />}
                {isCompleted && <div>Completed</div>}
                {isProcessing && <ProcessingState />}
                {isActive && <ActiveState meetingId={meetingId} />}
                {isUpcoming && (<UpcomingState 
                    meetingId={meetingId}
                    onCancelMeeting={() => {}}
                    isCancelling={false}
                />)}
            </div>
        </>
    )
};

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState 
            title="Loading Meeting" 
            description="Please wait this may take a few seconds" 
        />
    );
};

export const MeetingIdViewError = () => {
    return (
        <ErrorState 
            title="Error loading meeting" 
            description="Something went wrong. Please try again" 
        />
    );
};