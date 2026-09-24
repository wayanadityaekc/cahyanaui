// Tailwind-native (migrasi Fase 2, keluarga kartu - stage 3): kartu guide
// (Guides & Information homepage + guide hub). Foto persegi, JUDUL di dalam foto
// (bagian bawah, putih + gradient), tag di strip putih bawahnya. Dulu numpang
// .experience__card + .guide-home__card + .experience__image/body/name + CardImage
// - sekarang inner-nya utilities mandiri (lepas dari CardImage & tema
// .experience__*). Class `experience__card` DIPERTAHANKAN sbg frame kartu (putih
// inset radius/shadow) + hook sizing grid-slider. desc di-drop (dulu display:none).
import { CARD_FRAME } from '@/components/ui/cardClasses';

// `overlayTag` (guide hub grid, Sep 2026 - Wayan): tag pindah ke dalam foto bareng
// judul (dua-duanya putih), bukan di strip putih di bawah - card jadi full-bleed foto.
// Default false = perilaku lama (dipertahankan di GuideHome/GuideMore, belum diminta ganti).
export default function GuideCard({ href, img, alt, title, tag, cat, w = 600, hgt = 600, overlayTag = false }) {
  return (
    <a className={`${CARD_FRAME} flex flex-col`} data-cat={cat} href={href}>
      <div className={`relative aspect-square rounded-md overflow-hidden bg-green after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,transparent_${overlayTag ? '25' : '42'}%,rgba(0,0,0,0.6))]`}>
        {img && (
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={`/assets/images/${img}`}
            alt={alt || title}
            width={w}
            height={hgt}
            loading="lazy"
          />
        )}
        {overlayTag && (
          <div className="absolute left-0 right-0 bottom-0 z-[1] flex flex-col gap-[0.2rem] px-[0.9rem] pb-[0.85rem]">
            {tag && <span className="text-label font-medium tracking-[0.14em] uppercase text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">{tag}</span>}
            <h3 className="m-0 block text-white font-body text-[1rem] font-semibold leading-[1.2] text-left [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h3>
          </div>
        )}
      </div>
      {!overlayTag && (
        <div className="relative flex flex-col grow px-[0.9rem] pt-[0.6rem] pb-[0.75rem]">
          <h3 className="absolute left-0 right-0 bottom-full m-0 block px-[0.9rem] pb-[0.85rem] text-white font-body text-[1rem] font-semibold leading-[1.2] text-left [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </h3>
          {tag && <span className="text-label font-medium tracking-[0.14em] uppercase text-muted">{tag}</span>}
        </div>
      )}
    </a>
  );
}
