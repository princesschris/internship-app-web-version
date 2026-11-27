// Shows the image when `src` is given, otherwise an empty picture space.
export default function Picture({ src, alt = '', label = 'Photo', className = '' }) {
  if (src) return <img src={src} alt={alt} className={`object-cover ${className}`} />
  return (
    <div role="img" aria-label={alt || label} className={`grid place-items-center bg-soft text-muted ${className}`}>
      {label}
    </div>
  )
}