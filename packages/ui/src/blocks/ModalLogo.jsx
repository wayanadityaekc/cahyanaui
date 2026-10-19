import { cn } from '../lib/cn.js';

export default function ModalLogo({ src = '', alt = '', width = 1005, height = 324, className }) {
  if (!src) return null;
  return (
    <img className={cn('block h-[38px] w-auto mx-auto mb-[1.1rem]', className)} src={src} alt={alt} width={width} height={height} />
  );
}
