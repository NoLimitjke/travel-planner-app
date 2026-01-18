type GeoResult = {
  country: string | null;
  formattedAddress: string | null;
  raw?: any;
};

export async function getCountryFromCoordinates(lat: number, lng: number): Promise<GeoResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  const res = await fetch(url, {
    headers: {
      // Nominatim требует User-Agent
      'User-Agent': 'travel-planner-app',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch geolocation');
  }

  const data = await res.json();

  return {
    country: data.address?.country ?? null,
    formattedAddress: data.display_name ?? null,
    raw: data,
  };
}
