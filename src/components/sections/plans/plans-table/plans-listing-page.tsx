import { useState } from "react";
import { useGetPlansQuery } from "@/toolkit/plans/plans.api";
import { CreatePlanModal } from "../views/CreatePlanModal";

export const PlansListingPage = () => {
  const { data = [], isLoading } = useGetPlansQuery();
  const [open, setOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1>Plans</h1>
        <button onClick={() => setOpen(true)}>+ Add New</button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
  {data.map((plan) => (
    <tr key={plan.id}>
      <td>{plan.name}</td>
      <td>{plan.amount}</td>
      <td>{plan.description}</td>
    </tr>
  ))}
</tbody>
      </table>

      <CreatePlanModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};