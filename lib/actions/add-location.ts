'use server';

import { auth } from '@/auth';
import { prisma } from '../prisma';
import { redirect } from 'next/navigation';

async function geocodeAddress(address: string) {
  const apiKey = process.env.YANDEX_MAPS_API_KEY!;
  if (!apiKey) throw new Error('API ключ не настроен');

  const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encodeURIComponent(address)}&format=json&results=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  console.log('Yandex Geocode response:', JSON.stringify(data, null, 2)); // Лог для отладки

  if (!data.response?.GeoObjectCollection) {
    throw new Error(`Нет GeoObjectCollection. Response: ${JSON.stringify(data)}`);
  }

  const featureMember = data.response.GeoObjectCollection.featureMember;
  if (!featureMember || featureMember.length === 0) {
    throw new Error(`Адрес "${address}" не найден`);
  }

  const place = featureMember[0].GeoObject;
  if (!place.Point?.pos) {
    throw new Error('Нет координат в первом результате');
  }

  const [lng, lat] = place.Point.pos.split(' ');
  return { lat: parseFloat(lat), lng: parseFloat(lng) };
}

export async function addLocation(tripId: string, formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error('Not auth');
  }

  const address = formData.get('address')?.toString();
  if (!address) {
    throw new Error('Missing address');
  }

  // ... твоя логика geocodeAddress ...
  const { lat, lng } = await geocodeAddress(address);

  console.log('tripId =', tripId);

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId, // Теперь это просто строка, переданная аргументом
      order: count,
    },
  });

  // Redirect должен быть ПОСЛЕ всех операций и ВНЕ try/catch (если он есть)
  redirect(`/trips/${tripId}`);
}
