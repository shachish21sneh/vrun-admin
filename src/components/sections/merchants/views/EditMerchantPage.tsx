/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { FileUploader } from "@/components/file-uploader";

import { commonState } from "@/toolkit/common/common.slice";
import { useGetMerchantDetailsQuery, useUpdateMerchantMutation } from "@/toolkit/merchants/merchants.api";
import { useGetAllCarBrandsQuery } from "@/toolkit/masterCarBrands/masterCarBrands.api";

import { MasterCarBrand } from "@/constants/data";
import { CarFront, Trash2 } from "lucide-react";

const formSchema = z.object({
  business_name: z.string().min(1),
  business_email: z.string().email(),
  business_phone: z.string().min(10),
  full_address: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  active: z.boolean(),
  brands: z.array(z.string()),
  working_days: z.array(z.string()),
  contact_persons: z.array(
    z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      position: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const EditMerchantPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useSelector(commonState);

  const { data, isLoading } = useGetMerchantDetailsQuery(
    id ? { id: id as string } : undefined,
    { skip: !id }
  );

  const { data: brandData } = useGetAllCarBrandsQuery();
  const [updateMerchant] = useUpdateMerchantMutation();

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
      active: true,
      brands: [],
      working_days: [],
      contact_persons: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "contact_persons",
  });

  // ------------------------
  // PREFILL DATA
  // ------------------------
  useEffect(() => {
    if (data) {
      form.reset({
        business_name: data.business_name,
        business_email: data.business_email,
        business_phone: data.business_phone,
        full_address: data.full_address,
        city: data.city,
        state: data.state,
        latitude: data.latitude,
        longitude: data.longitude,
        active: data.active,
        brands: data.brands || [],
        working_days: data.working_days || [],
        contact_persons: data.contact_persons || [],
      });
    }
  }, [data]);

  const carBrandsOptions =
    brandData?.data?.map((brand: MasterCarBrand) => ({
      label: brand.display_name,
      value: brand.id,
      icon: CarFront,
    })) || [];

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: any = { ...values };

      // remove password if empty
      if (!values.password) {
        delete payload.password;
      }

      await updateMerchant({
        id: id as string,
        ...payload,
      }).unwrap();

      toast.success("Merchant updated successfully");
      router.push("/merchant");
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* BUSINESS INFO */}
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
                  <FormLabel>Business Email</FormLabel>
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
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} defaultCountry="IN" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* CONTACT PERSONS */}
          <div>
            <FormLabel>Contact Persons</FormLabel>

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-4 gap-3 mb-3">
                <Input {...form.register(`contact_persons.${index}.name`)} placeholder="Name" />
                <Input {...form.register(`contact_persons.${index}.email`)} placeholder="Email" />
                <Input {...form.register(`contact_persons.${index}.phone`)} placeholder="Phone" />
                <Input {...form.register(`contact_persons.${index}.position`)} placeholder="Position" />

                <Trash2 onClick={() => remove(index)} />
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({ name: "", email: "", phone: "", position: "" })
              }
            >
              Add Contact Person
            </Button>
          </div>

          {/* MULTI SELECTS */}
          <div className="grid grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="working_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Days</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={[
                        { label: "Monday", value: "Monday" },
                        { label: "Tuesday", value: "Tuesday" },
                        { label: "Wednesday", value: "Wednesday" },
                        { label: "Thursday", value: "Thursday" },
                        { label: "Friday", value: "Friday" },
                        { label: "Saturday", value: "Saturday" },
                        { label: "Sunday", value: "Sunday" },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brands"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Car Brands</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={carBrandsOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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