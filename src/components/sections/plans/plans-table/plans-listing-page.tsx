import { CreatePlanModal } from "../views/CreatePlanModal";
import { useGetPlansQuery } from "@/toolkit/plans/plans.api";

export const PlansListingPage = () => {
  const { data, isLoading } = useGetPlansQuery();
  const plans = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1>Plans</h1>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan: any) => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>{plan.price}</td>
              <td>{plan.duration}</td>
              <td>{plan.isActive ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <CreatePlanModal />
    </>
  );
};