import round from "@/assets/frame-round.png";
import square from "@/assets/frame-square.png";
import aviator from "@/assets/frame-aviator.png";
import cateye from "@/assets/frame-cateye.png";
import wayfarer from "@/assets/frame-wayfarer.png";
import rectangle from "@/assets/frame-rectangle.png";

export type FaceShape = "Round" | "Oval" | "Square" | "Heart";
export type GlassesType = "Eyeglasses" | "Sunglasses";
export type StylePref = "Minimal" | "Bold";

export interface Frame {
  id: string;
  name: string;
  brand: string;
  shape: "Round" | "Square" | "Aviator" | "Cat-eye" | "Wayfarer" | "Rectangle";
  type: GlassesType;
  style: StylePref;
  price: number;
  image: string;
  suits: FaceShape[];
  avoidFor: FaceShape[];
  reason: string;
  swatches: { name: string; hue: number }[];
}

const swatchSet = [
  { name: "Onyx", hue: 240 },
  { name: "Tortoise", hue: 28 },
  { name: "Crystal", hue: 200 },
  { name: "Rose", hue: 340 },
  { name: "Forest", hue: 150 },
];

export const FRAMES: Frame[] = [
  {
    id: "f1", name: "Halo", brand: "Lensly", shape: "Round", type: "Eyeglasses", style: "Minimal", price: 129,
    image: round, suits: ["Square", "Heart"], avoidFor: ["Round"],
    reason: "Soft round curves balance angular jawlines and add gentle proportion to your face.",
    swatches: swatchSet,
  },
  {
    id: "f2", name: "Vector", brand: "Moscot", shape: "Square", type: "Eyeglasses", style: "Bold", price: 189,
    image: square, suits: ["Round", "Oval"], avoidFor: ["Square"],
    reason: "Strong geometry adds definition to softer, rounder face shapes.",
    swatches: swatchSet,
  },
  {
    id: "f3", name: "Skyline", brand: "RayBan", shape: "Aviator", type: "Sunglasses", style: "Bold", price: 159,
    image: aviator, suits: ["Square", "Heart", "Oval"], avoidFor: [],
    reason: "Teardrop shape complements broad foreheads and tapers toward the chin.",
    swatches: swatchSet,
  },
  {
    id: "f4", name: "Lumière", brand: "Gentle Monster", shape: "Cat-eye", type: "Eyeglasses", style: "Bold", price: 219,
    image: cateye, suits: ["Round", "Heart"], avoidFor: ["Square"],
    reason: "Upswept corners lift cheekbones and highlight your eyes.",
    swatches: swatchSet,
  },
  {
    id: "f5", name: "Drift", brand: "Persol", shape: "Wayfarer", type: "Sunglasses", style: "Minimal", price: 175,
    image: wayfarer, suits: ["Oval", "Round"], avoidFor: [],
    reason: "Universal silhouette with clean lines — flatters most face shapes.",
    swatches: swatchSet,
  },
  {
    id: "f6", name: "Edge", brand: "Warby Parker", shape: "Rectangle", type: "Eyeglasses", style: "Minimal", price: 95,
    image: rectangle, suits: ["Round", "Oval"], avoidFor: ["Square"],
    reason: "Slim rectangular silhouette elongates rounder faces with subtle elegance.",
    swatches: swatchSet,
  },
];

export const FACE_SHAPE_DESCRIPTIONS: Record<FaceShape, string> = {
  Round: "Soft curves with similar width and length, full cheeks.",
  Oval: "Balanced proportions slightly longer than wide — most versatile.",
  Square: "Strong jawline with forehead and cheeks of similar width.",
  Heart: "Wider forehead tapering down to a narrower, defined chin.",
};

export const AVOID_BY_SHAPE: Record<FaceShape, string> = {
  Round: "Avoid small round frames — they emphasize roundness.",
  Oval: "Avoid oversized frames that hide your natural symmetry.",
  Square: "Avoid sharp rectangular frames that mirror your jawline.",
  Heart: "Avoid heavy bottom-rimmed frames that drag the gaze downward.",
};