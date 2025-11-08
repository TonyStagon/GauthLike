import TextRecognition from '@react-native-ml-kit/text-recognition';

export interface TextBoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export async function detectTextRegion(
  imageUri: string
): Promise<TextBoundingBox | null> {
  try {
    const result = await TextRecognition.recognize(imageUri);

    if (!result || !result.blocks || result.blocks.length === 0) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    result.blocks.forEach((block) => {
      if (block.frame) {
        const frame = block.frame;
        minX = Math.min(minX, frame.left || 0);
        minY = Math.min(minY, frame.top || 0);
        maxX = Math.max(maxX, (frame.left || 0) + (frame.width || 0));
        maxY = Math.max(maxY, (frame.top || 0) + (frame.height || 0));
      }
    });

    if (minX === Infinity || minY === Infinity) {
      return null;
    }

    const padding = 20;
    return {
      left: Math.max(0, minX - padding),
      top: Math.max(0, minY - padding),
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    };
  } catch (error) {
    console.error('Text detection error:', error);
    return null;
  }
}
