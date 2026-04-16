/**
 * 產生 192×192 與 512×512 PNG 應用程式圖示（不需要外部依賴）
 * 使用純 Node.js zlib 壓縮產生合規 PNG 格式
 */
import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZES = [192, 512];

// 寫入 4 byte big-endian uint32
function u32(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n, 0);
  return b;
}

// CRC32 查表
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = u32(data.length);
  const crcBuf = Buffer.concat([typeBytes, data]);
  const crcVal = u32(crc32(crcBuf));
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function buildIcon(size) {
  const pixels = Buffer.allocUnsafe(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = (x + y) / (size * 2);
      pixels[(y * size + x) * 3 + 0] = Math.round(0x2f + t * (0x7d - 0x2f));
      pixels[(y * size + x) * 3 + 1] = Math.round(0x6f + t * (0x42 - 0x6f));
      pixels[(y * size + x) * 3 + 2] = Math.round(0xed + t * (0xd1 - 0xed));
    }
  }

  const scanlines = Buffer.allocUnsafe(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    scanlines[y * (1 + size * 3)] = 0;
    pixels.copy(scanlines, y * (1 + size * 3) + 1, y * size * 3, (y + 1) * size * 3);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = chunk(
    "IHDR",
    Buffer.concat([u32(size), u32(size), Buffer.from([8, 2, 0, 0, 0])]),
  );
  const idat = chunk("IDAT", deflateSync(scanlines, { level: 6 }));
  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

mkdirSync(path.resolve(__dirname, "../icons"), { recursive: true });

for (const size of SIZES) {
  const png = buildIcon(size);
  const outPath = path.resolve(__dirname, `../icons/app-icon-${size}.png`);
  writeFileSync(outPath, png);
  console.log(`Generated ${outPath} (${png.length} bytes)`);
}
