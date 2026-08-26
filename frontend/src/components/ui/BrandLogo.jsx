export default function BrandLogo({ onDark = false, className = 'h-[4.5rem]' }) {
  return (
    <img
      src={onDark ? '/logoclair.svg' : '/logosombre.svg'}
      alt="QTable"
      width={1055}
      height={610}
      decoding="async"
      className={`w-auto max-w-full object-contain object-left ${className}`}
    />
  );
}
