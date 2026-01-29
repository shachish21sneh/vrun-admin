import React, { useState } from "react";

import { Technician, Merchant } from "@/constants/data";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { techniciansApi } from "@/toolkit/technicians/technicians.api";
import { merchantsApi } from "@/toolkit/merchants/merchants.api";

interface CreateTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  data?: Technician | null;
  isEdit?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 characters."),
  merchant_id: z.string().min(1, "Merchant ID is required."),
  active: z.boolean(),
  availability_status: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTechnicianModal: React.FC<CreateTechnicianModalProps> = ({
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
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      merchant_id: data?.merchant_id || "",
      active: data?.active || true,
      availability_status: data?.availability_status || "",
    },
  });

  const { useCreateTechniciansMutation, useUpdateTechniciansMutation } =
    techniciansApi;
  const { useGetAllMerchantsQuery } = merchantsApi;
  const { data: merchantDataList, isSuccess } = useGetAllMerchantsQuery();
  const [createTechnician] = useCreateTechniciansMutation();
  const [updateTechnician] = useUpdateTechniciansMutation();

  const onSubmit = async (formData: FormValues) => {
    setLoading(true);

    try {
      if (isEdit && data?.id) {
        await updateTechnician({
          id: data.id,
          ...formData,
          active: formData.active,
          availability_status: formData.availability_status,
        });
        toast.success("Technician details updated successfully!");
      } else {
        await createTechnician({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          merchant_id: formData.merchant_id,
        });
        toast.success("Technician created successfully!");
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
      title={`${isEdit ? "Update" : "Create"} Technician`}
      description={
        isEdit
          ? "Update the details of the Technician."
          : "Fill in the details to add a new Technician."
      }
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter}
      classname="max-w-lg"
    >
      <Form {...form}>
        <form className="space-y-4">
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
            name="email"
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
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Merchant Field */}
          <FormField
            control={form.control}
            name="merchant_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a merchant" />
                    </SelectTrigger>
                    <SelectContent>
                      {isSuccess &&
                        merchantDataList?.data.map((merchant: Merchant) => (
                          <SelectItem
                            key={merchant?.user_id}
                            value={merchant?.user_id}
                          >
                            {merchant?.business_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEdit && (
            <>
              <FormField
                control={form.control}
                name="availability_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="not_available">
                            Not available
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
            </>
          )}
        </form>
      </Form>
    </Modal>
  );
};

export default CreateTechnicianModal;
