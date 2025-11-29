export type ElevationPoint = {
  lat: number;
  lng: number;
  distance: number;
  elevation: number;
};

export type Marker = {
  distance: number;
  elevation: number;
  name?: string;
}