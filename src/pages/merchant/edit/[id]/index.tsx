import { useRouter } from "next/router";
import { useGetMerchantDetailsQuery } from "@/toolkit/merchants/merchants.api";
import EditMerchantPage from "@/components/sections/merchants/views/EditMerchantPage";

export default function EditMerchantRoute() {
  const router = useRouter();
  const { id } = router.query;

  const merchantId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetMerchantDetailsQuery(
    merchantId ? { id: merchantId } : ({} as any),
    { skip: !merchantId }
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Merchant not found</div>;

  return (
    <EditMerchantPage
      merchantData={data}
      merchantId={merchantId as string}
    />
  );
}