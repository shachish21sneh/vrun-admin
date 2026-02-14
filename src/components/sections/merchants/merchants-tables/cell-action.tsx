"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Merchant } from "@/constants/data";
import { MoreHorizontal, View, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useUpdateMerchantStatusMutation } from "@/toolkit/merchants/merchants.api";

interface CellActionProps {
  data: Merchant;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [updateMerchantStatus, { isLoading }] =
    useUpdateMerchantStatusMutation();

  const onConfirm = async () => {
    try {
      await updateMerchantStatus({
        id: data.id,
        active: !data.active,
      }).unwrap();

      toast.success(
        data.active
          ? "Merchant deactivated successfully"
          : "Merchant activated successfully"
      );

      setOpen(false);
    } catch (error) {
  console.error("Status update failed:", error);
  toast.error("Failed to update merchant status");
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
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
  <DropdownMenuLabel>Actions</DropdownMenuLabel>

  <DropdownMenuItem
    onClick={() => router.push(`/merchant/view/${data?.id}`)}
  >
    <View className="mr-2 h-4 w-4" /> View
  </DropdownMenuItem>

  <DropdownMenuItem
    onClick={() => router.push(`/merchant/edit/${data?.id}`)}
  >
    <Edit className="mr-2 h-4 w-4" /> Edit
  </DropdownMenuItem>

  <DropdownMenuItem onClick={() => setOpen(true)}>
    {data.active ? "Inactive" : "Activate"}
  </DropdownMenuItem>
</DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};