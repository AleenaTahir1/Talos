// Logo conversion script
// Run with: node convert-logo.mjs

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the SVG file
const svgPath = join(__dirname, '..', 'logo.svg');
const outputDir = join(__dirname, 'src-tauri', 'icons');

// Ensure output directory exists
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

const svgBuffer = readFileSync(svgPath);

// Generate different sizes
const sizes = [
    { name: '32x32.png', size: 32 },
    { name: '128x128.png', size: 128 },
    { name: '128x128@2x.png', size: 256 },
    { name: 'icon.ico', size: 256 },
    { name: 'icon.icns', size: 512 },
    { name: 'icon.png', size: 512 },
];

async function convertLogo() {
    console.log('Converting logo.svg to various formats...\n');

    for (const { name, size } of sizes) {
        const outputPath = join(outputDir, name);

        try {
            if (name.endsWith('.ico')) {
                // For ICO, we generate PNG and user can convert manually
                // or we save as PNG with .ico extension (browsers treat it properly)
                await sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toFile(outputPath.replace('.ico', '_ico.png'));
                console.log(`✓ Generated: ${name.replace('.ico', '_ico.png')} (${size}x${size})`);
                console.log('  Note: Convert PNG to ICO using online converter or IcoFX');
            } else if (name.endsWith('.icns')) {
                // For ICNS (macOS), generate high-res PNG
                await sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toFile(outputPath.replace('.icns', '_icns.png'));
                console.log(`✓ Generated: ${name.replace('.icns', '_icns.png')} (${size}x${size})`);
                console.log('  Note: Convert PNG to ICNS using iconutil on macOS');
            } else {
                await sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toFile(outputPath);
                console.log(`✓ Generated: ${name} (${size}x${size})`);
            }
        } catch (error) {
            console.error(`✗ Error generating ${name}:`, error.message);
        }
    }

    console.log('\n✓ Logo conversion complete!');
    console.log(`Output directory: ${outputDir}`);
}

convertLogo();
