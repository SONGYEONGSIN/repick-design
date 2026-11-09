// native/src/evolve/r53/c/data.ts
//
// Fixed, hand-written size/fit conversion data for a secondhand-marketplace
// reference screen. Nothing here is derived from Math.random/Date.now/new
// Date(); every row is a literal value a shopper could look up in a printed
// size chart.

export type FitCategory = "Tops" | "Bottoms" | "Shoes" | "Outerwear";

export type FitRow = {
  /** The row's own size label, e.g. "S" or "Women's 8". */
  label: string;
  /** Value to show when the screen's unit mode is "metric". */
  metricValue: string;
  /** Value to show when the screen's unit mode is "imperial". */
  imperialValue: string;
};

export type FitGuide = {
  id: string;
  category: FitCategory;
  garmentName: string;
  /** What the metric/imperial columns actually measure, for the table header. */
  measuresLabel: string;
  helperNote: string;
  rows: FitRow[];
};

export const fitGuides: FitGuide[] = [
  {
    id: "guide-women-tops",
    category: "Tops",
    garmentName: "Women's Tops & Knitwear",
    measuresLabel: "Bust",
    helperNote: "Measured around the fullest part of the bust.",
    rows: [
      { label: "XS", metricValue: "78–81 cm", imperialValue: "31–32 in" },
      { label: "S", metricValue: "82–85 cm", imperialValue: "32–33 in" },
      { label: "M", metricValue: "86–90 cm", imperialValue: "34–35 in" },
      { label: "L", metricValue: "91–96 cm", imperialValue: "36–38 in" },
      { label: "XL", metricValue: "97–104 cm", imperialValue: "38–41 in" },
    ],
  },
  {
    id: "guide-men-tops",
    category: "Tops",
    garmentName: "Men's Shirts & Tees",
    measuresLabel: "Chest",
    helperNote: "Measured across the chest, just under the arms.",
    rows: [
      { label: "S", metricValue: "88–93 cm", imperialValue: "35–37 in" },
      { label: "M", metricValue: "94–99 cm", imperialValue: "37–39 in" },
      { label: "L", metricValue: "100–106 cm", imperialValue: "39–42 in" },
      { label: "XL", metricValue: "107–114 cm", imperialValue: "42–45 in" },
    ],
  },
  {
    id: "guide-women-bottoms",
    category: "Bottoms",
    garmentName: "Women's Trousers & Denim",
    measuresLabel: "Waist",
    helperNote: "Measured at the narrowest point of the natural waist.",
    rows: [
      { label: "W24", metricValue: "61 cm", imperialValue: "24 in" },
      { label: "W26", metricValue: "66 cm", imperialValue: "26 in" },
      { label: "W28", metricValue: "71 cm", imperialValue: "28 in" },
      { label: "W30", metricValue: "76 cm", imperialValue: "30 in" },
      { label: "W32", metricValue: "81 cm", imperialValue: "32 in" },
    ],
  },
  {
    id: "guide-men-bottoms",
    category: "Bottoms",
    garmentName: "Men's Trousers & Denim",
    measuresLabel: "Waist",
    helperNote: "Measured at the point the trousers sit on the hip.",
    rows: [
      { label: "W30", metricValue: "76 cm", imperialValue: "30 in" },
      { label: "W32", metricValue: "81 cm", imperialValue: "32 in" },
      { label: "W34", metricValue: "86 cm", imperialValue: "34 in" },
      { label: "W36", metricValue: "91 cm", imperialValue: "36 in" },
      { label: "W38", metricValue: "97 cm", imperialValue: "38 in" },
    ],
  },
  {
    id: "guide-women-shoes",
    category: "Shoes",
    garmentName: "Women's Shoes",
    measuresLabel: "Size (EU / US)",
    helperNote: "EU shown in metric mode, US shown in imperial mode.",
    rows: [
      { label: "UK 3", metricValue: "EU 36", imperialValue: "US 5.5" },
      { label: "UK 4", metricValue: "EU 37", imperialValue: "US 6.5" },
      { label: "UK 5", metricValue: "EU 38", imperialValue: "US 7.5" },
      { label: "UK 6", metricValue: "EU 39", imperialValue: "US 8.5" },
      { label: "UK 7", metricValue: "EU 40", imperialValue: "US 9.5" },
    ],
  },
  {
    id: "guide-men-shoes",
    category: "Shoes",
    garmentName: "Men's Shoes",
    measuresLabel: "Size (EU / US)",
    helperNote: "EU shown in metric mode, US shown in imperial mode.",
    rows: [
      { label: "UK 7", metricValue: "EU 41", imperialValue: "US 8" },
      { label: "UK 8", metricValue: "EU 42", imperialValue: "US 9" },
      { label: "UK 9", metricValue: "EU 43", imperialValue: "US 10" },
      { label: "UK 10", metricValue: "EU 44", imperialValue: "US 11" },
      { label: "UK 11", metricValue: "EU 45", imperialValue: "US 12" },
    ],
  },
  {
    id: "guide-outerwear",
    category: "Outerwear",
    garmentName: "Coats & Jackets",
    measuresLabel: "Chest",
    helperNote: "Measured over a midweight layer, arms relaxed.",
    rows: [
      { label: "S", metricValue: "90–95 cm", imperialValue: "35–37 in" },
      { label: "M", metricValue: "96–101 cm", imperialValue: "38–40 in" },
      { label: "L", metricValue: "102–108 cm", imperialValue: "40–43 in" },
      { label: "XL", metricValue: "109–116 cm", imperialValue: "43–46 in" },
    ],
  },
  {
    id: "guide-kids-outerwear",
    category: "Outerwear",
    garmentName: "Kids' Coats (7–12y)",
    measuresLabel: "Height",
    helperNote: "Matched to child's height, not chest, for growing room.",
    rows: [
      { label: "7–8y", metricValue: "122–128 cm", imperialValue: "48–50 in" },
      { label: "9–10y", metricValue: "134–140 cm", imperialValue: "53–55 in" },
      { label: "11–12y", metricValue: "146–152 cm", imperialValue: "57–60 in" },
    ],
  },
];
