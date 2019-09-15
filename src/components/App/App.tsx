import React, { useState, useEffect } from 'react';
import './App.scss';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import styled from 'styled-components';
import Progress from '../Progress/Progress';
import MapSelector from '../MapSelector/MapSelector';
import CustomDialog from '../CustomDialog/CustomDialog';

const files = [
  {
    name: 'Bornholm',
    file: 'bornholm.json'
  }
];

const ButtonToIsometric = styled.button`
  top: 1em;
  right: 1em;
`;
const ButtonToMapSelector = styled.button`
  top: 1em;
  left: 1em;
`;

type Props = {};

export default function App(props: Props) {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [mapData, setMapData] = useState<JSON | undefined>(undefined);
  const [displayMapSelector, setDisplayMapSelector] = useState(false);
  const [mapVisits, setMapVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onMapData = (data: JSON) => {
    setIsLoading(false);
    setMapData(data);
  };

  useEffect(() => {
    setDisplayMapSelector(false);
    setIsLoading(false);
  }, [mapData]);

  useEffect(() => {
    if (displayMapSelector) {
      return () => {
        setMapVisits(mapVisits + 1);
      };
    }
  }, [displayMapSelector, mapVisits]);

  return (
    <>
      {isLoading && <Progress></Progress>}
      {displayMapSelector && mapVisits === 0 && (
        <CustomDialog content="Drag around the map to select the area to render. Click once to start drawing the area. Click once more to end drawing."></CustomDialog>
      )}
      {displayMapSelector && (
        <>
          <ButtonToIsometric
            className="switch-view"
            onClick={() => {
              setDisplayMapSelector(false);
            }}
          >
            Isometric 3d View &gt;
          </ButtonToIsometric>
          <MapSelector
            onFetchDataInit={() => {
              setIsLoading(true);
            }}
            onFetchData={onMapData}
          />
        </>
      )}
      {!displayMapSelector && (
        <>
          <ButtonToMapSelector
            className="switch-view inverted"
            onClick={() => {
              setDisplayMapSelector(true);
            }}
          >
            &lt; Map
          </ButtonToMapSelector>
          <CanvasContainer
            key={`mapData${activeFileIndex}`}
            file={files[activeFileIndex].file}
            data={mapData}
          />
        </>
      )}
    </>
  );
}
