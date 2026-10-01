export type Product = {
  id: string;
  name: string;
  description: string;
  category: "Lighting" | "Tabletop" | "Textiles";
  material: string;
  price: number;
  label?: string;
  image: string;
};

export const products: Product[] = [
  { id: "arc-lamp", name: "Arc table light", description: "A quiet pool of light", category: "Lighting", material: "Brushed brass · linen", price: 248, label: "Bestseller", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85" },
  { id: "forma-vase", name: "Forma vessel", description: "Hand-finished stoneware", category: "Tabletop", material: "Speckled clay · oat", price: 86, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85" },
  { id: "woven-throw", name: "Sunday throw", description: "For one more slow morning", category: "Textiles", material: "Recycled cotton · moss", price: 164, label: "Small batch", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85" },
  { id: "column-candle", name: "Column candle set", description: "A softer kind of evening", category: "Tabletop", material: "Beeswax · natural", price: 42, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85" },
  { id: "folded-lamp", name: "Fold pendant", description: "Paper, made permanent", category: "Lighting", material: "Rice paper · ash", price: 312, image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1000&q=85" },
  { id: "linen-cushion", name: "Washed linen cushion", description: "A little lived-in from day one", category: "Textiles", material: "European flax · clay", price: 74, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85" },
];