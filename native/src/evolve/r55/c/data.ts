// Deterministic dummy data for the Intake Batches drill-down screen.
// No Math.random / Date.now / bare `new Date()` — fixed literal values only.

export type BatchStageKey = "received" | "inspected" | "graded" | "listed" | "paid";

export interface BatchStageEntry {
  key: BatchStageKey;
  label: string;
  /** Fixed literal date string, or null when the stage has not happened yet. */
  date: string | null;
  done: boolean;
}

export interface BatchItem {
  id: string;
  title: string;
  category: string;
  conditionGrade: string;
  status: string;
}

export interface IntakeBatch {
  id: string;
  location: string;
  submittedDate: string;
  currentStage: BatchStageKey;
  stages: BatchStageEntry[];
  items: BatchItem[];
}

export const intakeBatches: IntakeBatch[] = [
  {
    id: "BATCH-2041",
    location: "Repick Drop Point — Riverside",
    submittedDate: "Feb 14, 2026",
    currentStage: "paid",
    stages: [
      { key: "received", label: "Received at drop point", date: "Feb 14, 2026", done: true },
      { key: "inspected", label: "Inspected by staff", date: "Feb 18, 2026", done: true },
      { key: "graded", label: "Condition graded", date: "Feb 24, 2026", done: true },
      { key: "listed", label: "Listed for sale", date: "Mar 2, 2026", done: true },
      { key: "paid", label: "Seller paid out", date: "Mar 20, 2026", done: true },
    ],
    items: [
      {
        id: "BATCH-2041-1",
        title: "Leather Weekender Bag",
        category: "Bags",
        conditionGrade: "Grade A",
        status: "Sold — Paid Out",
      },
      {
        id: "BATCH-2041-2",
        title: "Wool Overcoat, Size M",
        category: "Outerwear",
        conditionGrade: "Grade B",
        status: "Sold — Paid Out",
      },
      {
        id: "BATCH-2041-3",
        title: "Vintage Film Camera",
        category: "Electronics",
        conditionGrade: "Grade A",
        status: "Sold — Paid Out",
      },
      {
        id: "BATCH-2041-4",
        title: "Set of 4 Dining Chairs",
        category: "Furniture",
        conditionGrade: "Grade C",
        status: "Sold — Paid Out",
      },
    ],
  },
  {
    id: "BATCH-2058",
    location: "Repick Drop Point — Midtown",
    submittedDate: "Jan 5, 2026",
    currentStage: "listed",
    stages: [
      { key: "received", label: "Received at drop point", date: "Jan 5, 2026", done: true },
      { key: "inspected", label: "Inspected by staff", date: "Jan 9, 2026", done: true },
      { key: "graded", label: "Condition graded", date: "Jan 15, 2026", done: true },
      { key: "listed", label: "Listed for sale", date: "Jan 22, 2026", done: true },
      { key: "paid", label: "Seller paid out", date: null, done: false },
    ],
    items: [
      {
        id: "BATCH-2058-1",
        title: "Mid-Century Side Table",
        category: "Furniture",
        conditionGrade: "Grade B",
        status: "Live Listing",
      },
      {
        id: "BATCH-2058-2",
        title: "Denim Jacket, Size L",
        category: "Outerwear",
        conditionGrade: "Grade A",
        status: "Live Listing",
      },
      {
        id: "BATCH-2058-3",
        title: "Ceramic Table Lamp",
        category: "Home",
        conditionGrade: "Grade C",
        status: "Rejected — Return Scheduled",
      },
    ],
  },
  {
    id: "BATCH-2066",
    location: "Repick Drop Point — Harbor East",
    submittedDate: "Oct 2, 2026",
    currentStage: "graded",
    stages: [
      { key: "received", label: "Received at drop point", date: "Oct 2, 2026", done: true },
      { key: "inspected", label: "Inspected by staff", date: "Oct 6, 2026", done: true },
      { key: "graded", label: "Condition graded", date: "Oct 11, 2026", done: true },
      { key: "listed", label: "Listed for sale", date: null, done: false },
      { key: "paid", label: "Seller paid out", date: null, done: false },
    ],
    items: [
      {
        id: "BATCH-2066-1",
        title: "Leather Weekender Bag",
        category: "Bags",
        conditionGrade: "Grade A",
        status: "Approved — Pending Listing",
      },
      {
        id: "BATCH-2066-2",
        title: "Wool Overcoat, Size M",
        category: "Outerwear",
        conditionGrade: "Grade B",
        status: "Approved — Pending Listing",
      },
      {
        id: "BATCH-2066-3",
        title: "Ceramic Table Lamp",
        category: "Home",
        conditionGrade: "Grade C",
        status: "Rejected — Return Scheduled",
      },
      {
        id: "BATCH-2066-4",
        title: "Vintage Film Camera",
        category: "Electronics",
        conditionGrade: "Grade A",
        status: "Approved — Pending Listing",
      },
      {
        id: "BATCH-2066-5",
        title: "Set of 4 Dining Chairs",
        category: "Furniture",
        conditionGrade: "Grade B",
        status: "Approved — Pending Listing",
      },
    ],
  },
  {
    id: "BATCH-2071",
    location: "Repick Drop Point — Midtown",
    submittedDate: "Sep 18, 2026",
    currentStage: "inspected",
    stages: [
      { key: "received", label: "Received at drop point", date: "Sep 18, 2026", done: true },
      { key: "inspected", label: "Inspected by staff", date: "Sep 22, 2026", done: true },
      { key: "graded", label: "Condition graded", date: null, done: false },
      { key: "listed", label: "Listed for sale", date: null, done: false },
      { key: "paid", label: "Seller paid out", date: null, done: false },
    ],
    items: [
      {
        id: "BATCH-2071-1",
        title: "Running Sneakers, Size 10",
        category: "Footwear",
        conditionGrade: "Not yet graded",
        status: "Awaiting Grading",
      },
      {
        id: "BATCH-2071-2",
        title: "Canvas Tote Bag",
        category: "Bags",
        conditionGrade: "Not yet graded",
        status: "Awaiting Grading",
      },
    ],
  },
  {
    id: "BATCH-2079",
    location: "Repick Drop Point — Riverside",
    submittedDate: "Nov 1, 2026",
    currentStage: "received",
    stages: [
      { key: "received", label: "Received at drop point", date: "Nov 1, 2026", done: true },
      { key: "inspected", label: "Inspected by staff", date: null, done: false },
      { key: "graded", label: "Condition graded", date: null, done: false },
      { key: "listed", label: "Listed for sale", date: null, done: false },
      { key: "paid", label: "Seller paid out", date: null, done: false },
    ],
    items: [
      {
        id: "BATCH-2079-1",
        title: "Acoustic Guitar, 3/4 Size",
        category: "Instruments",
        conditionGrade: "Not yet graded",
        status: "Awaiting Inspection",
      },
      {
        id: "BATCH-2079-2",
        title: "Board Game Bundle (4 titles)",
        category: "Games",
        conditionGrade: "Not yet graded",
        status: "Awaiting Inspection",
      },
      {
        id: "BATCH-2079-3",
        title: "Stand Mixer",
        category: "Kitchen",
        conditionGrade: "Not yet graded",
        status: "Awaiting Inspection",
      },
      {
        id: "BATCH-2079-4",
        title: "Framed Print Set (3 pieces)",
        category: "Home",
        conditionGrade: "Not yet graded",
        status: "Awaiting Inspection",
      },
      {
        id: "BATCH-2079-5",
        title: "Children's Bicycle, 16in",
        category: "Outdoor",
        conditionGrade: "Not yet graded",
        status: "Awaiting Inspection",
      },
      {
        id: "BATCH-2079-6",
        title: "Wool Area Rug, 5x7",
        category: "Home",
        conditionGrade: "Not yet graded",
        status: "Awaiting Inspection",
      },
    ],
  },
];
