export interface RouteConfig {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  zoomHorizontal?: number;
  zoomVertical?: number;
  geoJson: object;
  surface?: Array<{segment: [number, number], type: SurfaceType}>; 
}

export enum SurfaceType {
  Asphalt = "asphalt",
  Compacted = "compacted",
  Concrete = "concrete",
  Natural = "natural",
  Penetrated = "penetrated",
}
