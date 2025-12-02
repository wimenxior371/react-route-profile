import styles from "./App.module.css";

export const Usage = () => (
  <main className={styles.content}>
    <section>
      <h3>Overview</h3>
      <p>
        A minimal React component that renders a Google Maps view for a route,
        using your
        <code className={styles.inlineCode}>
          Google Maps JavaScript API key
        </code>
        . Point it at your own route data and it will plot the geometry with the
        markers.
      </p>
    </section>

    <section>
      <h3>Setup & usage</h3>
      <div>
        1. Set your Google Maps API key via the{" "}
        <code className={styles.inlineCode}>apiKey</code> prop.
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || "";

<RouteMap apiKey={apiKey} route={myRoute} />`}
        </code>
      </pre>

      <div>
        2. Route Configuration - Build a{" "}
        <code className={styles.inlineCode}>RouteConfig</code> with{" "}
        <code
          className={styles.inlineCode}
        >{`{ id, name, center, zoomHorizontal?, zoomVertical?, geoJson }`}</code>
        .
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`const myRoute: RouteConfig = {
  id: "01",
  name: "Sample route",
  center: { lat: 48.9, lng: 20.5 },
  zoomHorizontal: 14,
  zoomVertical: 12,
  geoJson: myGeoJsonObject,
};`}
        </code>
      </pre>

      <div>
        3. Pass that <code className={styles.inlineCode}>RouteConfig</code> to{" "}
        <code className={styles.inlineCode}>{`<RouteMap route=... />`}</code>.
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`<RouteMap
  apiKey={apiKey}
  route={myRoute}
  height="100dvh"
/>`}
        </code>
      </pre>

      <div>
        4. The <code className={styles.inlineCode}>geoJson</code> should be a
        FeatureCollection that includes your route geometry and optional point
        features ( first / last markers, etc.).
        <br />
        You can convert a GPX file to GeoJSON by using{" "}
        <a href="https://mygeodata.cloud/converter/gpx-to-geojson">
          online converters
        </a>
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`const myGeoJsonObject = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Start", first: true }, geometry: { type: "Point", coordinates: [20.5, 48.9] } },
    { type: "Feature", properties: { name: "Finish", last: true }, geometry: { type: "Point", coordinates: [20.6, 48.95] } },
    // LineString for the route...
  ]
};`}
        </code>
      </pre>

      <div>
        (Optional) Adjust <code className={styles.inlineCode}>height</code>,{" "}
        <code className={styles.inlineCode}>className</code>, or{" "}
        <code className={styles.inlineCode}>style</code> to fit your layout.
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`<RouteMap
  apiKey={apiKey}
  route={myRoute}
  height="80vh"
  className="my-map"
  style={{ borderRadius: 12 }}
/>`}
        </code>
      </pre>

      <div>
        (Optional) Provide your own theme overrides (colors, marker, dots,
        layout under <code className={styles.inlineCode}>routeMap</code> for
        map/chart/tooltip/markerShape).
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`import type { Theme } from "react-route-profile";

const myTheme: Theme = {
  colors: {
    primary: "rgba(14, 165, 233, 1)",
    primaryMuted: "rgba(14, 165, 233, 0.7)",
    accent: "rgba(132, 204, 22, 1)",
    surface: "rgba(248, 250, 252, 1)",
  },
  marker: { outer: "#84CC16", inner: "#F8FAFC" },
  dots: { mapActive: "#84CC16" },
  routeMap: {
    map: { markerSize: 44, strokeWeight: 8 },
    chart: { lineStrokeWidth: 2, yAxisWidth: 72 },
    tooltip: { background: "rgba(15,23,42,0.95)" },
    markerShape: { size: 30, text: { fontSize: 11 } },
  },
};

