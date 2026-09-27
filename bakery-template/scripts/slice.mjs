/** Split a tall screenshot into segments for review: node scripts/slice.mjs <in.png> <segmentHeight> */
import sharp from 'sharp';
const [, , input, seg = '1400'] = process.argv;
const { width, height } = await sharp(input).metadata();
const h = Number(seg);
const out = [];
for (let top = 0, i = 0; top < height; top += h, i++) {
  const file = input.replace(/\.png$/, `-${String(i).padStart(2, '0')}.png`);
  await sharp(input)
    .extract({ left: 0, top, width, height: Math.min(h, height - top) })
    .toFile(file);
  out.push(file);
}
console.log(out.join('\n'));
