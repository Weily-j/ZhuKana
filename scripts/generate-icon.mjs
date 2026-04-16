/**
 * 產生 192×192 PNG 應用程式圖示（不需要外部依賴）
 * 使用純 Node.js zlib 壓縮產生合規 PNG 格式
 */
import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZE = 192;

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

// 產生漸層藍紫色 192×192 圖示
const pixels = Buffer.allocUnsafe(SIZE * SIZE * 3);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const t = (x + y) / (SIZE * 2);
    // 從 #2f6fed（藍）漸層到 #7d42d1（紫）
    pixels[(y * SIZE + x) * 3 + 0] = Math.round(0x2f + t * (0x7d - 0x2f)); // R
    pixels[(y * SIZE + x) * 3 + 1] = Math.round(0x6f + t * (0x42 - 0x6f)); // G
    pixels[(y * SIZE + x) * 3 + 2] = Math.round(0xed + t * (0xd1 - 0xed)); // B
  }
}

// PNG scanlines（每行前加 filter byte 0x00）
const scanlines = Buffer.allocUnsafe(SIZE * (1 + SIZE * 3));
for (let y = 0; y < SIZE; y++) {
  scanlines[y * (1 + SIZE * 3)] = 0; // filter = None
  pixels.copy(scanlines, y * (1 + SIZE * 3) + 1, y * SIZE * 3, (y + 1) * SIZE * 3);
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = chunk(
  "IHDR",
  Buffer.concat([u32(SIZE), u32(SIZE), Buffer.from([8, 2, 0, 0, 0])]) // 8-bit RGB
);
const idat = chunk("IDAT", deflateSync(scanlines, { level: 6 }));
const iend = chunk("IEND", Buffer.alloc(0));

const png = Buffer.concat([sig, ihdr, idat, iend]);
const outPath = path.resolve(__dirname, "../icons/app-icon-192.png");
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, png);
console.log(`Generated ${outPath} (${png.length} bytes)`);
