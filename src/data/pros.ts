import { Droplets, Flame, Zap, Wrench, TreePine, Home, Bug, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Pro {
  id: number;
  business: string;
  contact: string;
  category: Category;
  phone: string;
  email: string;
  referral: { type: "agent"; name: string } | { type: "user" };
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
  { id: 1, business: "Dave's Plumbing & Drain", contact: "Dave Kowalski", category: "Plumbing", phone: "(215) 555-0142", email: "dave@davesplumbing.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 2, business: "Bucks County Plumbing", contact: "Tom Reilly", category: "Plumbing", phone: "(215) 555-0283", email: "info@bucksplumbing.com", referral: { type: "user" } },
  { id: 3, business: "Comfort First Heating & Cooling", contact: "Maria Santos", category: "HVAC", phone: "(215) 555-0367", email: "service@comfortfirsthvac.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 4, business: "Bright Side Electric", contact: "James Park", category: "Electrical", phone: "(215) 555-0198", email: "james@brightsideelectric.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 5, business: "PowerPro Electrical Services", contact: "Mike Chen", category: "Electrical", phone: "(215) 555-0451", email: "mike@powerproelectric.com", referral: { type: "user" } },
  { id: 6, business: "Yardley Home Services", contact: "Rob Brennan", category: "Handyman", phone: "(215) 555-0529", email: "rob@yardleyhomeservices.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 7, business: "Green Valley Landscaping", contact: "Carlos Rivera", category: "Landscaping", phone: "(215) 555-0614", email: "carlos@greenvalleylandscape.com", referral: { type: "user" } },
];
