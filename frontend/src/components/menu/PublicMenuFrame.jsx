import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import { normalizeMenuUi } from '../../utils/menuUi.js';

export default function PublicMenuFrame({ cafe, className = '', children }) {
  const ui = normalizeMenuUi(cafe?.menuUi);
  const customColor = ui.bgMode === 'color' ? ui.backgroundColor : '';
  const customImage = ui.bgMode === 'image' && ui.backgroundImage ? ui.backgroundImage : '';

  const style = customColor
    ? { '--color-background': customColor, background: customColor }
    : customImage
      ? { '--color-background': 'transparent', background: 'transparent' }
      : undefined;

  return (
    <div className={`menu-app relative min-h-screen bg-background text-on-surface ${className}`} style={style}>
      {customImage ? (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <CloudinaryImage src={customImage} alt="" preset="cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0d1b2a]/40" />
        </div>
      ) : null}
      <div className="relative z-10 flex h-full min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
