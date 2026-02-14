/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { MasterCarBrand } from "@/constants/data";
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
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/file-uploader";
import Autocomplete from "react-google-autocomplete";
import { MultiSelect } from "@/components/ui/multi-select";
import { PhoneInput } from "@/components/ui/phone-input";
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

interface Props {
  defaultValues?: any;
  isEdit?: boolean;
  onSubmitOverride?: (data: any) => void;
}

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
  working_days: z.array(z.string()).nonempty(),
  password: z.string().optional(),
  brands: z.array(z.string()).nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateMerchantPage: React.FC<Props> = ({
  defaultValues,
  isEdit = false,
  onSubmitOverride,
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
      form.reset({
        ...defaultValues,
        password: "",
      });
    }
  }, [defaultValues, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contact_persons",
  });

  const [createMerchant] = useCreateMerchantsMutation();
  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
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
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder_name", "merchant");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}media/upload`,
      formDataUpload,
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

    // 🔥 Edit mode override
    if (onSubmitOverride) {
      return onSubmitOverride(formData);
    }

    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (formData.image_url?.[0]) {
        imageUrl = await handleFileUpload(formData.image_url[0]);
      }

      await createMerchant({
        ...formData,
        image_url: imageUrl ?? "",
        contact_persons: formData.contact_persons || [],
      }).unwrap();

      toast.success("Merchant created successfully!");
      router.push("/merchant");

    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        error?.data?.error ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelected = (place: any) => {
    form.setValue("full_address", place?.formatted_address);
    form.setValue("city",
      place?.address_components.find((c: any) =>
        c.types.includes("locality")
      )?.long_name
    );
    form.setValue("state",
      place?.address_components.find((c: any) =>
        c.types.includes("administrative_area_level_1")
      )?.short_name
    );
    form.setValue("latitude", place?.geometry.location.lat());
    form.setValue("longitude", place?.geometry.location.lng());
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

          {/* 🔥 KEEP YOUR FULL FORM UI BELOW EXACTLY SAME */}

        </form>
      </Form>
    </div>
  );
};

export default CreateMerchantPage;