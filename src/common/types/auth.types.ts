export interface UserType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  phone_ext: string;
  image_url: string | null;
  role: string;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  razorpay_customer_id: string | null;
}

export interface TokenType {
  token: string;
  expires_at: string;
  refresh_token: string;
}
