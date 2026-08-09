import heic2any from 'heic2any';

/**
 * Checks if a file is HEIC/HEIF and converts it to JPEG.
 * Returns the original file if it is not HEIC.
 */
export async function convertHeicToJpg(file) {
  const name = file.name.toLowerCase();
  const isHeic = file.type === 'image/heic' || 
                 file.type === 'image/heif' || 
                 name.endsWith('.heic') || 
                 name.endsWith('.heif');

  if (isHeic) {
    try {
      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.85,
      });

      const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
      const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
      
      return new File([blob], newName, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error converting HEIC image:', error);
      throw new Error('Could not convert HEIC photo. Please try a JPEG or PNG.');
    }
  }

  return file;
}

/**
 * Loads an image file/blob into an HTMLImageElement.
 * This helper resolves a promise when the image is fully loaded.
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Draws an image on the canvas using cover-style cropping.
 * Keeps the subject centered horizontally and vertically.
 */
export function drawCoverImage(ctx, img, destX, destY, destWidth, destHeight) {
  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;

  const imgRatio = imgWidth / imgHeight;
  const destRatio = destWidth / destHeight;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = imgWidth;
  let sourceHeight = imgHeight;

  if (imgRatio > destRatio) {
    // Source is wider than target aspect ratio -> Crop horizontal sides
    sourceWidth = imgHeight * destRatio;
    sourceX = (imgWidth - sourceWidth) / 2;
  } else {
    // Source is taller than target aspect ratio -> Crop vertical sides (top/bottom)
    sourceHeight = imgWidth / destRatio;
    sourceY = (imgHeight - sourceHeight) / 2;
  }

  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth,
    destHeight
  );
}
