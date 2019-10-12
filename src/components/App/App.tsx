import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import './App.scss';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Progress from '../Progress/Progress';
import MapSelector from '../MapSelector/MapSelector';
import CustomDialog from '../CustomDialog/CustomDialog';
import MapMenu from '../MapMenu/MapMenu';
import config from '../../config/infos.json';

const ButtonToIsometric = styled.button`
  top: 1em;
  right: 1em;
`;
const ButtonToMapSelector = styled.button`
  top: 4em;
  left: 1em;
  cursor: not-allowed !important;
  opacity: 0.5;
`;
const ButtonToMapMenu = styled.button`
  top: 1em;
  left: 1em;
`;

type Props = {};

export default function App(props: Props) {
  const [activeFile, setActiveFile] = useState(config[0].file);
  const [mapData, setMapData] = useState<JSON | undefined>(undefined);
  const [displayMapSelector, setDisplayMapSelector] = useState(false);
  const [displayMapMenu, setDisplayMapMenu] = useState(false);
  const [mapVisits, setMapVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onMapData = (data: JSON) => {
    setIsLoading(false);
    setMapData(data);
  };

  const handleMapMenuClick = useCallback(file => {
    setActiveFile(file);
    setDisplayMapMenu(false);
    setDisplayMapSelector(false);
  }, []);

  useEffect(() => {
    setDisplayMapSelector(false);
    setDisplayMapMenu(false);
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
      {(displayMapSelector || displayMapMenu) && (
        <ButtonToIsometric
          className="switch-view"
          onClick={() => {
            setDisplayMapSelector(false);
            setDisplayMapMenu(false);
          }}
        >
          Isometric 3d View &gt;
        </ButtonToIsometric>
      )}
      {displayMapMenu && (
        <MapMenu areas={config} onClickCallback={handleMapMenuClick}></MapMenu>
      )}
      {displayMapSelector && (
        <MapSelector
          onFetchDataInit={() => {
            setIsLoading(true);
          }}
          onFetchData={onMapData}
        />
      )}
      {!displayMapSelector && !displayMapMenu && (
        <>
          <ButtonToMapSelector
            className="switch-view inverted"
            /*onClick={() => {
              setDisplayMapSelector(true);
            }}*/
          >
            &lt; Map selector
          </ButtonToMapSelector>
          <ButtonToMapMenu
            className="switch-view inverted"
            onClick={() => {
              setDisplayMapMenu(true);
            }}
          >
            &lt; Map
          </ButtonToMapMenu>
          <CanvasContainer
            key={`mapData${activeFile}`}
            file={activeFile}
            data={mapData}
          />
        </>
      )}
    </>
  );
}
