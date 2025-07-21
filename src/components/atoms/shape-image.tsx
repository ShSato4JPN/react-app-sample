import type { ImageProps } from "next/image";

type ImageShape = "circle" | "square";
type ShapeImageProps = ImageProps & { shape?: ImageShape };

export default function ShapeImage() {
  return <div>shape-image</div>;
}
