import React, { useState } from "react";
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
import { testimonialsApi } from "@/toolkit/testimonials/testimonials.api";
import { useSelector } from "react-redux";
import { commonState } from "@/toolkit/common/common.slice";
import { Testimonial } from "@/constants/data";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/ui/star-rating";

interface CreateTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  data?: Testimonial | null;
  isEdit?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  image: z
    .any()
    .optional()
    .nullable()
    .or(
      z
        .array(z.any())
        .refine(
          (files) => !files?.length || files?.[0]?.size <= MAX_FILE_SIZE,
          "Max file size is 5MB."
        )
        .refine(
          (files) =>
            !files?.length || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
          "Accepted formats: .jpg, .jpeg, .png, .webp"
        )
    ),
  name: z.string().min(1, "Name is required."),
  designation: z.string().min(1, "Designation is required."),
  company: z.string().min(1, "Company Name is required."),
  review: z.string().min(1, "Review is required."),
  rating: z.preprocess(
    (val) => Number(val) || 0,
    z.number().nonnegative("Sort Order must be 0 or greater")
  ),
  sort_order: z.preprocess(
    (val) => Number(val) || 0,
    z.number().nonnegative("Sort Order must be 0 or greater")
  ),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTestimonialModal: React.FC<CreateTestimonialModalProps> = ({
  isOpen,
  onClose,
  refetch,
  data,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(commonState);

  const initialFiles = React.useMemo(() => {
    if (data?.image) {
      return [
        {
          name: data.image.split("/").pop() || "file",
          size: 0, // Unknown size
          preview: data.image, // Use the icon URL directly for preview
        },
      ];
    }
    return [];
  }, [data?.image]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      designation: data?.designation || "",
      company: data?.company || "",
      review: data?.review || "",
      rating: data?.rating || 0,
      sort_order: data?.sort_order || 0,
      active: data?.active || true,
      image: initialFiles || "",
    },
  });

  const { useCreateTestimonialsMutation, useUpdateTestimonialsMutation } =
    testimonialsApi;

  const [createTestimonial] = useCreateTestimonialsMutation();
  const [updateTestimonial] = useUpdateTestimonialsMutation();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_name", "testimonials");

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
      const file = formData.image?.[0];
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
        image: uploadedIconUrl,
      };

      if (isEdit && data?.id) {
        await updateTestimonial({ id: data.id, ...payload });
        toast.success("Testimonial updated successfully!");
      } else {
        await createTestimonial(payload);
        toast.success("Testimonial created successfully!");
      }

      refetch();
      onClose();
    } catch (error) {
      toast.error("Failed to submit the form.");
      console.error("Submission Error:", error);
    } finally {
      setLoading(false);
    }
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
        {loading ? "Submitting..." : isEdit ? "Update" : "Submit"}
      </Button>
    </div>
  );

  return (
    <Modal
      title={`${isEdit ? "Update" : "Create"} Testimonial`}
      description={
        isEdit
          ? "Update the details of the testimonial."
          : "Fill in the details to add a new testimonial."
      }
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter} // Footer with Cancel and Submit buttons
      classname="max-w-lg"
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* File Upload */}
          <FormField
            control={form.control}
            name="image"
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

          {/* Other Form Fields */}
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

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter review" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <StarRating
                    rating={field.value}
                    onRatingChange={(value) => field.onChange(value)}
                    size={24}
                    className="py-2"
                  />
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

export default CreateTestimonialModal;
