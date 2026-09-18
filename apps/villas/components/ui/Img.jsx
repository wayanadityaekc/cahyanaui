export default function Img({ src, alt, width, height, ratio, priority = false, className, ...rest }) {
  const style = ratio ? { aspectRatio: ratio, height: 'auto', ...(rest.style || {}) } : rest.style;
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      {...rest}
      style={style}
    />
  );
}
