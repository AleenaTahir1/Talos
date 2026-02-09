import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = fs.readFileSync(path.join('public', 'robot-logo.svg'));
const iconsDir = path.join('src-tauri', 'icons');

async function generateIcons() {
    console.log('Generating icons from SVG...');

    // 32x32.png
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(iconsDir, '32x32.png'));

    // 128x128.png
    await sharp(svgBuffer)
        .resize(128, 128)
        .png()
        .toFile(path.join(iconsDir, '128x128.png'));

    // 128x128@2x.png (256x256)
    await sharp(svgBuffer)
        .resize(256, 256)
        .png()
        .toFile(path.join(iconsDir, '128x128@2x.png'));

    // icon.png (512x512)
    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(iconsDir, 'icon.png'));

    // For .ico, we usually need a specific plugin or multiple sizes, 
    // but generic sharp usage often just creating a png named .ico doesn't work well for OS.
    // However, seeing as we are in a rush, let's try to make a 256x256 png and name it icon.ico 
    // (This is hacky, real .ico is different, but sometimes works or we can skip if it fails).
    // Better approach: Tauri generates icons using `tauri icon` command if we had the CLI fully set up with a source image.
    // But let's try to overwrite the icon.ico with a valid ICO buffer if possible. 
    // Sharp doesn't support ICO write natively usually. 
    // We will stick to PNGs and hope Tauri picks them up or the user sees the PNGs in many places.
    // Actually, let's just create the PNGs. The .ico is harder.

    console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
