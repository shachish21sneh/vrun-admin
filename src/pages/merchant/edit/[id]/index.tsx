import { useRouter } from "next/router";
import { useGetMerchantByIdQuery } from "@/toolkit/merchants/merchants.api";
import CreateMerchantPage from "@/components/sections/merchants/views/CreateMerchantPage";

export default function EditMerchantPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useGetMerchantByIdQuery(id as string, {
    skip: !id,
  });

  if (!id) return null;

  if (isLoading) return <p>Loading...</p>;

  if (!data) return <p>Merchant not found</p>;

  return (
    <CreateMerchantPage
      defaultValues={data}
      isEdit
      merchantId={id as string}
    />
  );
}