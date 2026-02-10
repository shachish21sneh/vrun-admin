export interface Plan {
  id: string;
  plan_id?: string;
  name: string;
  description: string;
  amount: number;      // ✅ THIS WAS MISSING
  duration?: number;
  isActive?: boolean;
  isPopular?: boolean;
  createdAt?: string;
}