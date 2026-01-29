import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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

import { Faq } from "@/constants/data";
import { faqsApi } from "@/toolkit/faqs/faqs.api";
import { Textarea } from "@/components/ui/textarea";

interface CreateFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  data?: Faq | null;
  isEdit?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, "Name is required."),
  content: z.string().min(1, "Content is required."),
  sort_order: z.preprocess(
    (val) => Number(val) || 0,
    z.number().nonnegative("Sort Order must be 0 or greater")
  ),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateFaqModal: React.FC<CreateFaqModalProps> = ({
  isOpen,
  onClose,
  refetch,
  data,
  isEdit = false,
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.title || "",
      content: data?.content || "",
      sort_order: data?.sort_order || 0,
      active: data?.active || true,
    },
  });

  const { useCreateFaqMutation, useUpdateFaqMutation } = faqsApi;

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();

  const onSubmit = async (formData: FormValues) => {
    setLoading(true);
    try {
      if (isEdit && data?.id) {
        await updateFaq({ id: data.id, ...formData });
        toast.success("FAQ updated successfully!");
      } else {
        await createFaq(formData);
        toast.success("FAQ created successfully!");
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
      title={`${isEdit ? "Update" : "Create"} FAQ`}
      description={
        isEdit
          ? "Update the details of the Faq."
          : "Fill in the details to add a new Faq."
      }
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter} // Footer with Cancel and Submit buttons
      classname="max-w-lg"
    >
      <Form {...form}>
        <form className="space-y-4">
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter content" {...field} />
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

export default CreateFaqModal;
