import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Banner } from "@/constants/data";
import { Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import CreateBannerModal from "../views/CreateBannerModal";
import { bannersApi } from "@/toolkit/banners/banners.api";

interface CellActionProps {
  data: Banner;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const handleShowBannerModal = () => {
    setShowBannerModal(!showBannerModal);
  };

  const { useGetAllBannersQuery } = bannersApi;

  const { refetch } = useGetAllBannersQuery();

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

          <DropdownMenuItem onClick={handleShowBannerModal}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateBannerModal
        isOpen={showBannerModal}
        onClose={handleShowBannerModal}
        refetch={refetch}
        data={data}
        isEdit={true}
      />
    </>
  );
};
