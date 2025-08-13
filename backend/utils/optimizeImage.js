import sharp from 'sharp';
import path from 'path';

export const optimizeImage = async (buffer, originalName) => {
    const filenameNoExt = originalName.split(' ').join('_').split('.')[0];
    const filename = `${Date.now()}_${filenameNoExt}.webp`;
    const folder = 'images/BooksImages';
    const outputPath = path.join(folder, filename);

    await sharp(buffer)
    .resize(206, 260)
    .webp({ quality: 80 })
    .toFile(outputPath);

    return filename;
};
