import { NavItem } from "@/types";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_ext: string;
  phone: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
  created_at: Date;
  is_email_verified: boolean;
  is_mobile_verified: boolean;
  status: string;
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  availability_status: string;
  created_at: string;
  updated_at: string;
  merchant_id: string;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string | null;
  position: string;
}

export interface Merchant {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  latitude: number;
  longitude: number;
  full_address: string;
  city: string;
  state: string;
  contact_persons: ContactPerson[];
  brands: string[];
  working_days: string[];
  holidays: string[];
  image_url: string;
  user_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: "dashboard",
    isActive: false,
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: "Customer",
    url: "/users",
    icon: "user",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Merchant",
    url: "/merchant",
    icon: "merchant",
    isActive: false,
    items: [], // No child items
  },

  {
    title: "Technician",
    url: "/technicians",
    icon: "kanban",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: "warning",
    isActive: false,
    items: [], // No child items
  },
  // {
  //   title: "Invoice",
  //   url: "/invoices",
  //   icon: "billing",
  //   isActive: false,
  //   items: [], // No child items
  // },
  {
    title: "Master Car Brand",
    url: "/master-car-brands",
    icon: "brand",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Master Car Model",
    url: "/master-car-models",
    icon: "model",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Master Sunroof Problem",
    url: "/master-sunroof-problems",
    icon: "car",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Banners",
    url: "/banners",
    icon: "banner",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "FAQs",
    url: "/faqs",
    icon: "faq",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Testimonials",
    url: "/testimonials",
    icon: "review",
    isActive: false,
    items: [], // No child items
  },
  {
    title: "Plans",
    url: "/plans",
    icon: "review",
    isActive: false,
    items: [], // No child items
  },
];

export interface TicketHistory {
  ticketId: string;
  serviceType: string;
  requestDate: string;
}

export interface MasterCarBrand {
  id: string;
  name: string;
  display_name: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface MasterCarModel {
  id: string;
  name: string;
  display_name: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
  car_brand: MasterCarBrand;
  created_at: string;
  updated_at: string;
  car_brand_id: string;
}
export interface MasterSunroofProblem {
  id: string;
  name: string;
  display_name: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCar {
  id: string;
  car_brand_id: string;
  car_model_id: string;
  registration_year: string;
  sunroof_type: string;
  user_id: string;
  active: boolean;
  created_at: string;
  car_brand: MasterCarBrand;
  car_model: MasterCarModel;
}

export interface UserAddresses {
  id: string;
  name: string;
  active: boolean;
  phone: string;
  latitude: string;
  longitude: string;
  full_address: string;
  city: string;
  state: string;
  tag: string | null;
  user_id: string;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  mobile_image_url: string | null;
  video_url: string | null;
  redirect_url: string | null;
  applicable_for: string | null;
  start_date: string;
  end_date: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  title: string;
  content: string;
  category: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  review: string;
  rating: number;
  image: string;
  name: string;
  designation: string;
  company: string;
  category: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Plans {
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


export interface Ticket {
  id: string;
  description: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  sunroof_problem_id: string;
  location_id: string;
  car_id: string;
  technician_id: string | null;
  merchant_id: string;
  status: string;
  history: string | null;
  notes: string | null;
  user_id: string;
  attachments: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  location: UserAddresses;
  technician: Technician | null;
  sunroof_problem: MasterSunroofProblem;
  car: UserCar;
  user: UserTicket;
  merchant: UserTicket;
}

interface UserTicket {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  image_url: string;
}
