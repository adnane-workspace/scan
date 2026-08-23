export function hasCoordinates(place) {
  return place?.latitude != null && place?.longitude != null;
}

export function mapsHref({ address, latitude, longitude } = {}) {
  if (hasCoordinates({ latitude, longitude })) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  return '';
}

export async function searchAddress(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const results = await response.json();

  return results.map((item) => ({
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    label: String(item.display_name || '').slice(0, 200),
  }));
}

export function geolocationErrorMessage(error) {
  if (error?.code === 1) {
    return 'Le navigateur a refusé la localisation. Autorise-la, ou cherche l’adresse.';
  }

  if (error?.code === 2) {
    return 'Position introuvable. Cherche l’adresse ou clique sur la carte.';
  }

  if (error?.code === 3) {
    return 'La localisation a pris trop de temps. Cherche l’adresse ou clique sur la carte.';
  }

  return 'Position indisponible. Cherche l’adresse ou clique sur la carte.';
}

export async function reverseGeocode(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    return '';
  }

  const data = await response.json();
  return String(data.display_name || '').slice(0, 200);
}
