"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";

import { merchantsApi } from "@/toolkit/merchants/merchants.api";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";
import { MasterCarBrand } from "@/constants/data";
import { Trash2, CarFront } from "lucide-react";

const formSchema = z.object({
  business_name: z.string().min(1),
  business_email: z.string().min(1),
  business_phone: z.string().min(1),
  full_address: z.string().min(1),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  contact_persons: z.array(
    z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      position: z.string(),
    })
  ),
  working_days: z.array(z.string()),
  brands: z.array(z.string()),
  active: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const daysList = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const EditMerchantPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.id as string;

  const { useGetMerchantDetailsQuery, useUpdateMerchantMutation } =
    merchantsApi;
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;

  const { data, isLoading } =
    useGetMerchantDetailsQuery({ id: merchantId });

  const { data: brandsData } = useGetAllCarBrandsQuery();

  const [updateMerchant, { isLoading: updating }] =
    useUpdateMerchantMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  // Reset form when data loads
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        contact_persons: data.contact_persons || [],
        working_days: data.working_days || [],
        brands: data.brands || [],
      });
    }
  }, [data, form]);

  if (isLoading) return <div>Loading...</div>;

  const carBrandsOptions =
    brandsData?.data?.map((brand: MasterCarBrand) => ({
      label: brand.display_name,
      value: brand.id,
      icon: CarFront,
    })) || [];

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMerchant({
        id: merchantId,
        ...values,
      }).unwrap();

      toast.success("Merchant updated successfully");
      router.push("/merchant");
    } catch (error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const err = error as { data?: string };
    toast.error(err.data ?? "Update failed");
  } else {
    toast.error("Update failed");
  }
}
  };

  return (
    <div className="container space-y-6">
      <h2 className="text-xl font-semibold">Edit Merchant</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-4">
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
          </div>

          {/* Contact Persons */}
          <div>
            <FormLabel>Contact Persons</FormLabel>

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 mt-3">
                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.name`}
                  render={({ field }) => (
                    <Input placeholder="Name" {...field} />
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.email`}
                  render={({ field }) => (
                    <Input placeholder="Email" {...field} />
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.phone`}
                  render={({ field }) => (
                    <PhoneInput {...field} defaultCountry="IN" />
                  )}
                />

                <div className="flex items-center">
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => remove(index)}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  email: "",
                  phone: "",
                  position: "",
                })
              }
              className="mt-3"
            >
              Add Contact Person
            </Button>
          </div>

          {/* Working Days + Brands */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="working_days"
              render={({ field }) => (
                <MultiSelect
                  options={daysList}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select working days"
                />
              )}
            />

            <FormField
              control={form.control}
              name="brands"
              render={({ field }) => (
                <MultiSelect
                  options={carBrandsOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select brands"
                />
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={updating}
            className="w-full"
          >
            {updating ? "Updating..." : "Update Merchant"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditMerchantPage;