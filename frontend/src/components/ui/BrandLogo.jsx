import { APP_NAME } from '../../utils/constants.js';

export default function BrandLogo({ onDark = false, className = 'h-[4.5rem]' }) {
  return (
    <img
      src={onDark ? '/2.svg' : '/1.svg'}
      alt={APP_NAME}
      width={1420}
      height={450}
      decoding="async"
      className={`w-auto max-w-full object-contain object-left ${className}`}
    />
  );
}
