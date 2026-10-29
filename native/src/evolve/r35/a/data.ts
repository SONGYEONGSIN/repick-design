// native/src/evolve/r35/a/data.ts
// Deterministic dummy data for the Seller Response Templates screen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below.

export type ResponseTemplate = {
  id: string;
  title: string;
  category: string;
  body: string;
  usageCount: number;
};

export const initialTemplates: ResponseTemplate[] = [
  {
    id: "tpl-still-available",
    title: "Still available",
    category: "Availability",
    body: "Thanks for your interest! This item is still available and ready to ship.",
    usageCount: 128,
  },
  {
    id: "tpl-already-sold",
    title: "Already sold",
    category: "Availability",
    body: "Sorry, this item has already sold. I'll post similar items soon — feel free to follow my store.",
    usageCount: 942,
  },
  {
    id: "tpl-price-firm",
    title: "Price is firm",
    category: "Price",
    body: "The price listed is firm for now, but I'll let you know if that changes.",
    usageCount: 56,
  },
  {
    id: "tpl-open-to-offers",
    title: "Open to offers",
    category: "Price",
    body: "I'm open to reasonable offers — what did you have in mind?",
    usageCount: 1240,
  },
  {
    id: "tpl-ships-next-day",
    title: "Ships next business day",
    category: "Shipping",
    body: "Orders placed before 6pm ship the same day. After that, it goes out the next morning.",
    usageCount: 7,
  },
  {
    id: "tpl-local-pickup-only",
    title: "Local pickup only",
    category: "Pickup",
    body: "This item is local pickup only. I'm usually free on weekday evenings and weekends.",
    usageCount: 310,
  },
  {
    id: "tpl-condition-details",
    title: "Condition details",
    category: "Condition",
    body: "It's in great used condition — light wear on the corners, fully functional, no damage.",
    usageCount: 89,
  },
  {
    id: "tpl-thanks-for-buying",
    title: "Thanks for buying",
    category: "Thanks",
    body: "Thank you for your purchase! Shipping out today, tracking info will follow shortly.",
    usageCount: 24,
  },
];
