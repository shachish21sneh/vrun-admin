import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MasterCarModel } from "@/constants/data";
import { Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { masterCarModelApi } from "@/toolkit/masterCarModels/masterCarModels.api";
import CreateMasterCarModelModal from "../views/CreateMasterCarModelModal";
interface CellActionProps {
  data: MasterCarModel;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [showMasterCarModelModal, setShowMasterCarModelModal] = useState(false);

  const handleShowMasterCarModelModal = () => {
    setShowMasterCarModelModal(!showMasterCarModelModal);
  };

  const { useGetAllCarModelsQuery } = masterCarModelApi;

  const { refetch } = useGetAllCarModelsQuery({
    limit: 10,
    offset: 0,
    query: "",
  });

  const onConfirm = async () => {
    console.log("called");
  };

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
          {/* <DropdownMenuItem>
            <View className="mr-2 h-4 w-4" /> View
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleShowMasterCarModelModal}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateMasterCarModelModal
        isOpen={showMasterCarModelModal}
        onClose={handleShowMasterCarModelModal}
        refetch={refetch}
        data={data}
        isEdit={true}
      />
    </>
  );
};
