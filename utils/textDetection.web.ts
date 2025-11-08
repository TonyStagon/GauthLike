export interface TextBoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export async function detectTextRegion(
  imageUri: string
): Promise<TextBoundingBox | null> {
  return null;
}
