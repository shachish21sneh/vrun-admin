import { useRouter } from "next/router";
import { useGetMerchantDetailsQuery } from "@/toolkit/merchants/merchants.api";
import CreateMerchantPage from "./CreateMerchantPage";

const EditMerchantPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const merchantId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading } = useGetMerchantDetailsQuery(
    merchantId ? { id: merchantId } : undefined,
    { skip: !merchantId }
  );

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Merchant not found</div>;

  return (
    <CreateMerchantPage
      defaultValues={data}
      isEdit
      merchantId={merchantId as string}
    />
  );
};

export default EditMerchantPage;