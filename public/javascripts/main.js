function initialize(coords) {
  if (coords === undefined) {
    coords = {lat: 54.6850032, lng: 25.2808794}
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    center: coords,
    zoom: 14
  });
  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: coords,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
  map.setStreetView(panorama);
}