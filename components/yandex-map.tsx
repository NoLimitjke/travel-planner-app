'use client';

import { useEffect, useRef } from 'react';

type Location = {
  lat: number;
  lng: number;
  locationTitle: string;
};

type YandexMapProps = {
  locations: Location[];
  zoom?: number;
  width?: string;
  height?: string;
};

declare global {
  interface Window {
    ymaps: any;
  }
}

let yandexMapsLoadingPromise: Promise<void> | null = null;

function loadYandexMaps(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.ymaps) {
    return new Promise((resolve) => window.ymaps.ready(resolve));
  }

  if (!yandexMapsLoadingPromise) {
    yandexMapsLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(resolve);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return yandexMapsLoadingPromise;
}

export default function YandexMap({
  locations,
  zoom = 10,
  width = '100%',
  height = '400px',
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Универсальная функция перерисовки маркеров и центрирования
  const renderMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map || !window.ymaps) return;

    // Удаляем старые маркеры
    markersRef.current.forEach((m) => map.geoObjects.remove(m));
    markersRef.current = [];

    if (!locations.length) return;

    // Добавляем новые маркеры
    locations.forEach((loc, index) => {
      const placemark = new window.ymaps.Placemark(
        [loc.lat, loc.lng],
        { balloonContent: loc.locationTitle },
        { preset: index === 0 ? 'islands#redIcon' : 'islands#blueIcon' },
      );

      map.geoObjects.add(placemark);
      markersRef.current.push(placemark);
    });

    // Центрирование
    if (locations.length === 1) {
      map.setCenter([locations[0].lat, locations[0].lng], 7);
    } else {
      const bounds = map.geoObjects.getBounds();
      if (bounds) {
        map.setBounds(bounds, {
          checkZoomRange: true,
          zoomMargin: 80,
          maxZoom: 7,
        });
      }
    }
  };

  // 1️⃣ Инициализация карты — ОДИН РАЗ
  useEffect(() => {
    let destroyed = false;

    loadYandexMaps().then(() => {
      if (destroyed || !mapRef.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.751574, 37.617698],
        zoom,
        controls: ['zoomControl', 'fullscreenControl'],
      });

      map.container.fitToViewport();

      mapInstanceRef.current = map;

      // 🔥 СРАЗУ рисуем маркеры при создании карты
      renderMarkers();
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2️⃣ Обновление маркеров при изменении locations
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  return <div ref={mapRef} style={{ width, height }} />;
}
