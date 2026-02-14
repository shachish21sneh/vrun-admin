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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  SunIcon,
  MoonIcon,
  StarIcon,
  CloudIcon,
  CloudRainIcon,
  Snowflake,
  WindIcon,
  Trash2,
  CarFront,
} from "lucide-react";

import { commonState } from "@/toolkit/common/common.slice";
import { useCreateMerchantsMutation } from "@/toolkit/merchants/merchants.api";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";
import { MasterCarBrand } from "@/constants/data";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const daysList = [
  { value: "Monday", label: "Monday", icon: SunIcon },
  { value: "Tuesday", label: "Tuesday", icon: MoonIcon },
  { value: "Wednesday", label: "Wednesday", icon: StarIcon },
  { value: "Thursday", label: "Thursday", icon: CloudIcon },
  { value: "Friday", label: "Friday", icon: CloudRainIcon },
  { value: "Saturday", label: "Saturday", icon: Snowflake },
  { value: "Sunday", label: "Sunday", icon: WindIcon },
];

const formSchema = z.object({
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
  image_url: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateMerchantPage() {
  const router = useRouter();
  const { token } = useSelector(commonState);
  const [loading, setLoading] = useState(false);
  const [createMerchant] = useCreateMerchantsMutation();

  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
  const { data, isSuccess } = useGetAllCarBrandsQuery();

  const carBrandsData =
    isSuccess && data?.data
      ? data.data.map((brand: MasterCarBrand) => ({
          label: brand.display_name,
          value: brand.id,
          icon: CarFront,
        }))
      : [];

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
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (values.image_url?.[0]) {
        imageUrl = await handleFileUpload(values.image_url[0]);
      }

      await createMerchant({
        ...values,
        image_url: imageUrl ?? "",
      }).unwrap();

      toast.success("Merchant created successfully");
      router.push("/merchant");
    } catch {
      toast.error("Something went wrong");
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

          {/* You can safely paste your remaining full UI here */}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Merchant"}
          </Button>

        </form>
      </Form>
    </div>
  );
}