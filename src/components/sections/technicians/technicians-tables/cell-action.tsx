import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Technician } from "@/constants/data";
import { Edit, MoreHorizontal, View } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { techniciansApi } from "@/toolkit/technicians/technicians.api";
import CreateTechnicianModal from "../views/CreateTechnicianModal";
interface CellActionProps {
  data: Technician;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);

  const handleShowTechnicianModal = () => {
    setShowTechnicianModal(!showTechnicianModal);
  };
  const { useGetAllTechniciansQuery } = techniciansApi;
  const { refetch } = useGetAllTechniciansQuery();

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={false}
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
          <DropdownMenuItem
            onClick={() => router.push(`/technicians/view/${data?.id}`)}
          >
            <View className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShowTechnicianModal}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTechnicianModal
        isOpen={showTechnicianModal}
        onClose={handleShowTechnicianModal}
        refetch={refetch}
        data={data}
        isEdit={true}
      />
    </>
  );
};
