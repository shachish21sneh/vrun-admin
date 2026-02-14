/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useUpdateMerchantMutation } from "@/toolkit/merchants/merchants.api";
import CreateMerchantPage from "./CreateMerchantPage";

interface Props {
  merchantData: any;
  merchantId: string;
}

const formSchema = z.object({
  image_url: z.any().optional(),
  business_name: z.string(),
  business_email: z.string(),
  business_phone: z.string(),
  active: z.boolean(),
  full_address: z.string(),
  city: z.string(),
  state: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  contact_persons: z.array(z.any()),
  working_days: z.array(z.string()),
  password: z.string().optional(),
  brands: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const EditMerchantPage: React.FC<Props> = ({
  merchantData,
  merchantId,
}) => {
  const [updateMerchant] = useUpdateMerchantMutation();

  const handleUpdate = async (values: FormValues) => {
    try {
      const payload: any = { ...values };

      // ❌ do NOT send empty password
      if (!values.password) {
        delete payload.password;
      }

      await updateMerchant({
        id: merchantId,
        ...payload,
      }).unwrap();

      toast.success("Merchant updated successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        error?.data?.error ||
        "Update failed"
      );
    }
  };

  return (
    <CreateMerchantPage
      defaultValues={merchantData}
      isEdit
      merchantId={merchantId}
      onSubmitOverride={handleUpdate}
    />
  );
};

export default EditMerchantPage;