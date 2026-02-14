import { useRouter } from "next/router";
import { useGetMerchantDetailsQuery } from "@/toolkit/merchants/merchants.api";
import CreateMerchantPage from "@/components/sections/merchants/views/CreateMerchantPage";

export default function EditMerchantPage() {
  const router = useRouter();
  const { id } = router.query;

  const merchantId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetMerchantDetailsQuery(
    merchantId ? { id: merchantId } : undefined,
    { skip: !merchantId }
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No merchant found</div>;

  return <CreateMerchantPage />;
}