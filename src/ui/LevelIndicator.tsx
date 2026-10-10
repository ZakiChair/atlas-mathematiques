import { LEVEL_I18N } from '../i18n/localize';
import { useLang } from '../i18n/lang';
import type { MapController } from '../map/controller';

export function LevelIndicator({ level, controller }: { level: number; controller: MapController | null }) {
  const { t } = useLang();
  return (
    <div className="glass px-3 py-2 text-xs text-[#9ba39c]" role="navigation" aria-label={t('level.aria')}>
      {LEVEL_I18N.map((key, i) => (
        <span key={key}>
          {i > 0 && <span className="mx-1 opacity-50">·</span>}
          <button
            className={i === level ? 'text-[#e8c76a] font-bold' : 'hover:text-[#edeee6]'}
            onClick={() => controller?.zoomToLevel(i)}
          >
            {t(key)}
          </button>
        </span>
      ))}
    </div>
  );
}
