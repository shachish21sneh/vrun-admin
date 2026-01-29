import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Testimonial } from "@/constants/data";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { testimonialsApi } from "@/toolkit/testimonials/testimonials.api";
import CreateTestimonialModal from "../views/CreateTestimonialModal";
import { toast } from "react-toastify";
interface CellActionProps {
  data: Testimonial;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  const handleShowTestimonialModal = () => {
    setShowTestimonialModal(!showTestimonialModal);
  };

  const { useGetAllTestimonialsQuery, useDeleteTestimonialsMutation } =
    testimonialsApi;

  const { refetch } = useGetAllTestimonialsQuery();
  const [handleDeleteTestimonials, { isLoading }] =
    useDeleteTestimonialsMutation();
  const onConfirm = async () => {
    try {
      await handleDeleteTestimonials({
        id: data.id,
      });
      toast.success("Testimonial deleted successfully");
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error("Error deleting testimonial");
      console.error("Error deleting testimonial:", error);
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

          <DropdownMenuItem onClick={handleShowTestimonialModal}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTestimonialModal
        isOpen={showTestimonialModal}
        onClose={handleShowTestimonialModal}
        refetch={refetch}
        data={data}
        isEdit={true}
      />
    </>
  );
};
