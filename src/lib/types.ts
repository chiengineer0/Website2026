export type ServiceCategory = 'Residential' | 'Commercial' | 'Panel' | 'EV' | 'Lighting' | 'Industrial' | 'Emergency';

export interface ServiceZone {
  name: string;
  lat: number;
  lng: number;
  detail: string;
}
