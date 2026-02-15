"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import { useSelector } from "react-redux";

import {
  useGetMerchantDetailsQuery,
  useUpdateMerchantMutation,
} from "@/toolkit/merchants/merchants.api";

import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";
import { commonState } from "@/toolkit/common/common.slice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { FileUploader } from "@/components/file-uploader";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import { MasterCarBrand } from "@/constants/data";

/* ---------------- TYPES ---------------- */

type ContactPersonForm = {
  name: string;
  email: string;
  position: string;
  phone?: string | null;
};

type FormValues = {
  business_name: string;
  business_email: string;
  business_phone: string;
  full_address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  contact_persons: ContactPersonForm[];
  working_days: string[];
  brands: string[];
  active?: boolean;
};

type GooglePlace = {
  formatted_address?: string;
  address_components?: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
};

/* ---------------- COMPONENT ---------------- */

const EditMerchantPage = () => {
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.id as string;
  const { token } = useSelector(commonState);

  const { data } = useGetMerchantDetailsQuery(
    { id: merchantId },
    { skip: !merchantId }
  );

  const [updateMerchant] = useUpdateMerchantMutation();
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
  const { data: brandData } = useGetAllCarBrandsQuery();

  /* -------- IMAGE STATE (IMPORTANT) -------- */

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  /* ---------------- FORM ---------------- */

  const form = useForm<FormValues>({
    defaultValues: {
      business_name: "",
      business_email: "",
      business_phone: "",
      full_address: "",
      city: "",
      state: "",
      latitude: 0,
      longitude: 0,
      contact_persons: [],
      working_days: [],
      brands: [],
      active: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contact_persons",
  });

  /* ---------------- OPTIONS ---------------- */

  const daysOptions = useMemo(
    () => [
      { label: "Monday", value: "Monday" },
      { label: "Tuesday", value: "Tuesday" },
      { label: "Wednesday", value: "Wednesday" },
      { label: "Thursday", value: "Thursday" },
      { label: "Friday", value: "Friday" },
      { label: "Saturday", value: "Saturday" },
      { label: "Sunday", value: "Sunday" },
    ],
    []
  );

  const brandOptions = useMemo(
    () =>
      brandData?.data?.map((brand: MasterCarBrand) => ({
        label: brand.display_name,
        value: brand.id,
      })) || [],
    [brandData]
  );

  /* ---------------- PREFILL ---------------- */

  useEffect(() => {
    if (!data) return;

    const merchant = data as FormValues & { image_url?: string };

    setExistingImage(merchant.image_url ?? null);

    form.reset({
      business_name: merchant.business_name ?? "",
      business_email: merchant.business_email ?? "",
      business_phone: merchant.business_phone ?? "",
      full_address: merchant.full_address ?? "",
      city: merchant.city ?? "",
      state: merchant.state ?? "",
      latitude: merchant.latitude ?? 0,
      longitude: merchant.longitude ?? 0,
      contact_persons: merchant.contact_persons ?? [],
      working_days: merchant.working_days ?? [],
      brands: merchant.brands ?? [],
      active: merchant.active ?? true,
    });
  }, [data, form]);

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadImage = async (file: File): Promise<string> => {
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
          "X-Nhost-Bucket-Id": "public",
        },
      }
    );

    return response.data.Location;
  };

  /* ---------------- GOOGLE ADDRESS ---------------- */

  const handlePlaceSelected = (place: GooglePlace) => {
    if (!place) return;

    form.setValue("full_address", place.formatted_address ?? "");

    const city =
      place.address_components?.find((c) =>
        c.types.includes("locality")
      )?.long_name ?? "";

    const state =
      place.address_components?.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.short_name ?? "";

    const latitude = place.geometry?.location?.lat?.() ?? 0;
    const longitude = place.geometry?.location?.lng?.() ?? 0;

    form.setValue("city", city);
    form.setValue("state", state);
    form.setValue("latitude", latitude);
    form.setValue("longitude", longitude);
  };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (values: FormValues) => {
    try {
      let imageUrl = existingImage;

      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      const formattedContactPersons = values.contact_persons.map((cp) => ({
        ...cp,
        phone: cp.phone ?? null,
      }));

      await updateMerchant({
        id: merchantId,
        ...values,
        image_url: imageUrl ?? "",
        contact_persons: formattedContactPersons,
      }).unwrap();

      toast.success("Merchant updated successfully");
      router.push("/merchant");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update merchant");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="container max-w-5xl py-10">
      <h2 className="text-2xl font-semibold mb-6">Edit Merchant</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* IMAGE FIELD */}
          <div>
            <FormLabel>Business Logo</FormLabel>

            {existingImage && !newImage && (
              <img
                src={existingImage}
                alt="Logo"
                className="w-32 h-32 object-cover rounded mb-3"
              />
            )}

            <FileUploader
              value={newImage ? [newImage] : []}
              onValueChange={(files) => {
                if (files?.[0]) setNewImage(files[0]);
              }}
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
            />
          </div>

          {/* Rest of your fields remain same */}

          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Continue rest of form same as before */}
          
          <Button type="submit" className="w-full">
            Update Merchant
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditMerchantPage;