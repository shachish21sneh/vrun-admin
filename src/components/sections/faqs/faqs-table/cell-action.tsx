import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Faq } from "@/constants/data";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

import CreateFaqModal from "../views/CreateFaqModal";
import { faqsApi } from "@/toolkit/faqs/faqs.api";
import { toast } from "react-toastify";
interface CellActionProps {
  data: Faq;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const handleShowFaqModal = () => {
    setShowFaqModal(!showFaqModal);
  };

  const { useGetAllFaqsQuery, useDeleteFaqMutation } = faqsApi;

  const { refetch } = useGetAllFaqsQuery();
  const [handleDeleteFaq, { isLoading }] = useDeleteFaqMutation();

  const onConfirm = async () => {
    try {
      await handleDeleteFaq({
        id: data.id,
      });
      toast.success("FAQ deleted successfully");
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Error deleting FAQ");
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={isLoading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleShowFaqModal}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateFaqModal
        isOpen={showFaqModal}
        onClose={handleShowFaqModal}
        refetch={refetch}
        data={data}
        isEdit={true}
      />
    </>
  );
};
