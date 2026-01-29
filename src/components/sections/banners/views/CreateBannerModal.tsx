import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/file-uploader";
import { Switch } from "@/components/ui/switch";
import { useSelector } from "react-redux";
import { commonState } from "@/toolkit/common/common.slice";
import { Banner } from "@/constants/data";
import { bannersApi } from "@/toolkit/banners/banners.api";
import { format } from "date-fns";

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  data?: Banner | null;
  isEdit?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = (isEdit = false) =>
  z.object({
    image_url: isEdit
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
    title: z.string().min(1, "Name is required."),
    sort_order: z.preprocess(
      (val) => Number(val) || 0,
      z.number().nonnegative("Sort Order must be 0 or greater")
    ),
    active: z.boolean(),
    redirect_url: z.string().url("Please enter a valid URL").optional(),
    start_date: z
      .string()
      .min(1, "Start date is required.")
      .optional()
      .or(z.literal("")),
    end_date: z
      .string()
      .min(1, "End date is required.")
      .optional()
      .or(z.literal("")),
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

const CreateBannerModal: React.FC<CreateBannerModalProps> = ({
  isOpen,
  onClose,
  refetch,
  data,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(commonState);

  const initialFiles = React.useMemo(() => {
    if (data?.image_url) {
      return [
        {
          name: data.image_url.split("/").pop() || "file",
          size: 0, // Unknown size
          preview: data.image_url, // Use the icon URL directly for preview
        },
      ];
    }
    return [];
  }, [data?.image_url]);

  // Format start_date and end_date to 'YYYY-MM-DD' if available
  const formattedStartDate = data?.start_date
    ? format(new Date(data.start_date), "yyyy-MM-dd")
    : "";
  const formattedEndDate = data?.end_date
    ? format(new Date(data.end_date), "yyyy-MM-dd")
    : "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(isEdit)),
    defaultValues: {
      title: data?.title || "",
      sort_order: data?.sort_order || 0,
      active: data?.active || true,
      image_url: initialFiles || "",
      redirect_url: data?.redirect_url || "",
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    },
  });

  // Reset form when modal is closed or when data changes
  useEffect(() => {
    if (isOpen) {
      // When modal opens, set the form values based on data (for edit mode)
      form.reset({
        title: data?.title || "",
        sort_order: data?.sort_order || 0,
        active: data?.active,
        image_url: initialFiles || "",
        redirect_url: data?.redirect_url || "",
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });
    }
  }, [isOpen, data, form, initialFiles, formattedStartDate, formattedEndDate]);

  // Create a wrapper for onClose that resets the form
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const { useCreateBannerMutation, useUpdateBannerMutation } = bannersApi;

  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_name", "banners");

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
      const file = formData.image_url?.[0];

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
        image_url: uploadedIconUrl || "",
        start_date: formData.start_date || "",
        end_date: formData.end_date || "",
      };

      if (isEdit && data?.id) {
        await updateBanner({ id: data.id, ...payload });
        toast.success("Banner updated successfully!");
      } else {
        await createBanner(payload);
        toast.success("Banner created successfully!");
      }

      refetch();
      handleClose(); // Use handleClose instead of onClose
    } catch (error) {
      toast.error("Failed to submit the form.");
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
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
      title={`${isEdit ? "Update" : "Create"} Banner`}
      description={
        isEdit
          ? "Update the details of the banner."
          : "Fill in the details to add a new banner."
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
            name="image_url"
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

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="redirect_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Redirect URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter redirect URL"
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Form Fields for start_date and end_date */}
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Select start date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Select end date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    min={0}
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

export default CreateBannerModal;
