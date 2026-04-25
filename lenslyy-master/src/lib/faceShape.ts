import { FaceShape } from "@/data/frames";

let detectorPromise: Promise<any> | null = null;

async function getDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const tf = await import("@tensorflow/tfjs-core");
      await import("@tensorflow/tfjs-backend-webgl");
      try {
        await tf.setBackend("webgl");
      } catch {
        await import("@tensorflow/tfjs-backend-cpu");
        await tf.setBackend("cpu");
      }
      await tf.ready();
      const faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection");
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      return faceLandmarksDetection.createDetector(model, {
        runtime: "tfjs",
        refineLandmarks: false,
        maxFaces: 1,
      });
    })();
  }
  return detectorPromise;
}

const SHAPES: FaceShape[] = ["Round", "Oval", "Square", "Heart"];

/** Build preprocessed canvas variants to maximize detection success. */
function buildVariants(img: HTMLImageElement): HTMLCanvasElement[] {
  const variants: HTMLCanvasElement[] = [];
  const targets = [640, 480, 960];
  for (const target of targets) {
    const scale = target / Math.max(img.naturalWidth, img.naturalHeight);
    const w = Math.max(64, Math.round(img.naturalWidth * scale));
    const h = Math.max(64, Math.round(img.naturalHeight * scale));
    // Plain
    const c1 = document.createElement("canvas");
    c1.width = w; c1.height = h;
    c1.getContext("2d")!.drawImage(img, 0, 0, w, h);
    variants.push(c1);
    // Brightness/contrast boost (helps low-light)
    const c2 = document.createElement("canvas");
    c2.width = w; c2.height = h;
    const ctx2 = c2.getContext("2d")!;
    (ctx2 as any).filter = "brightness(1.25) contrast(1.15) saturate(1.05)";
    ctx2.drawImage(img, 0, 0, w, h);
    variants.push(c2);
  }
  return variants;
}

/** Deterministic fallback so the user always gets a recommendation. */
function fallbackShape(img: HTMLImageElement): FaceShape {
  const ratio = img.naturalHeight / Math.max(1, img.naturalWidth);
  // Bias by aspect plus a stable hash of dimensions
  const seed = (img.naturalWidth * 31 + img.naturalHeight) % SHAPES.length;
  if (ratio > 1.25) return "Oval";
  if (ratio < 0.95) return "Round";
  return SHAPES[seed];
}

/** Detect face shape from a still image — always returns a recommendation. */
export async function detectFaceShape(
  imageEl: HTMLImageElement
): Promise<{ shape: FaceShape; ratio: number; confident: boolean }> {
  let detector: any;
  try {
    detector = await getDetector();
  } catch (e) {
    console.warn("Detector init failed, using fallback", e);
    return { shape: fallbackShape(imageEl), ratio: 1, confident: false };
  }

  const variants = buildVariants(imageEl);
  let lm: any[] | null = null;
  for (const canvas of variants) {
    try {
      const faces = await detector.estimateFaces(canvas, { flipHorizontal: false });
      const kp = faces?.[0]?.keypoints;
      if (kp && kp.length >= 400) { lm = kp; break; }
    } catch (e) {
      console.warn("Variant detect failed", e);
    }
  }

  if (!lm) {
    return { shape: fallbackShape(imageEl), ratio: 1, confident: false };
  }

  const top = lm[10], chin = lm[152];
  const left = lm[234], right = lm[454];
  const jawL = lm[172], jawR = lm[397];
  const browL = lm[103], browR = lm[332];

  const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);
  const faceWidth = dist(left, right);
  const faceHeight = dist(top, chin);
  const jawWidth = dist(jawL, jawR);
  const browWidth = dist(browL, browR);

  const ratio = faceHeight / faceWidth;
  const jawToFace = jawWidth / faceWidth;
  const browToJaw = browWidth / jawWidth;

  let shape: FaceShape = "Oval";
  if (ratio < 1.05 && jawToFace > 0.78) shape = "Round";
  else if (jawToFace > 0.85 && ratio < 1.15) shape = "Square";
  else if (browToJaw > 1.08) shape = "Heart";
  else shape = "Oval";

  return { shape, ratio, confident: true };
}
