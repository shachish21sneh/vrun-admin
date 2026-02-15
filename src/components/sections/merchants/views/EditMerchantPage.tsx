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

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

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

      await updateMerchant({
        id: merchantId,
        ...values,
        image_url: imageUrl ?? "",
        contact_persons: values.contact_persons.map((cp) => ({
          ...cp,
          phone: cp.phone ?? null,
        })),
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

          {/* Image */}
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
    if (Array.isArray(files) && files.length > 0) {
      setNewImage(files[0]);
    }
  }}
  maxFiles={1}
  maxSize={5 * 1024 * 1024}
/>
          </div>

          {/* Basic Info */}
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

          <FormField
            control={form.control}
            name="business_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="full_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Autocomplete
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
                    value={field.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange(e.target.value)
                    }
                    onPlaceSelected={handlePlaceSelected}
                    className="w-full border border-input rounded-md h-9 px-3"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Working Days */}
          <FormField
            control={form.control}
            name="working_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working Days</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={daysOptions}
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Brands */}
          <FormField
            control={form.control}
            name="brands"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Brands</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={brandOptions}
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Contact Persons */}
          <div>
            <h3 className="font-semibold mb-3">Contact Persons</h3>

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 mb-4">

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.name`}
                  render={({ field }) => <Input {...field} />}
                />

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.email`}
                  render={({ field }) => <Input {...field} />}
                />

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.phone`}
                  render={({ field }) => (
                    <PhoneInput {...field} defaultCountry="IN" />
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.position`}
                  render={({ field }) => <Input {...field} />}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>

              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ name: "", email: "", position: "", phone: "" })
              }
            >
              Add Contact Person
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Update Merchant
          </Button>

        </form>
      </Form>
    </div>
  );
};

export default EditMerchantPage;