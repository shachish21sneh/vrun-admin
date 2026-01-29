import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/file-uploader";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { masterCarBrandsApi } from "@/toolkit/masterCarBrands/masterCarBrands.api";
import { masterCarModelApi } from "@/toolkit/masterCarModels/masterCarModels.api";
import { useSelector } from "react-redux";
import { commonState } from "@/toolkit/common/common.slice";
import { MasterCarModel } from "@/constants/data";

interface CreateMasterCarModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  data?: MasterCarModel | null;
  isEdit?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Define the validation schema using Zod
const formSchema = (isEdit = false) =>
  z.object({
    icon: isEdit
      ? z.any().optional()
      : z
          .any()
          .refine((files) => files?.length === 1, "An image file is required.")
          .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            "Max file size is 5MB."
          )
          .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
            message: "Accepted formats: .jpg, .jpeg, .png, .webp",
          }),
    name: z.string().min(1, { message: "Name is required" }),
    display_name: z.string().min(1, { message: "Display Name is required" }),
    sort_order: z.number().min(1, { message: "Sort Order is required" }),
    car_brand_id: z.string().min(1, { message: "Car Brand is required" }),
    active: z.boolean(),
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

const CreateMasterCarModelModal: React.FC<CreateMasterCarModelModalProps> = ({
  isOpen,
  onClose,
  refetch,
  data,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false); // State variable for loading
  const { token } = useSelector(commonState);

  const initialFiles = React.useMemo(() => {
    if (data?.icon) {
      return [
        {
          name: data.icon.split("/").pop() || "file",
          size: 0, // Unknown size
          preview: data.icon, // Use the icon URL directly for preview
        },
      ];
    }
    return [];
  }, [data?.icon]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(isEdit)),
    defaultValues: {
      name: data?.name || "",
      display_name: data?.display_name || "",
      sort_order: data?.sort_order || 0,
      car_brand_id: data?.car_brand?.id || "",
      active: data?.active || true,
      icon: initialFiles || "",
    },
  });

  // Reset form when modal is closed or when data changes
  useEffect(() => {
    if (isOpen) {
      // When modal opens, set the form values based on data (for edit mode)
      form.reset({
        name: data?.name || "",
        display_name: data?.display_name || "",
        sort_order: data?.sort_order || 0,
        car_brand_id: data?.car_brand_id || "",
        active: data?.active,
        icon: initialFiles || "",
      });
    }
  }, [isOpen, data, form, initialFiles]);

  // Create a wrapper for onClose that resets the form
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { useGetAllCarBrandsQuery } = masterCarBrandsApi;
  const { useCreateCarModelMutation, useUpdateCarModelMutation } =
    masterCarModelApi;
  const { data: masterCardBrand, isSuccess } = useGetAllCarBrandsQuery();
  const [handleCreateCarModel] = useCreateCarModelMutation();
  const [updateCarModel] = useUpdateCarModelMutation();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_name", "models");

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
    setLoading(true); // Set loading to true when the form is submitted
    try {
      const file = formData.icon?.[0];

      if (!file && !isEdit) {
        toast.error("File upload failed. Please select a valid image.");
        return;
      }

      let uploadedIconUrl = "";
      if (file) {
        // Check if it's a blob URL or an existing URL
        if (file.preview && file.preview.startsWith("blob:")) {
          // Blob URL indicates a new file, so upload it
          uploadedIconUrl = await handleFileUpload(file);
          if (!uploadedIconUrl) {
            toast.error("Failed to upload image. Please try again.");
            return;
          }
        } else if (file.preview) {
          // Existing URL can be reused
          uploadedIconUrl = file.preview;
        }
      }
      const payload = {
        ...formData,
        icon: uploadedIconUrl || "",
      };

      if (isEdit && data?.id) {
        await updateCarModel({ id: data.id, ...payload });
        toast.success("Car model updated successfully!");
      } else {
        await handleCreateCarModel(payload);
        toast.success("Car model created successfully!");
      }

      refetch();
      handleClose(); // Use handleClose instead of onClose
    } catch (error) {
      toast.error("Failed to create car brand");
      console.log(error);
    } finally {
      setLoading(false); // Reset loading to false after the API call
    }
  };

  const modalFooter = (
    <div className="flex justify-end gap-2">
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
        className="btn-primary"
        disabled={loading}
      >
        {loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
      </Button>
    </div>
  );

  return (
    <Modal
      title={`${isEdit ? "Update" : "Create"} Master Car Model`}
      description={
        isEdit
          ? "Update the details of the car model."
          : "Fill in the details to add a new car model."
      }
      isOpen={isOpen}
      onClose={handleClose} // Use handleClose instead of onClose
      footer={modalFooter}
      classname="max-w-lg"
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* File Upload */}
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
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
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
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

          {/* Display Name Field */}
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter display name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Car Brand Field */}
          <FormField
            control={form.control}
            name="car_brand_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Brand</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a car brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {isSuccess &&
                        masterCardBrand?.data.map(
                          (brand: { id: string; display_name: string }) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand?.display_name}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sort Order Field */}
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter sort order"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value !== undefined ? field.value : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </form>
      </Form>
    </Modal>
  );
};

export default CreateMasterCarModelModal;
