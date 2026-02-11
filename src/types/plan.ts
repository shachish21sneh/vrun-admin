export interface Plan {
   id: string;
  plan_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  features: string;
  trial_period_days: string | null;
  status: string;
  razorpay_plan_id: string;
  metadata: string  | null;
  sunroof_type: string;
  created_at: string;
  updated_at: string;
}