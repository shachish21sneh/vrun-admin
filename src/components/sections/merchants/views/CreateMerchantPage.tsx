/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/file-uploader";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";
import Autocomplete from "react-google-autocomplete";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { commonState } from "@/toolkit/common/common.slice";
import { useCreateMerchantsMutation } from "@/toolkit/merchants/merchants.api";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";

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
  contact_persons: z.array(z.any()),
  working_days: z.array(z.string()),
  password: z.string().min(8),
  brands: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateMerchantPage() {
  const router = useRouter();
  const { token } = useSelector(commonState);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: "",
      business_email: "",
      business_phone: "",
      active: true,
      full_address: "",
      city: "",
      state: "",
      latitude: 0,
      longitude: 0,
      contact_persons: [],
      working_days: [],
      password: "",
      brands: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contact_persons",
  });

  const [createMerchant] = useCreateMerchantsMutation();
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
  const { data } = useGetAllCarBrandsQuery();

  const handleFileUpload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder_name", "merchant");

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}media/upload`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res?.data?.Location;
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      let imageUrl = "";

      if (values.image_url?.[0]) {
        imageUrl = await handleFileUpload(values.image_url[0]);
      }

      await createMerchant({
        ...values,
        image_url: imageUrl,
      }).unwrap();

      toast.success("Merchant created successfully");
      router.push("/merchant");

    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Merchant"}
          </Button>

        </form>
      </Form>
    </div>
  );
}