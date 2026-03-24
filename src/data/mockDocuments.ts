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
  {
    id: "doc-5",
    title: "Home Appraisal Report",
    fileName: "Appraisal_Report_Jan2025.pdf",
    category: "Appraisal",
    uploadDate: "January 10, 2025",
    aiSummary: "Appraisal conducted by Greenfield Valuation Group. Appraised value: $385,000. Comparable sales ranged from $365,000–$410,000 within a 1-mile radius. The report notes the home's condition as 'average to good' with positive remarks on the updated kitchen (2019) and newer roof. Adjustments were made for the smaller lot size relative to comps. No major issues flagged that would affect lending.",
    fileType: "application/pdf",
  },
  {
    id: "doc-6",
    title: "Closing Disclosure",
    fileName: "Closing_Disclosure_Jan2025.pdf",
    category: "Closing Disclosure",
    uploadDate: "January 12, 2025",
    aiSummary: "Final closing disclosure for your purchase at 1234 Elm Street. Purchase price: $375,000. Loan amount: $300,000 (30-year fixed at 6.75%). Total closing costs: $12,340 including $4,200 in lender fees, $3,800 in title/escrow charges, and $2,100 in prepaid items (taxes, insurance). Cash to close: $87,340. Property taxes estimated at $4,800/year. First mortgage payment due March 1, 2025.",
    fileType: "application/pdf",
  },
  {
    id: "doc-7",
    title: "Warranty Deed",
    fileName: "Warranty_Deed_1234Elm.pdf",
    category: "Deed",
    uploadDate: "January 12, 2025",
    aiSummary: "General warranty deed transferring ownership of 1234 Elm Street from the previous owners (James & Linda Morrison) to you. Recorded with the county recorder's office on January 12, 2025. Legal description references Lot 14, Block 3 of Maplewood Estates subdivision. No liens or encumbrances noted at time of recording.",
    fileType: "application/pdf",
  },
  {
    id: "doc-8",
    title: "Title Insurance Policy",
    fileName: "Title_Insurance_Policy.pdf",
    category: "Title Insurance Policy",
    uploadDate: "January 12, 2025",
    aiSummary: "Owner's title insurance policy issued by First Heritage Title Company. Coverage amount: $375,000. Protects against undisclosed liens, boundary disputes, forgery, and recording errors. Policy is valid for as long as you own the property. Standard exceptions apply for easements and rights of way visible on the property survey. No title defects were found during the title search.",
    fileType: "application/pdf",
  },
  {
    id: "doc-9",
    title: "Home Warranty Plan",
    fileName: "HomeWarranty_FirstAmerican.pdf",
    category: "Home Warranty",
    uploadDate: "January 20, 2025",
    aiSummary: "One-year home warranty plan through First American Home Warranty, provided by the seller at closing. Coverage period: January 2025–January 2026. Covers HVAC, plumbing, electrical, water heater, and built-in appliances. Service call fee: $75. Does not cover pre-existing conditions, cosmetic issues, or outdoor systems. Renewable annually at approximately $550/year.",
    fileType: "application/pdf",
  },
  {
    id: "doc-10",
    title: "Mortgage Note & Loan Agreement",
    fileName: "Mortgage_Loan_Docs.pdf",
    category: "Mortgage / Loan Documents",
    uploadDate: "January 12, 2025",
    aiSummary: "30-year fixed-rate mortgage with National Home Lending. Loan amount: $300,000 at 6.75% APR. Monthly principal & interest payment: $1,946. Escrow account covers property taxes ($400/mo) and insurance ($154/mo), bringing total monthly payment to approximately $2,500. No prepayment penalty. First payment due March 1, 2025. Loan servicing transferred to MortgageCo effective February 2025.",
    fileType: "application/pdf",
  },
  {
    id: "doc-11",
    title: "Bathroom Remodel Permit",
    fileName: "Permit_BathroomRemodel_2019.pdf",
    category: "Permits & Renovation Records",
    uploadDate: "February 5, 2025",
    aiSummary: "Building permit issued by the city for a second-floor bathroom remodel completed in 2019 by the previous owner. Scope included new tile, vanity, plumbing fixture relocation, and exhaust fan installation. Final inspection passed and signed off on August 14, 2019. Contractor: Lakeside Builders LLC. Permit number: BP-2019-04821.",
    fileType: "application/pdf",
  },
  {
    id: "doc-12",
    title: "Kitchen Renovation Records",
    fileName: "Kitchen_Renovation_2019.pdf",
    category: "Permits & Renovation Records",
    uploadDate: "February 5, 2025",
    aiSummary: "Documentation for the kitchen renovation completed in 2019. Included new cabinetry, quartz countertops, subway tile backsplash, and updated electrical for under-cabinet lighting. New appliance package: GE Profile refrigerator, range, dishwasher, and microwave. Total project cost approximately $28,000. All work permitted and inspected.",
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
