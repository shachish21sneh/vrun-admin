"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/toolkit/plans/plans.api";

import type { Plan } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: Plan | null;
}

export const CreatePlanModal = ({
  open,
  onClose,
  plan,
}: Props) => {
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    amount: "",
    currency: "INR",
    features: "",
    status: "active",
    sunroof_type: "",
    trial_period_days: "",
  });

  useEffect(() => {
  if (plan) {
    setForm({
      name: plan.name ?? "",
      description: plan.description ?? "",
      amount: plan.amount ? String(plan.amount) : "",
      currency: plan.currency ?? "INR",
      features: Array.isArray(plan.features)
        ? plan.features.join(", ")
        : "",
      status: plan.status ?? "active",
      sunroof_type: plan.sunroof_type ?? "",
      trial_period_days:
        plan.trial_period_days ?? "",
    });
  } else {
    setForm({
      name: "",
      description: "",
      amount: "",
      currency: "INR",
      features: "",
      status: "active",
      sunroof_type: "",
      trial_period_days: "",
    });
  }
}, [plan]);

  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const featuresArray = form.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      ...form,
      amount: Number(form.amount),
      features: featuresArray,
    };

    if (plan) {
      await updatePlan({
        id: plan.plan_id,
        data: payload,
      });
    } else {
      await createPlan(payload);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {plan ? "Update Plan" : "Create Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Plan Name"
            value={form.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
          />

          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              handleChange("description", e.target.value)
            }
          />

          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              handleChange("amount", e.target.value)
            }
          />

          <Input
            placeholder="Features (comma separated)"
            value={form.features}
            onChange={(e) =>
              handleChange("features", e.target.value)
            }
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {plan ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};