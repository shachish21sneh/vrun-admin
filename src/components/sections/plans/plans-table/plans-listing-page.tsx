import { useEffect, useState } from "react";
import { plansApi } from "@/toolkit/plans/plans.api";
import { CreatePlanModal } from "../views";
import { Plan } from "@/types";

export const PlansListingPage = () => {
  const [data, setData] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    plansApi.list().then((res) => {
      setData(res.data.data);
    });
  }, []);

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1>Plans</h1>
        <button onClick={() => setOpen(true)}>+ Add New</button>
      </div>

      {/* SIMPLE TABLE — SAME PATTERN AS FAQ */}
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
          {data.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>{plan.price}</td>
              <td>{plan.duration}</td>
              <td>{plan.isActive ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <CreatePlanModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};