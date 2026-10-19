import { cn } from '../lib/cn.js';

const LOGO_WIDTH_PX = 1005;
const LOGO_HEIGHT_PX = 324;

export default function ModalLogo({ src = '', alt = '', width = LOGO_WIDTH_PX, height = LOGO_HEIGHT_PX, className }) {
  if (!src) return null;
  return (
    <img
      className={cn('block h-[38px] w-auto mx-auto mb-[1.1rem]', className)}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
