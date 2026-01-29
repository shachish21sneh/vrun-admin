import React, { useState } from "react";

// constants
import { MasterSunroofProblem } from "@/constants/data";

// icons
import { Edit, MoreHorizontal } from "lucide-react";

// components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modal/alert-modal";
import CreateMasterSunroofProblemModal from "../views/CreateMasterSunroofProblemModal";

import { masterSunroofProblemApi } from "@/toolkit/masterSunroofProblems/masterSunroofProblems.api";

interface CellActionProps {
  data: MasterSunroofProblem;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [showMasterSunroofProblemModal, setShowMasterSunroofProblemModal] =
    useState(false);

  const handleShowMasterSunroofProblemModal = () => {
    setShowMasterSunroofProblemModal(!showMasterSunroofProblemModal);
  };

  const { useGetAllSunroofProblemsQuery } = masterSunroofProblemApi;

  const { refetch } = useGetAllSunroofProblemsQuery();

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
          <DropdownMenuItem onClick={handleShowMasterSunroofProblemModal}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateMasterSunroofProblemModal
        isOpen={showMasterSunroofProblemModal}
        onClose={handleShowMasterSunroofProblemModal}
        refetch={refetch}
        data={data}
        isEdit={true}
      />
    </>
  );
};
