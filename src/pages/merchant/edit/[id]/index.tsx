import { useRouter } from "next/router";
import { useGetMerchantDetailsQuery } from "@/toolkit/merchants/merchants.api";
import { useUpdateMerchantMutation } from "@/toolkit/merchants/merchants.api";
import { toast } from "react-toastify";
import CreateMerchantPage from "@/components/sections/merchants/views/CreateMerchantPage";

export default function EditMerchantPage() {
  const router = useRouter();
  const { id } = router.query;

  const merchantId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetMerchantDetailsQuery(
    merchantId ? { id: merchantId } : undefined,
    { skip: !merchantId }
  );

  const [updateMerchant] = useUpdateMerchantMutation();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No merchant found</div>;

  const handleUpdate = async (
    values: { business_name: string; business_email: string; password?: string }
  ) => {
    try {
      await updateMerchant({
        id: merchantId as string,
        ...values,
      }).unwrap();

      toast.success("Merchant updated successfully");
      router.push("/merchant");
    } catch {
      toast.error("Update failed");
    }
  };

  return <CreateMerchantPage />;
}