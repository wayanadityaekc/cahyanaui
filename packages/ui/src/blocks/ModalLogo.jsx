import { cn } from '../lib/cn.js';

// The brand logo at the top of a popup, centred (CUE's modal LOGO: 38px high). Each site passes its own file.
export default function ModalLogo({ src = '', alt = '', width = 1005, height = 324, className }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn('block h-[38px] w-auto mx-auto mb-[1.1rem]', className)} src={src} alt={alt} width={width} height={height} />
  );
}
