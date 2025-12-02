# react-route-profile

React component that renders a Google Map route with optional sticky header helper and theming.

## Installation

```bash
npm install react-route-profile
# or
yarn add react-route-profile
# or (preferred)
bun add react-route-profile
```

## Quick start

```tsx
import { RouteMap } from "react-route-profile";
import type { RouteConfig } from "react-route-profile";

const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || "";

const myRoute: RouteConfig = {
  id: "01",
  name: "Sample route",
  center: { lat: 48.9, lng: 20.5 },
  zoomHorizontal: 14,
  zoomVertical: 12,
  geoJson: myGeoJsonObject,
};

<RouteMap apiKey={apiKey} route={myRoute} height="100dvh" />;
```

### Optional: custom theme

```tsx
import type { Theme } from "react-route-profile";

const myTheme: Theme = {
  colors: {
    primary: "rgba(14, 165, 233, 1)",
    primaryMuted: "rgba(14, 165, 233, 0.7)",
    accent: "rgba(132, 204, 22, 1)",
    surface: "rgba(248, 250, 252, 1)",
  },
};

<RouteMap apiKey={apiKey} route={myRoute} theme={myTheme} />;
```

### Optional: sticky header sizing

```tsx
import { useMapHeader } from "react-route-profile";

const { refHeader, refMapContainer, targetHeaderFraction, effectiveHeaderHeight, mapHeight } =
  useMapHeader();

<header ref={refHeader} style={{ height: `${targetHeaderFraction * 100}vh` }}>Header</header>
<div ref={refMapContainer}>
  <RouteMap apiKey={apiKey} route={myRoute} height={mapHeight} />
</div>;
```

### Optional: precompute elevation offline

```bash
npx fetch-elevation --in path/to/route.geojson --out path/to/route.elevation.json --samples 128 --key $GOOGLE_MAPS_API_KEY  # Elevation API must be enabled for this key
# omit --out to overwrite the input file with elevationProfile
```

## API

### RouteMap props

| Prop      | Type             | Description                                            |
| --------- | ---------------- | ------------------------------------------------------ |
| apiKey    | string           | Required Google Maps JS API key.                       |
| route     | RouteConfig      | Route data (center, zooms, geoJson).                   |
| height    | number \| string | Map height (e.g., `520` or `"100dvh"`).                |
| className | string           | Optional wrapper class.                                |
| style     | CSSProperties    | Inline style overrides.                                |
| theme     | Theme            | Optional theme override (colors, marker/dots, layout). |

### RouteConfig

| Field          | Type                           | Description                    |
| -------------- | ------------------------------ | ------------------------------ |
| id             | string                         | Identifier for the route.      |
| name           | string                         | Display name.                  |
| center         | `{ lat: number; lng: number }` | Map center.                    |
| zoomHorizontal | number (optional)              | Zoom when landscape.           |
| zoomVertical   | number (optional)              | Zoom when portrait.            |
| geoJson        | FeatureCollection              | GeoJSON geometry and features. |

### Theme

| Field               | Type   | Description                             |
| ------------------- | ------ | --------------------------------------- |
| colors.primary      | string | Main accent color.                      |
| colors.primaryMuted | string | Softer variant of the primary.          |
| colors.accent       | string | Secondary/accent color for labels.      |
| colors.surface      | string | Background for loader/surfaces.         |
| marker              | object | Marker palette (outer/inner/start/end). |
| dots                | object | Hover/line dot colors.                  |
| map                 | object | Map stroke/marker sizing.               |
| chart               | object | Chart spacing/strokes/ticks.            |
| tooltip             | object | Tooltip background/text/padding.        |
| markerShape         | object | Marker icon/label sizing/offsets.       |

### useMapHeader

Returns helpers to size the map below a sticky header:

- `refHeader`: attach to your header element.
- `refMapContainer`: attach to the map container.
- `targetHeaderFraction`: target header height fraction (based on orientation).
- `effectiveHeaderHeight`: measured or fallback header height (px).
- `mapHeight`: string/number height you can pass to `RouteMap`.

## Notes

- Requires a valid Google Maps JavaScript API key with Maps JavaScript enabled.
- Provide `geoJson` as a FeatureCollection including your route geometry and optional point features for start/finish markers.
