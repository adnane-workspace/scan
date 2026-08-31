import CloudinaryImage from '../ui/CloudinaryImage.jsx';
import { normalizeMenuUi } from '../../utils/menuUi.js';

export default function PublicMenuFrame({ cafe, className = '', children }) {
  const ui = normalizeMenuUi(cafe?.menuUi);
  const isAppSkin = className.includes('menu-app');
  const customColor = ui.bgMode === 'color' && ui.backgroundColor ? ui.backgroundColor : '';
  const customImage = ui.bgMode === 'image' && ui.backgroundImage ? ui.backgroundImage : '';

  const style = customColor
    ? { '--color-background': customColor }
    : customImage
      ? { '--color-background': 'transparent', background: 'transparent' }
      : undefined;

  const veilClass = customImage
    ? isAppSkin
      ? 'bg-[#0d1b2a]/40'
      : ui.theme === 'dark'
        ? 'bg-background/70'
        : 'bg-background/75'
    : '';

  return (
    <div
      className={`menu-theme-${ui.theme} relative min-h-screen bg-background text-on-surface ${className}`}
      data-menu-theme={ui.theme}
      style={style}
    >
      {customImage ? (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <CloudinaryImage src={customImage} alt="" preset="cover" className="h-full w-full object-cover" />
          {veilClass ? <div className={`absolute inset-0 ${veilClass}`} /> : null}
        </div>
      ) : null}
      <div className="relative z-10 flex h-full min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
