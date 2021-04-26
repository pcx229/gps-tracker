import { icon, LatLng } from "leaflet";
import { Marker } from "react-leaflet";

export enum MarkerColor{ BLUE = "blue", RED = "red", PURPLE = "purple", GREEN = "green" }

export default function ColoredMarker({location, color, children} : {location?: LatLng, color?: MarkerColor, children?: JSX.Element }) {

  if(!color)
    color = MarkerColor.BLUE
  
  var markerIcon = icon({
      iconUrl: `${process.env.PUBLIC_URL}/marker/${color}-marker-icon.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -30]
  });

  if(!location)
    return null 

  return (
    <Marker position={location} icon={markerIcon}>
      { children }
    </Marker>
  )
}
