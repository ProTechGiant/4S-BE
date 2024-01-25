import { CoordinatesPoints } from "../interfaces/point.interface";

export const isPointInsidePolygon = (point: CoordinatesPoints, coordinates: CoordinatesPoints[]) => {
  let inside = false;
  for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
    const intersect =
      coordinates[i].latitude > point.latitude !== coordinates[j].latitude > point.latitude &&
      point.longitude < ((coordinates[j].longitude - coordinates[i].longitude) * (point.latitude - coordinates[i].latitude)) / (coordinates[j].latitude - coordinates[i].latitude) + coordinates[i].longitude;

    if (intersect) inside = !inside;
  }
  return inside;
};
