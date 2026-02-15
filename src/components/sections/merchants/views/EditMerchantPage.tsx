"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

import {
  useGetMerchantDetailsQuery,
  useUpdateMerchantMutation,
} from "@/toolkit/merchants/merchants.api";

import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import { MasterCarBrand, Merchant } from "@/constants/data";

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
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  contact_persons: ContactPersonForm[];
  working_days: string[];
  brands: string[];
  active?: boolean;
};

const EditMerchantPage = () => {
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.id as string;

  const { data } = useGetMerchantDetailsQuery(
    { id: merchantId },
    { skip: !merchantId }
  );

  const [updateMerchant] = useUpdateMerchantMutation();
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
  const { data: brandData } = useGetAllCarBrandsQuery();

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

//console.log("FORM working_days:", form.watch("working_days"));
//console.log("FORM brands:", form.watch("brands"));

  // Days options
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

  // Brand options
  const brandOptions = useMemo(
    () =>
      brandData?.data?.map((brand: MasterCarBrand) => ({
        label: brand.display_name,
        value: brand.id,
      })) || [],
    [brandData]
  );

  // ✅ SAFE PREFILL (IMPORTANT FIX)
  useEffect(() => {
  if (!data) return;

  // 🔥 Force correct structure
  const merchant = (data as any)?.data ?? data;

setTimeout(() => {
  console.log("AFTER RESET working_days:", form.getValues("working_days"));
  console.log("AFTER RESET brands:", form.getValues("brands"));
}, 100);

  if (!merchant) return;

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

}, [data]);

  const onSubmit = async (values: FormValues) => {
    try {
      const formattedContactPersons = values.contact_persons.map((cp) => ({
        ...cp,
        phone: cp.phone ?? null,
      }));

      await updateMerchant({
        id: merchantId,
        ...values,
        contact_persons: formattedContactPersons,
      }).unwrap();

      toast.success("Merchant updated successfully");
      router.push("/merchant");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update merchant");
    }
  };

  return (
    <div className="container max-w-5xl py-10">
      <h2 className="text-2xl font-semibold mb-6">Edit Merchant</h2>

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
                  <PhoneInput
                    {...field}
                    defaultCountry="IN"
                    value={field.value ?? undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

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
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select working days"
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
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select car brands"
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
                    <PhoneInput
                      {...field}
                      defaultCountry="IN"
                      value={field.value ?? undefined}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name={`contact_persons.${index}.position`}
                  render={({ field }) => (
                    <Input placeholder="Position" {...field} />
                  )}
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