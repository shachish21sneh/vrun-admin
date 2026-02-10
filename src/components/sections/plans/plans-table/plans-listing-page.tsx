import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { plansApi } from "@/toolkit/plans/plans.api";
import { CreatePlanModal } from "../views";

export const PlansListingPage = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    plansApi.list().then(res => {
      setData(res.data.data);
    });
  }, []);

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1>Plans</h1>
        <button onClick={() => setOpen(true)}>+ Add New</button>
      </div>

      <DataTable columns={columns} data={data} />

      <CreatePlanModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};