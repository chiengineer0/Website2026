import { useEffect } from 'react';

const zones = [
  { name: 'Downtown Core', lat: 47.6101, lng: -122.336, detail: 'Commercial response under 60 minutes.' },
  { name: 'North District', lat: 47.675, lng: -122.33, detail: 'Residential rewires and EV installations.' },
  { name: 'South Industrial', lat: 47.56, lng: -122.31, detail: 'Industrial controls and service calls.' },
];

export function ServiceAreaMap() {
  useEffect(() => {
    let map: any;
    (async () => {
      const L = await import('leaflet');
      map = L.map('service-map', { scrollWheelZoom: false }).setView([47.61, -122.33], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      for (const zone of zones) {
        L.marker([zone.lat, zone.lng]).addTo(map).bindPopup(`<strong>${zone.name}</strong><br/>${zone.detail}`);
      }

      L.polygon(
        [
          [47.73, -122.44],
          [47.68, -122.23],
          [47.54, -122.19],
          [47.5, -122.42],
        ],
        { color: '#0066FF', fillColor: '#0066FF', fillOpacity: 0.15 },
      ).addTo(map);
    })();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return <div id="service-map" className="h-[380px] w-full rounded-xl border border-white/20" aria-label="Service area map" />;
}
