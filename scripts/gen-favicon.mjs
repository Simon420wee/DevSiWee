import { deflateSync } from 'zlib'
import { writeFileSync } from 'fs'

/* ── Minimal PNG encoder (no deps) ── */
function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const b of buf) { c ^= b; for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0) }
  return (~c) >>> 0
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length)
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([l, t, data, c])
}
function makePNG(w, h, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8]=8; ihdr[9]=6 // 8-bit RGBA
  const raw = Buffer.alloc(h * (w * 4 + 1))
  for (let y = 0; y < h; y++) {
    raw[y * (w*4+1)] = 0
    for (let x = 0; x < w; x++) {
      const s=(y*w+x)*4, d=y*(w*4+1)+1+x*4
      raw[d]=pixels[s]; raw[d+1]=pixels[s+1]; raw[d+2]=pixels[s+2]; raw[d+3]=pixels[s+3]
    }
  }
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ])
}

/* ── Draw 64×64 brand-mark favicon ── */
const W = 64, H = 64
const px = new Uint8Array(W * H * 4)

const set = (x, y, r, g, b, a) => {
  if (x < 0 || x >= W || y < 0 || y >= H) return
  const i = (y*W+x)*4; px[i]=r; px[i+1]=g; px[i+2]=b; px[i+3]=a
}

// Background #00040e
for (let i = 0; i < W*H*4; i+=4) { px[i]=0; px[i+1]=4; px[i+2]=14; px[i+3]=255 }

// Rounded square background (dark rounded rect)
const pad = 5, r = 8
for (let y = pad; y < H-pad; y++) {
  for (let x = pad; x < W-pad; x++) {
    const dx = Math.max(0, Math.max(pad+r-x, x-(W-pad-r-1)))
    const dy = Math.max(0, Math.max(pad+r-y, y-(H-pad-r-1)))
    if (dx*dx+dy*dy <= r*r) { set(x,y, 0,8,22, 255) }
  }
}

// Diamond (rotated square) — gradient purple→cyan
const cx=32, cy=32, sz=18
for (let y = cy-sz; y <= cy+sz; y++) {
  for (let x = cx-sz; x <= cx+sz; x++) {
    const dist = Math.abs(x-cx)+Math.abs(y-cy)
    if (dist > sz) continue
    const t = Math.max(0, Math.min(1, (x - (cx-sz)) / (sz*2)))
    // purple #a78bfa → cyan #2de0f8
    const R = Math.round(167*(1-t) + 45*t)
    const G = Math.round(139*(1-t) + 224*t)
    const B = Math.round(250*(1-t) + 248*t)
    const edge = sz - dist
    const alpha = edge >= 2 ? 255 : Math.round(255 * edge / 2)
    set(x, y, R, G, B, alpha)
  }
}

// Inner glow (lighter center of diamond)
for (let y = cy-sz+4; y <= cy+sz-4; y++) {
  for (let x = cx-sz+4; x <= cx+sz-4; x++) {
    const dist = Math.abs(x-cx)+Math.abs(y-cy)
    if (dist > sz-5) continue
    const t = Math.max(0, Math.min(1, (x - (cx-sz)) / (sz*2)))
    const R = Math.min(255, Math.round((167*(1-t)+45*t)*1.3))
    const G = Math.min(255, Math.round((139*(1-t)+224*t)*1.3))
    const B = Math.min(255, Math.round((250*(1-t)+248*t)*1.1))
    set(x, y, R, G, B, 255)
  }
}

writeFileSync('public/favicon.png', makePNG(W, H, px))
console.log('✅  public/favicon.png generated (64×64)')
