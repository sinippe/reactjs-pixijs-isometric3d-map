import React from 'react';
import { TileLayer, Rectangle, PathProps } from 'react-leaflet';
import { LatLngLiteral, LatLngBoundsExpression } from 'leaflet';
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
  lat?: number;
  lng?: number;
  areas: IMapAreaFile[];
  onClickCallback: (file: string) => void;
};

const defaultPosition: LatLngLiteral = {
  lat: 51.5,
  lng: -0.09
};

const getBoundsFromMapArea = (area: IMapArea): LatLngBoundsExpression => {
  return [
    [area.latitude, area.longitude],
    [area.latitude - area.height, area.longitude + area.width]
  ];
};

export default function MapMenu(props: MapMenuProps) {
  const position: LatLngLiteral = {
    lat: props.lat ? props.lat : defaultPosition.lat,
    lng: props.lng ? props.lng : defaultPosition.lng
  };

  const pathProps: PathProps = {
    fillColor: '#ffffff',
    stroke: true,
    weight: 4,
    color: '#d03030'
  };

  return (
    <>
      <CustomMap className="map-component" center={position} zoom={5}>
        {props.areas.map((area, index) => (
          <Rectangle
            key={`rectangle_${index}`}
            bounds={getBoundsFromMapArea(area)}
            {...pathProps}
            onClick={() => {
              props.onClickCallback.call(null, area.file);
            }}
          ></Rectangle>
        ))}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </CustomMap>
    </>
  );
}
