import React from 'react';
import { TileLayer, Marker } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';
import CustomMap from '../CustomMap/CustomMap';

interface IMapArea {
  latitude: number;
  longitude: number;
  width: number;
  height: number;
}

interface IMapAreaFile extends IMapArea {
  file: string;
}

type MapMenuProps = {
  lat: number | undefined;
  lng: number | undefined;
  areas: IMapAreaFile[];
  onClickCallback: (file: string) => void;
};

const defaultPosition: LatLngLiteral = {
  lat: 51.5,
  lng: -0.09
};

export default function MapMenu(props: MapMenuProps) {
  const position: LatLngLiteral = {
    lat: props.lat ? props.lat : defaultPosition.lat,
    lng: props.lng ? props.lng : defaultPosition.lng
  };

  const getAreaCenterPoint = (area: IMapArea): LatLngLiteral => {
    return {
      lat: area.latitude + area.height / 2,
      lng: area.longitude + area.width / 2
    };
  };

  return (
    <>
      <CustomMap className="map-component" center={position} zoom={5}>
        {props.areas.map((area, index) => (
          <Marker
            key={`marker_${index}`}
            position={getAreaCenterPoint(area)}
            onClick={() => {
              props.onClickCallback.call(null, area.file);
            }}
          ></Marker>
        ))}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </CustomMap>
    </>
  );
}
