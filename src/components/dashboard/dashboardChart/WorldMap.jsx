// components/dashboardChart/WorldMap.tsx
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const WorldMap = () => {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const countryColors = {
    China: "#FFCCCB",
    Vietnam: "#ADD8E6",
    Brazil: "#90EE90",
  };

  const handleMouseEnter = (event, countryName) => {
    setTooltip(countryName);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleCountryClick = (countryName) => {
    console.log(countryName);
  };

  return (
    <>
      <div className="summary_header">
        <p>Sales Mapping by Country</p>
      </div>
      <div className="map-container">
        <ComposableMap>
          <Geographies geography={"/geoFeature.json"}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;

                // Determine the fill color based on country code
                const fillColor = countryColors[countryName] || "#ECECEC";
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: fillColor, outline: "none" },
                      hover: { fill: "#FFD700", outline: "none" }, // Change color on hover (optional)
                      pressed: { fill: "#FF6347", outline: "none" }, // Change color on click (optional)
                    }}
                    onClick={() => handleCountryClick(countryName)}
                    onMouseEnter={(event) =>
                      handleMouseEnter(event, countryName)
                    }
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip && (
          <div
            className="tooltip"
            style={{
              position: "absolute",
              top: tooltipPosition.y + 10, // Position tooltip slightly below the cursor
              left: tooltipPosition.x + 10, // Position tooltip slightly to the right of the cursor
              backgroundColor: "#333",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "4px",
              pointerEvents: "none", // Allow hover interactions with countries without interference
              fontSize: "0.9rem",
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    </>
  );
};

export default WorldMap;
