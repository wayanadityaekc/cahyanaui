import BrandIcon from './BrandIcon.jsx';

// CUE's review source tag: the platform's mark in the review box's bottom-right corner, 18px (the box must be `relative`).
export default function SourceMark({ platform = null }) {
  if (!platform) return null;
  return (
    <span role="img" aria-label={`Review from ${platform}`} className="absolute right-[1.3rem] bottom-[1.1rem] inline-flex" data-source-mark={platform}>
      <BrandIcon name={platform} className="block w-[18px] h-[18px]" />
    </span>
  );
}
