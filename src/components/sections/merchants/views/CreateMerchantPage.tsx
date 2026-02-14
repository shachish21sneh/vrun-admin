/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { commonState } from "@/toolkit/common/common.slice";
import { merchantsApi } from "@/toolkit/merchants/merchants.api";

interface Props {
  defaultValues?: any;
  isEdit?: boolean;
  merchantId?: string;
}

const formSchema = z.object({
  image_url: z.any().optional(),
  business_name: z.string().min(1),
  business_email: z.string().email(),
  business_phone: z.string().min(10),
  active: z.boolean(),
  full_address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  contact_persons: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().nullable(),
      position: z.string().min(1),
    })
  ),
  working_days: z.array(z.string()).nonempty(),
  password: z.string().min(8).optional(),
  brands: z.array(z.string()).nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateMerchantPage: React.FC<Props> = ({
  defaultValues,
  isEdit = false,
  merchantId,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(commonState);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      business_name: "",
      business_email: "",
      business_phone: "",
      active: true,
      full_address: "",
      city: "",
      state: "",
      latitude: 0,
      longitude: 0,
      contact_persons: [{ name: "", email: "", phone: "", position: "" }],
      working_days: [],
      password: "",
      brands: [],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  import {
  useCreateMerchantsMutation,
  useUpdateMerchantMutation,
} from "@/toolkit/merchants/merchants.api";

const [createMerchant] = useCreateMerchantsMutation();
const [updateMerchant] = useUpdateMerchantMutation();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_name", "merchant");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}media/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data?.Location;
  };

  const onSubmit = async (formData: FormValues) => {
    setLoading(true);

    try {
      let imageUrl: string | null = defaultValues?.image_url || null;

      if (formData.image_url?.[0]) {
        imageUrl = await handleFileUpload(formData.image_url[0]);
      }

      const payload: any = {
        ...formData,
        image_url: imageUrl ?? defaultValues?.image_url,
        contact_persons: formData.contact_persons || [],
      };

      if (!formData.password) {
        delete payload.password;
      }

      if (isEdit && merchantId) {
        await updateMerchant({
          id: merchantId,
          ...payload,
        }).unwrap();

        toast.success("Merchant updated successfully");
      } else {
        await createMerchant(payload).unwrap();
        toast.success("Merchant created successfully");
      }

      router.push("/merchant");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/merchant")}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>

          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEdit && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={loading}>
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Merchant"
              : "Create Merchant"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateMerchantPage;