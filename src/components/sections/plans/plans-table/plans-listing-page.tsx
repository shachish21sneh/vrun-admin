import { useState } from "react";
import { CreatePlanModal } from "../views/CreatePlanModal";
import { useGetPlansQuery } from "@/toolkit/plans/plans.api";
import type { Plan } from "@/types";

export const PlansListingPage = () => {
  const { data, isLoading } = useGetPlansQuery();
  const [open, setOpen] = useState(false);

  const plans: Plan[] = data?.data ?? [];

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
            <th>Price</th>
            <th>Duration</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>{plan.price}</td>
              <td>{plan.duration}</td>
              <td>{plan.isActive ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <CreatePlanModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};