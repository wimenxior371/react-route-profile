import styles from "./App.module.css";

export const Usage = () => (
  <main className={styles.content}>
    <h3>Overview</h3>
    <p>
      A minimal React component that renders a Google Maps view for a route,
      using your
      <code className={styles.inlineCode}>Google Maps JavaScript API key</code>.
      Point it at your own route data and it will plot the geometry with the
      markers.
    </p>

    <h3>Setup & usage</h3>
    <ol className={styles.steps}>
      <li>
        Set your Google Maps API key via the{" "}
        <code className={styles.inlineCode}>apiKey</code> prop.
        <pre className={styles.codeBlock}>
          <code>
            {`const apiKey = process.env.MAPS_KEY || "";

<RouteMap apiKey={apiKey} route={myRoute} />`}
          </code>
        </pre>
      </li>
      <li>
        Route Configuration - Build a{" "}
        <code className={styles.inlineCode}>RouteDetail</code> with{" "}
        <code
          className={styles.inlineCode}
        >{`{ id, name, center, zoomHorizontal?, zoomVertical?, geoJson }`}</code>
        .
        <pre className={styles.codeBlock}>
          <code>
            {`const myRoute: RouteDetail = {
  id: "01",
  name: "Sample route",
  center: { lat: 48.9, lng: 20.5 },
  zoomHorizontal: 14,
  zoomVertical: 12,
  geoJson: myGeoJsonObject,
};`}
          </code>
        </pre>
      </li>
      <li>
        Pass that <code className={styles.inlineCode}>RouteDetail</code> to{" "}
        <code className={styles.inlineCode}>{`<RouteMap route=... />`}</code>.
        <pre className={styles.codeBlock}>
          <code>
            {`<RouteMap
  apiKey={apiKey}
  route={myRoute}
  height="100vh"
/>`}
          </code>
        </pre>
      </li>
      <li>
        The <code className={styles.inlineCode}>geoJson</code> should be a
        FeatureCollection that includes your route geometry and optional point
        features ( first / last markers, etc.).
        <br />
        You can convert a GPX file to GeoJSON by using{" "}
        <a href="https://mygeodata.cloud/converter/gpx-to-geojson">
          online converters
        </a>
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
      </li>
      <li>
        Optionally adjust <code className={styles.inlineCode}>height</code>,{" "}
        <code className={styles.inlineCode}>className</code>, or{" "}
        <code className={styles.inlineCode}>style</code> to fit your layout.
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
      </li>
      <li>
        (Optional) Use <code className={styles.inlineCode}>useMapHeader</code>{" "}
        to size the map under a sticky header.
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
      </li>
    </ol>

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
          <td>RouteDetail</td>
          <td>Route data to render (center, zooms, geoJson).</td>
        </tr>
        <tr>
          <td>height</td>
          <td>number | string</td>
          <td>Map height (e.g., 520 or "100vh").</td>
        </tr>
        <tr>
          <td>className</td>
          <td>string</td>
          <td>Optional wrapper class.</td>
        </tr>
        <tr>
          <td>style</td>
          <td>CSSProperties</td>
          <td>Inline style overrides.</td>
        </tr>
      </tbody>
    </table>

    <h4>RouteDetail</h4>
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
  </main>
);