<RouteMap apiKey={apiKey} route={myRoute} height="80vh" theme={myTheme} />`}
        </code>
      </pre>

      <div>
        (Optional) Precompute elevation once instead of fetching in the browser:
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`npx fetch-elevation --in path/to/route.geojson --out path/to/route.elevation.json --samples 128 --key $GOOGLE_MAPS_API_KEY  # ensure Elevation API is enabled for this key
# if you omit --out, the input file will be overwritten with elevationProfile`}
        </code>
      </pre>

      <div>
        (Optional) Use <code className={styles.inlineCode}>useMapHeader</code>{" "}
        to size the map under a sticky header.
      </div>
      <pre className={styles.codeBlock}>
        <code>
          {`const { refHeader, refMapContainer, targetHeaderFraction, effectiveHeaderHeight, mapHeight } = useMapHeader();

<header ref={refHeader} style={{ height: \`\${targetHeaderFraction * 100}vh\` }}>
  Header
</header>
<div ref={refMapContainer}>
  <RouteMap apiKey={apiKey} route={myRoute} height={mapHeight} />
</div>`}
        </code>
      </pre>
    </section>

    <section>
      <h3>API</h3>

      <h4>RouteMap</h4>
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>apiKey</td>
            <td>string</td>
            <td>Required Google Maps JS API key.</td>
          </tr>
          <tr>
            <td>route</td>
            <td>RouteConfig</td>
            <td>Route data to render (center, zooms, geoJson).</td>
          </tr>
          <tr>
            <td>height?</td>
            <td>number | string</td>
            <td>Map height (e.g., 520 or "100dvh").</td>
          </tr>
          <tr>
            <td>className?</td>
            <td>string</td>
            <td>Optional wrapper class.</td>
          </tr>
          <tr>
            <td>style?</td>
            <td>CSSProperties</td>
            <td>Inline style overrides.</td>
          </tr>
          <tr>
            <td>theme?</td>
            <td>Theme</td>
            <td>
              Optional theme override (colors, marker/dots, routeMap layout)
              used by map, chart, and loader.
            </td>
          </tr>
        </tbody>
      </table>

      <h4>RouteConfig</h4>
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>id</td>
            <td>string</td>
            <td>Identifier for the route.</td>
          </tr>
          <tr>
            <td>name</td>
            <td>string</td>
            <td>Display name.</td>
          </tr>
          <tr>
            <td>center</td>
            <td>{`{ lat: number; lng: number }`}</td>
            <td>Map center.</td>
          </tr>
          <tr>
            <td>zoomHorizontal?</td>
            <td>number</td>
            <td>Zoom when landscape.</td>
          </tr>
          <tr>
            <td>zoomVertical?</td>
            <td>number</td>
            <td>Zoom when portrait.</td>
          </tr>
          <tr>
            <td>geoJson</td>
            <td>FeatureCollection</td>
            <td>GeoJSON geometry and features.</td>
          </tr>
        </tbody>
      </table>

      <h4>Theme</h4>
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>colors?.primary?</td>
            <td>string</td>
            <td>Main accent color.</td>
          </tr>
          <tr>
            <td>colors?.primaryMuted?</td>
            <td>string</td>
            <td>Softer variant of the primary.</td>
          </tr>
          <tr>
            <td>colors?.accent?</td>
            <td>string</td>
            <td>Secondary/accent color for labels.</td>
          </tr>
          <tr>
            <td>colors?.surface?</td>
            <td>string</td>
            <td>Background color for Loader/surfaces.</td>
          </tr>
          <tr>
            <td>marker?</td>
            <td>{`{ outer?: string; inner?: string; startInner?: string; finishInner?: string }`}</td>
            <td>Marker palette.</td>
          </tr>
          <tr>
            <td>dots?</td>
            <td>{`{ mapActive?: string; chart?: string; chartActive?: string }`}</td>
            <td>Hover/line dot colors.</td>
          </tr>
          <tr>
            <td>map?</td>
            <td>{`{ strokeWeight?, markerSize?, markerLabelFontSize?, markerLabelFontWeight?, hoverMarkerScale? }`}</td>
            <td>Map line/marker sizing.</td>
          </tr>
          <tr>
            <td>chart?</td>
            <td>{`{ margin?, gridStroke?, axisStroke?, cursorStroke?, yAxisWidth?, lineStrokeWidth?, dotRadius?, activeDotRadius?, referenceDotRadius? ... }`}</td>
            <td>Chart spacing and strokes.</td>
          </tr>
          <tr>
            <td>tooltip?</td>
            <td>{`{ background?, textColor?, padding?, borderRadius? }`}</td>
            <td>Tooltip styling.</td>
          </tr>
          <tr>
            <td>markerShape?</td>
            <td>{`{ size?, lift?, text?: { fontSize?, fontWeight?, letterSpacing?, xOffset?, lineHeight?, startLiftPerWord? } }`}</td>
            <td>Marker label placement and sizing.</td>
          </tr>
        </tbody>
      </table>

      <h4>useMapHeader</h4>
      <table className={styles.apiTable}>
        <thead>
          <tr>
            <th>Return</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>refHeader</td>
            <td>Ref&lt;HTMLDivElement&gt;</td>
            <td>Attach to the sticky header element.</td>
          </tr>
          <tr>
            <td>refMapContainer</td>
            <td>Ref&lt;HTMLDivElement&gt;</td>
            <td>Attach to the map container.</td>
          </tr>
          <tr>
            <td>targetHeaderFraction</td>
            <td>number</td>
            <td>Header height fraction (0.25 mobile, 0.15 desktop).</td>
          </tr>
          <tr>
            <td>effectiveHeaderHeight</td>
            <td>number</td>
            <td>Measured or fallback header height (px).</td>
          </tr>
          <tr>
            <td>mapHeight</td>
            <td>number | string</td>
            <td>Height to pass to RouteMap.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
);
