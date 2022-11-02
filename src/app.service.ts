import { Injectable } from '@nestjs/common';

//52.503092195696425, 13.453086954568171

//52.50421326379463, 13.452631446258588

//52.500654870603086, 13.439787646028572

//52.50796806801554, 13.417890450827027

//52.52249803446815, 13.388516252202493

//52.53234126769997, 13.470748300223583

//52.490133616774834, 13.379641160104706

const heroes = [
  { lat: '52.50796806801554', lng: '13.417890450827027', radius: 2000 },
  { lat: '52.52249803446815', lng: '13.388516252202493', radius: 3000 },
  { lat: '52.53234126769997', lng: '13.470748300223583', radius: 3000 },
  { lat: '52.50218186354066', lng: ' 13.45096285498009', radius: 3000 },
];

function calcCrow(coords1, coords2) {
  // var R = 6.371; // km
  const R = 6371000;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function isNear(distance, radius) {
  return distance <= radius;
}

const help = { lat: 52.50429790343473, lng: 13.452538746743118 };
// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
