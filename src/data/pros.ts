import { Droplets, Flame, Zap, Wrench, TreePine, Home, Bug, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Pro {
  id: number;
  business: string;
  contact: string;
  category: Category;
  phone: string;
  email: string;
  notes?: string;
  referral: { type: "agent"; name: string; blurb: string } | { type: "user" };
}

export type Category =
  | "Plumbing"
  | "HVAC"
  | "Electrical"
  | "Handyman"
  | "Landscaping"
  | "Roofing"
  | "Pest Control"
  | "Appliance Repair";

export const categories: Category[] = [
  "Plumbing", "HVAC", "Electrical", "Handyman",
  "Landscaping", "Roofing", "Pest Control", "Appliance Repair",
];

export const categoryIcons: Record<Category, LucideIcon> = {
  Plumbing: Droplets,
  HVAC: Flame,
  Electrical: Zap,
  Handyman: Wrench,
  Landscaping: TreePine,
  Roofing: Home,
  "Pest Control": Bug,
  "Appliance Repair": Settings,
};

export const mockPros: Pro[] = [
  { id: 1, business: "Dave's Plumbing & Drain", contact: "Dave Kowalski", category: "Plumbing", phone: "(215) 555-0142", email: "dave@davesplumbing.com", notes: "Does excellent work. Very responsive and comes prepared.", referral: { type: "agent", name: "Mira Downs", blurb: "Reliable and fast — he's my go-to for any drain or pipe issue." } },
  { id: 2, business: "Bucks County Plumbing", contact: "Tom Reilly", category: "Plumbing", phone: "(215) 555-0283", email: "info@bucksplumbing.com", notes: "Good emergency response time. Recommended by neighbors.", referral: { type: "user" } },
  { id: 3, business: "Comfort First Heating & Cooling", contact: "Maria Santos", category: "HVAC", phone: "(215) 555-0367", email: "service@comfortfirsthvac.com", notes: "Offers maintenance packages. Very professional team.", referral: { type: "agent", name: "Mira Downs", blurb: "Great pricing and they always show up on time. Highly recommend for seasonal tune-ups." } },
  { id: 4, business: "Bright Side Electric", contact: "James Park", category: "Electrical", phone: "(215) 555-0198", email: "james@brightsideelectric.com", notes: "Licensed and insured. Provides detailed estimates.", referral: { type: "agent", name: "Mira Downs", blurb: "Licensed, insured, and incredibly thorough. Perfect for panel upgrades or new wiring." } },
  { id: 5, business: "PowerPro Electrical Services", contact: "Mike Chen", category: "Electrical", phone: "(215) 555-0451", email: "mike@powerproelectric.com", notes: "Quick turnaround on small jobs. Very reliable.", referral: { type: "user" } },
  { id: 6, business: "Yardley Home Services", contact: "Rob Brennan", category: "Handyman", phone: "(215) 555-0529", email: "rob@yardleyhomeservices.com", notes: "Multi-skilled. Can handle general repairs and small projects.", referral: { type: "agent", name: "Mira Downs", blurb: "Can handle almost anything around the house. Fair prices and solid work." } },
  { id: 7, business: "Green Valley Landscaping", contact: "Carlos Rivera", category: "Landscaping", phone: "(215) 555-0614", email: "carlos@greenvalleylandscape.com", notes: "Seasonal maintenance available. Good with design consultation.", referral: { type: "user" } },
];
