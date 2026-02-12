export interface MockDocument {
  id: string;
  title: string;
  fileName: string;
  category: DocumentCategory;
  uploadDate: string;
  aiSummary: string;
  fileType: string;
}

export type DocumentCategory =
  | "Inspection Report"
  | "Appraisal"
  | "Closing Disclosure"
  | "Deed"
  | "Title Insurance Policy"
  | "Homeowners Insurance Policy"
  | "Home Warranty"
  | "Mortgage / Loan Documents"
  | "Appliance Manuals & Warranties"
  | "Permits & Renovation Records"
  | "Other";

export const DOCUMENT_CATEGORIES: { name: DocumentCategory; icon: string; emptyPrompt: string }[] = [
  { name: "Inspection Report", icon: "📋", emptyPrompt: "Tap to add your inspection report" },
  { name: "Appraisal", icon: "📊", emptyPrompt: "Tap to add your appraisal" },
  { name: "Closing Disclosure", icon: "📑", emptyPrompt: "Tap to add your closing disclosure" },
  { name: "Deed", icon: "📜", emptyPrompt: "Tap to add your deed" },
  { name: "Title Insurance Policy", icon: "🛡️", emptyPrompt: "Tap to add your title insurance policy" },
  { name: "Homeowners Insurance Policy", icon: "🏠", emptyPrompt: "Tap to add your insurance policy" },
  { name: "Home Warranty", icon: "🔧", emptyPrompt: "Tap to add your home warranty" },
  { name: "Mortgage / Loan Documents", icon: "💰", emptyPrompt: "Tap to add your mortgage documents" },
  { name: "Appliance Manuals & Warranties", icon: "📦", emptyPrompt: "Tap to add appliance manuals" },
  { name: "Permits & Renovation Records", icon: "📐", emptyPrompt: "Tap to add permits or renovation records" },
  { name: "Other", icon: "📁", emptyPrompt: "Tap to add other documents" },
];

export const mockDocuments: MockDocument[] = [
  {
    id: "doc-1",
    title: "Home Inspection Report",
    fileName: "Home_Inspection_Jan2025.pdf",
    category: "Inspection Report",
    uploadDate: "January 15, 2025",
    aiSummary: "Your inspection report covers a 3-bedroom, 2-bath colonial built in 1972 on 0.45 acres. Overall the home is in good condition. Key items flagged: the HVAC system is 15+ years old and should be evaluated before next winter, there's a minor grading issue on the south side that could cause water intrusion, and some weatherstripping around the front and back doors needs replacing. The roof was replaced approximately 8 years ago and is in good shape. Plumbing and electrical systems are functional with no major concerns noted.",
    fileType: "application/pdf",
  },
  {
    id: "doc-2",
    title: "Homeowners Insurance",
    fileName: "Insurance_Policy_StateABC.pdf",
    category: "Homeowners Insurance Policy",
    uploadDate: "January 20, 2025",
    aiSummary: "Your homeowners insurance policy with StateABC Insurance covers your property at 1234 Elm Street. Coverage includes $350,000 dwelling coverage, $175,000 personal property, and $300,000 liability. Your annual premium is $1,850 with a $1,000 deductible. Policy renews January 2026. Note: flood insurance is not included and would require a separate policy.",
    fileType: "application/pdf",
  },
  {
    id: "doc-3",
    title: "Carrier Furnace Manual",
    fileName: "Carrier_Furnace_Manual.pdf",
    category: "Appliance Manuals & Warranties",
    uploadDate: "February 1, 2025",
    aiSummary: "Owner's manual for your Carrier Performance 96 gas furnace (model 59TP6). Covers basic operation, thermostat settings, filter replacement schedule (every 1-3 months), and troubleshooting common issues. Warranty: 10-year parts limited warranty registered to the property.",
    fileType: "application/pdf",
  },
  {
    id: "doc-4",
    title: "GE Dishwasher Manual",
    fileName: "GE_Dishwasher_Manual.pdf",
    category: "Appliance Manuals & Warranties",
    uploadDate: "February 1, 2025",
    aiSummary: "Owner's manual for GE Profile dishwasher (model GDT665). Covers loading tips, cycle options, rinse aid, and maintenance. Recommends monthly cleaning cycle and checking the filter every 2 months. Warranty: 1-year full, registered.",
    fileType: "application/pdf",
  },
];

export const mockHomeSystems = [
  {
    group: "Heating & Cooling",
    systems: ["Forced Air Furnace (Gas)", "Central Air Conditioning", "Thermostat"],
  },
  {
    group: "Water & Plumbing",
    systems: ["Tank Water Heater", "Municipal Water", "Municipal Sewer"],
  },
  {
    group: "Exterior & Outdoor",
    systems: ["Outdoor Faucets", "Gutter System", "Paved Driveway"],
  },
  {
    group: "Safety & Technology",
    systems: ["Smoke Detectors", "Carbon Monoxide Detectors", "GFCI Outlets"],
  },
  {
    group: "Structural",
    systems: ["Basement (Unfinished)", "Attic"],
  },
];
