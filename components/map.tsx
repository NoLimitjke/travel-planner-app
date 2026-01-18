import { Location } from '@/app/generated/client';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React from 'react';
import YandexMap from './yandex-map';

interface MapProps {
  itineraries: Location[];
}

export default function Map({ itineraries }: MapProps) {
  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 55.751574, lng: 37.617698 };

  return (
    <YandexMap
      locations={itineraries.map((location) => ({
        lat: location.lat,
        lng: location.lng,
        locationTitle: location.locationTitle,
      }))}
      zoom={10}
    />
  );
}

// 2 34 55 https://www.youtube.com/watch?v=j7Qu65rUcsY&t=1738s
