import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import { normalizeMenuUi } from '../../utils/menuUi.js';

export default function PublicMenuFrame({ cafe, className = '', children }) {
  const ui = normalizeMenuUi(cafe?.menuUi);
  const locked = className.includes('menu-app');
  const customColor = !locked && ui.bgMode === 'color' && ui.backgroundColor ? ui.backgroundColor : '';
  const customImage = !locked && ui.bgMode === 'image' && ui.backgroundImage ? ui.backgroundImage : '';

  return (
    <div
      className={`menu-theme-${ui.theme} relative min-h-screen bg-background text-on-surface ${className}`}
      data-menu-theme={ui.theme}
      style={customColor ? { '--color-background': customColor } : undefined}
    >
      {customImage ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <CloudinaryImage src={customImage} alt="" preset="cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/75" />
        </div>
      ) : null}
      <div className="relative z-10 flex h-full min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
