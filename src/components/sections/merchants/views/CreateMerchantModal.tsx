/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { MasterCarBrand } from "@/constants/data";

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
import Autocomplete from "react-google-autocomplete";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";

//Icons
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

//Redux
import { commonState } from "@/toolkit/common/common.slice";
import { merchantsApi } from "@/toolkit/merchants/merchants.api";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";

interface CreateMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  image_url: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files || files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (files) =>
        !files ||
        files?.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      {
        message: "Accepted formats: .jpg, .jpeg, .png, .webp",
      }
    ),
  business_name: z.string().min(1, "Business Name is required."),
  business_email: z.string().email("Invalid email address."),
  business_phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters."),
  active: z.boolean(),
  full_address: z.string().min(1, "Address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  latitude: z.number(),
  longitude: z.number(),
  contact_persons: z
    .array(
      z.object({
        name: z.string().min(1, "Contact person name is required."),
        email: z.string().email("Invalid email address."),
        phone: z.string().nullable(),
        position: z.string().min(1, "Position is required."),
      })
    )
    .optional(),
  working_days: z
    .array(z.string())
    .nonempty("At least one day must be selected."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  brands: z.array(z.string()).nonempty("At least one day must be selected."),
});

type FormValues = z.infer<typeof formSchema>;

const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({
  isOpen,
  onClose,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(commonState);

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

  const { useCreateMerchantsMutation } = merchantsApi;
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;

  const [createMerchant] = useCreateMerchantsMutation();
  const { data: masterCardBrand, isSuccess } = useGetAllCarBrandsQuery();

  const carBrandsData =
    (isSuccess &&
      masterCardBrand?.data.map((brand: MasterCarBrand) => ({
        label: brand?.display_name,
        value: brand?.id,
        icon: CarFront,
      }))) ||
    [];

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
          "X-Nhost-Bucket-Id": "public",
        },
      }
    );
    return response?.data?.Location;
  };

  const onSubmit = async (formData: FormValues) => {
    setLoading(true);
    try {
      let imageUrl = null;
      if (formData.image_url?.[0]) {
        imageUrl = await handleFileUpload(formData.image_url[0]);
      }
      await createMerchant({
        ...formData,
        image_url: imageUrl,
        contact_persons: formData.contact_persons || [],
      });
      toast.success("Merchant created successfully!");
      refetch();
      onClose();
    } catch (error) {
      toast.error("Failed to submit the form.");
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelected = (place: any) => {
    const address = place?.formatted_address;
    const city = place?.address_components.find((component: any) =>
      component.types.includes("locality")
    )?.long_name;
    const state = place?.address_components.find((component: any) =>
      component.types.includes("administrative_area_level_1")
    )?.short_name;
    const latitude = place?.geometry.location.lat();
    const longitude = place?.geometry.location.lng();

    form.setValue("full_address", address);
    form.setValue("city", city);
    form.setValue("state", state);
    form.setValue("latitude", latitude);
    form.setValue("longitude", longitude);
  };

  const modalFooter = (
    <div className="flex justify-end gap-2">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
        className="btn-primary"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );

  return (
    <Modal
      title="Create Merchant"
      description="Fill in the details to add a new Merchant."
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter}
      classname="max-w-5xl"
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* File Upload */}
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business logo</FormLabel>
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
          <div className="flex flex-row items-center w-full justify-between gap-2">
            <div className="w-full">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="business_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="business_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter business phone number"
                        {...field}
                        defaultCountry="IN"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Autocomplete for Address */}
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="full_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Autocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
                      defaultValue={field.value}
                      placeholder="Search location"
                      onPlaceSelected={handlePlaceSelected}
                      className="w-full border border-input rounded-md h-9 px-3"
                      options={{
                        types: ["establishment", "geocode"],
                        componentRestrictions: { country: "in" },
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Contact Persons</FormLabel>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-row items-center w-full justify-between gap-1"
              >
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name={`contact_persons.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name={`contact_persons.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name={`contact_persons.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder="Enter phone number"
                            {...field}
                            defaultCountry="IN"
                            value={field.value ?? undefined}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name={`contact_persons.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter position" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-center mt-8">
                  <Trash2 size="20" onClick={() => remove(index)} />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                append({ name: "", email: "", phone: "", position: "" })
              }
              className="mt-2"
            >
              Add Contact Person
            </Button>
          </div>
          <div className="w-full flex flex-row items-center justify-between gap-2">
            {/* Select Days */}
            <div className="w-full">
              <FormField
                control={form.control}
                name="working_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Days</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={daysList}
                        onValueChange={field.onChange}
                        placeholder="Select working days"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Car Brand Field */}
            <div className="w-full">
              <FormField
                control={form.control}
                name="brands"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Car Brands</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={carBrandsData}
                        onValueChange={field.onChange}
                        placeholder="Select car brands"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
};

export default CreateMerchantModal;
