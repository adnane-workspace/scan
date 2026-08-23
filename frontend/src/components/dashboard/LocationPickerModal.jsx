import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocale } from '../../hooks/useLocale.js';
import MaterialIcon from '../ui/MaterialIcon.jsx';
import { geolocationErrorKey, reverseGeocode, searchAddress } from '../../utils/location.js';

const DEFAULT_CENTER = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;
const PICKED_ZOOM = 16;

export default function LocationPickerModal({ open, latitude, longitude, onClose, onConfirm }) {
  const { t, locale } = useLocale();
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const placeMarkerRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');
  const [statusTone, setStatusTone] = useState('error');

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setStatus('');
    setResults([]);
    setDraft(latitude != null && longitude != null ? { latitude, longitude } : null);

    if (!mapNodeRef.current) {
      return undefined;
    }

    const hasPoint = latitude != null && longitude != null;
    const map = L.map(mapNodeRef.current).setView(
      hasPoint ? [latitude, longitude] : DEFAULT_CENTER,
      hasPoint ? PICKED_ZOOM : DEFAULT_ZOOM,
    );
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    function placeMarker(lat, lng, { fly = false } = {}) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.circleMarker([lat, lng], {
          radius: 10,
          color: '#ffffff',
          weight: 2,
          fillColor: '#9e3d00',
          fillOpacity: 1,
        }).addTo(map);
      }

      if (fly) {
        map.setView([lat, lng], PICKED_ZOOM);
      }

      setDraft({ latitude: lat, longitude: lng });
      setStatus('');
    }

    placeMarkerRef.current = placeMarker;

    if (hasPoint) {
      placeMarker(latitude, longitude);
    }

    map.on('click', (event) => {
      placeMarker(event.latlng.lat, event.latlng.lng);
    });

    function refreshSize() {
      map.invalidateSize();
    }

    const resizeTimer = window.setTimeout(refreshSize, 80);
    window.addEventListener('resize', refreshSize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', refreshSize);
      placeMarkerRef.current = null;
      markerRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, [open, latitude, longitude]);

  if (!open) {
    return null;
  }

  function applyPosition(lat, lng) {
    placeMarkerRef.current?.(lat, lng, { fly: true });
  }

  function requestPosition(highAccuracy) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 12000 : 20000,
        maximumAge: highAccuracy ? 0 : 120000,
      });
    });
  }

  async function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setStatusTone('error');
      setStatus(t('location.noGeo'));
      return;
    }

    if (!window.isSecureContext) {
      setStatusTone('error');
      setStatus(t('location.needHttps'));
      return;
    }

    setLocating(true);
    setStatus('');

    try {
      let position;

      try {
        position = await requestPosition(true);
      } catch {
        position = await requestPosition(false);
      }

      applyPosition(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      setStatusTone('error');
      setStatus(t(geolocationErrorKey(error)));
    } finally {
      setLocating(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    const value = query.trim();

    if (value.length < 3) {
      setStatusTone('error');
      setStatus(t('location.minChars'));
      return;
    }

    setSearching(true);
    setStatus('');

    try {
      const found = await searchAddress(value, locale);
      setResults(found);

      if (found.length === 0) {
        setStatusTone('error');
        setStatus(t('location.none'));
        return;
      }

      applyPosition(found[0].latitude, found[0].longitude);
    } catch {
      setStatusTone('error');
      setStatus(t('location.searchFail'));
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirm() {
    if (!draft) {
      return;
    }

    let address = '';

    try {
      address = await reverseGeocode(draft.latitude, draft.longitude);
    } catch {
      address = '';
    }

    onConfirm({
      latitude: draft.latitude,
      longitude: draft.longitude,
      address,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-4 lg:p-8">
      <button type="button" className="absolute inset-0 bg-on-surface/40" aria-label={t('common.close')} onClick={onClose} />
      <section className="relative z-10 flex h-[100dvh] w-full flex-col bg-surface-container-lowest p-4 shadow-xl sm:h-[90vh] sm:max-w-6xl sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-headline-md font-semibold text-on-surface">{t('location.title')}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {t('location.hint')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
            aria-label={t('common.close')}
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-3 flex shrink-0 gap-2">
          <div className="relative min-w-0 flex-1">
            <MaterialIcon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('location.searchPlaceholder')}
              className="w-full rounded-xl bg-surface-container-low py-3 pr-4 pl-11 text-on-surface outline-none ring-1 ring-transparent focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface disabled:opacity-60"
          >
            {searching ? t('location.searching') : t('location.search')}
          </button>
        </form>

        {results.length > 1 ? (
          <ul className="mb-3 max-h-28 shrink-0 overflow-y-auto rounded-xl bg-surface-container-low">
            {results.map((item) => (
              <li key={`${item.latitude}-${item.longitude}-${item.label}`}>
                <button
                  type="button"
                  onClick={() => applyPosition(item.latitude, item.longitude)}
                  className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-high"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div ref={mapNodeRef} className="location-picker-map overflow-hidden bg-surface-container-high" />

        {status ? (
          <p
            className={`mt-3 shrink-0 text-sm ${statusTone === 'error' ? 'text-error' : 'text-on-surface-variant'}`}
          >
            {status}
          </p>
        ) : null}

        <div className="mt-4 flex shrink-0 flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface disabled:opacity-60"
          >
            <MaterialIcon name="my_location" className="text-[20px]" />
            {locating ? t('location.locating') : t('location.myLocation')}
          </button>
          <button
            type="button"
            disabled={!draft}
            onClick={handleConfirm}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary disabled:opacity-50"
          >
            {t('location.confirm')}
          </button>
        </div>
      </section>
    </div>
  );
}
