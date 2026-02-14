/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/file-uploader";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";

import Autocomplete from "react-google-autocomplete";

import { Trash2 } from "lucide-react";

import { commonState } from "@/toolkit/common/common.slice";
import { useCreateMerchantsMutation } from "@/toolkit/merchants/merchants.api";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
  password: z.string().min(8),
  brands: z.array(z.string()).nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateMerchantPage: React.FC = () => {
  const router = useRouter();
  const { token } = useSelector(commonState);
  const [loading, setLoading] = useState(false);

  const [createMerchant] = useCreateMerchantsMutation();
  const { data: brandData } =
    masterCarBrandsApi.useGetAllCarBrandsQuery();

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
      contact_persons: [{ name: "", email: "", phone: "", position: "" }],
      working_days: [],
      password: "",
      brands: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contact_persons",
  });

  const brandOptions =
    brandData?.data?.map((b: any) => ({
      label: b.display_name,
      value: b.id,
    })) || [];

  const handleFileUpload = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder_name", "merchant");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}media/upload`,
      formDataUpload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data?.Location;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      let imageUrl = "";

      if (values.image_url?.[0]) {
        imageUrl = await handleFileUpload(values.image_url[0]);
      }

      await createMerchant({
        ...values,
        image_url: imageUrl,
        contact_persons: values.contact_persons || [],
      }).unwrap();

      toast.success("Merchant created successfully");
      router.push("/merchant");
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.data?.error ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelected = (place: any) => {
    form.setValue("full_address", place?.formatted_address);
    form.setValue("city",
      place?.address_components?.find((c: any) =>
        c.types.includes("locality")
      )?.long_name || ""
    );
    form.setValue("state",
      place?.address_components?.find((c: any) =>
        c.types.includes("administrative_area_level_1")
      )?.short_name || ""
    );
    form.setValue("latitude", place?.geometry?.location?.lat() || 0);
    form.setValue("longitude", place?.geometry?.location?.lng() || 0);
  };

  return (
    <div className="container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Logo */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Logo</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={1}
                    maxSize={MAX_FILE_SIZE}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Info */}
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
            name="business_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput {...field} defaultCountry="IN" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
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

          {/* Brands */}
          <FormField
            control={form.control}
            name="brands"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brands</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={brandOptions}
                    onValueChange={field.onChange}
                    placeholder="Select brands"
                  />
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
};

export default CreateMerchantPage;