document.addEventListener("DOMContentLoaded", function () {
  if (typeof mapboxgl === "undefined") {
    console.error("Mapbox GL JS is not loaded.");
    return;
  }

  mapboxgl.accessToken = mapToken;

  // Coordinates for Delhi (Longitude, Latitude)
  // const coordinates = [77.1025, 28.7041];

  const map = new mapboxgl.Map({
    container: "map", // ID of the container element
    style: "mapbox://styles/mapbox/streets-v11", // Style URL
    center: listing.geometry.coordinates, // Map center coordinates
    zoom: 8, // Zoom level
  });

  // Add a marker to the map
  const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h6>${listing.location}</h6> <p>Location</p> `
      )
    )
    .addTo(map);

  // console.log("Marker added at:", coordinates);
});
