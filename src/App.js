import {
  EventDirection,
  WidgetApi,
  WidgetEventCapability,
} from "matrix-widget-api";
import qs from "qs";
import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const widgetId = qs.parse(document.location.search.substring(1)).widgetId; // if you know the widget ID, supply it.
    const api = new WidgetApi(widgetId);

    // Read all room member events
    api.requestCapability("org.matrix.msc2762.timeline:*");
    api.requestCapability(
      WidgetEventCapability.forStateEvent(
        EventDirection.Receive,
        "m.room.member"
      ).raw
    );

    // Start the messaging
    api.start();

    api.on("action:send_event", (ev) => {
      const event = ev.detail.data;
      setLiveEvents((prev) => [event, ...prev]);
    });
  }, []);

  return (
    <div className="App">
      <h2>Received Events</h2>
      <ul>
        {liveEvents.map((ev) => (
          <li>
            {ev.content.displayname} ({ev.content.membership})
          </li>
        ))}
      </ul>
    </div>
  );
}
