"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { DotsHorizontalIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import LoadingModal from "@/components/modals/loading-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

// import { NewOpportunityForm } from "../../opportunities/components/NewOpportunityForm";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Toaster as useSonner } from "@/components/ui/sonner";

interface CRMKanbanProps {
  salesStages: crm_Opportunities_Sales_Stages[];
  opportunities: crm_Opportunities[];
  crmData: any;
}

const CRMKanban = ({
  salesStages,
  opportunities: data,
  crmData,
}: CRMKanbanProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [opportunities, setOpportunities] = useState(data);

  const { users, accounts, contacts, saleTypes, saleStages, campaigns } =
    crmData;

  useEffect(() => {
    setOpportunities(data);
    setIsLoading(false);
  }, [data]);

  const onDragEnd = (result: any) => {
    setIsLoading(true);

    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      setIsLoading(false);
      return;
    }

    // Mise à jour locale de l'état sans appel backend
    const updatedOpportunities = opportunities.map((opp) =>
      opp.id === draggableId
        ? { ...opp, sales_stage: destination.droppableId }
        : opp
    );
    setOpportunities(updatedOpportunities);

    

    router.refresh(); // Simuler un rafraîchissement
    setIsLoading(false);
  };

  return (
    <>
      <LoadingModal
        title="Réorganisation des opportunités"
        description="Veuillez patienter pendant la mise à jour"
        isOpen={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="min-w-[1000px] py-10 overflow-auto">
          
        </DialogContent>
      </Dialog>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full h-full overflow-x-auto">
          {salesStages.map((stage) => (
            <Droppable key={stage.id} droppableId={stage.id}>
              {(provided) => (
                <Card ref={provided.innerRef} {...provided.droppableProps} className="mx-1 w-full min-w-[300px] overflow-hidden pb-10">
                  <CardTitle className="flex gap-2 p-3 justify-between">
                    <span className="text-sm font-bold">{stage.name}</span>
                    <PlusCircledIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => {
                        setSelectedStage(stage.id);
                        setIsDialogOpen(true);
                      }}
                    />
                  </CardTitle>
                  <CardContent className="w-full h-full overflow-y-scroll">
                    {opportunities
                      .filter((opportunity) => opportunity.sales_stage === stage.id && opportunity.status === "ACTIVE")
                      .map((opportunity, index) => (
                        <Draggable key={opportunity.id} draggableId={opportunity.id} index={index}>
                          {(provided) => (
                            <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="my-2 w-full">
                              <CardTitle className="p-2 text-sm flex justify-between">
                                <span className="font-bold">{opportunity.name}</span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <DotsHorizontalIcon className="w-4 h-4 text-slate-600" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[160px]">
                                    <DropdownMenuItem onClick={() => router.push(`/crm/opportunities/${opportunity.id}`)}>Voir</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </CardTitle>
                              <CardContent className="text-xs text-muted-foreground">
                                <div className="flex flex-col space-y-1">
                                  <HoverCard>
                                    <HoverCardTrigger>{opportunity.description.substring(0, 200)}</HoverCardTrigger>
                                    <HoverCardContent>{opportunity.description}</HoverCardContent>
                                  </HoverCard>
                                  <div className="space-x-1">
                                    <span>Montant:</span>
                                    <span>{opportunity.budget}</span>
                                  </div>
                                  <div className="space-x-1">
                                    <span>Clôture prévue:</span>
                                    <span className={opportunity.close_date && new Date(opportunity.close_date) < new Date() ? "text-red-500" : ""}>
                                      {format(opportunity.close_date ? new Date(opportunity.close_date) : new Date(), "dd/MM/yyyy")}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <div className="flex text-xs items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={opportunity.assigned_to_user.avatar || "/images/nouser.png"} />
                                  </Avatar>
                                  <span>{opportunity.assigned_to_user.name}</span>
                                </div>
                                <ThumbsDown className="w-4 h-4 text-red-500 cursor-pointer" />
                              </CardFooter>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default CRMKanban;
