import React, {
  useState,
  useEffect,
  useCallback,
  ReducerAction,
  useReducer,
  Reducer
} from 'react';
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
  /*cursor: not-allowed !important;*/
  /*opacity: 0.5;*/
`;
const ButtonToMapMenu = styled.button`
  top: 1em;
  left: 1em;
`;

type Props = {};

type DisplayType = 'mapSelector' | 'mapMenu' | 'canvas';

type State = {
  activeFile: string;
  mapData: JSON | undefined;
  currentDisplay: DisplayType;
  mapVisits: number;
  isLoading: boolean;
};

type Action =
  | { type: 'setMapData'; mapData: JSON }
  | { type: 'setActiveFile'; activeFile: string }
  | { type: 'initMapDataLoading' }
  | { type: 'setCurrentDisplay'; currentDisplay: DisplayType }
  | { type: 'increaseMapVisits' };

const initState: State = {
  activeFile: config[0].file,
  mapData: undefined,
  currentDisplay: 'canvas',
  mapVisits: 0,
  isLoading: false
};

const reducer = (prevState: State, action: Action) => {
  switch (action.type) {
    case 'setMapData':
      return {
        ...prevState,
        isLoading: false,
        mapData: action.mapData,
        currentDisplay: 'canvas' as DisplayType
        //currentDisplay: 'canvas'
      };
    case 'setActiveFile':
      return {
        ...prevState,
        activeFile: action.activeFile,
        currentDisplay: 'canvas' as DisplayType
      };
    case 'initMapDataLoading':
      return {
        ...prevState,
        isLoading: true
      };
    case 'setCurrentDisplay':
      return {
        ...prevState,
        currentDisplay: action.currentDisplay
      };
    case 'increaseMapVisits':
      return {
        ...prevState,
        mapVisits: prevState.mapVisits + 1
      };
    default:
      return prevState;
  }
};

export default function App(props: Props) {
  useEffect(() => {
    fetch("/data/51.549751017014195,-0.2032470703125,0.17852783203125,0.09403262660602252,40")
  }, [])
  console.log({process})
  // FIXME: to many states here, make a reducer please :) <3
  /*
  const [activeFile, setActiveFile] = useState(config[0].file);
  const [mapData, setMapData] = useState<JSON | undefined>(undefined);
  const [displayMapSelector, setDisplayMapSelector] = useState(false);
  const [displayMapMenu, setDisplayMapMenu] = useState(false);
  const [mapVisits, setMapVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  */

  const [
    { isLoading, mapData, activeFile, currentDisplay, mapVisits },
    dispatch
  ] = useReducer<Reducer<State, Action>>(reducer, initState);

  const onMapDataLoadInit = () => {
    dispatch({ type: 'initMapDataLoading' });
  };

  const onMapData = (data: JSON) => {
    dispatch({ type: 'setMapData', mapData: data });
    //setIsLoading(false);
    //setMapData(data);
  };

  const onChangeDisplay = (display: DisplayType) => () => {
    dispatch({ type: 'setCurrentDisplay', currentDisplay: display });
  };

  /*
  const handleMapMenuClick = useCallback((file) => {
    setActiveFile(file);
    setDisplayMapMenu(false);
    setDisplayMapSelector(false);
  }, []);
  */
  const handleMapMenuClick = (file: string) => {
    dispatch({ type: 'setActiveFile', activeFile: file });
  };
  /*
  useEffect(() => {
    setDisplayMapSelector(false);
    setDisplayMapMenu(false);
    setIsLoading(false);
  }, [mapData]);
*/
  useEffect(() => {
    if (currentDisplay === 'mapSelector') {
      return () => {
        dispatch({ type: 'increaseMapVisits' });
      };
    }
  }, [currentDisplay, mapVisits]);

  return (
    <>
      {isLoading && <Progress />}
      {currentDisplay === 'mapSelector' && mapVisits === 0 && (
        <CustomDialog content="Drag around the map to select the area to render. Click once to start drawing the area. Click once more to end drawing."></CustomDialog>
      )}
      {(currentDisplay === 'mapSelector' || currentDisplay === 'mapMenu') && (
        <ButtonToIsometric
          className="switch-view"
          onClick={onChangeDisplay('canvas')}
        >
          Isometric 3d View &gt;
        </ButtonToIsometric>
      )}
      {currentDisplay === 'mapMenu' && (
        <MapMenu areas={config} onClickCallback={handleMapMenuClick}></MapMenu>
      )}
      {currentDisplay === 'mapSelector' && (
        <MapSelector
          onFetchDataInit={onMapDataLoadInit}
          onFetchData={onMapData}
        />
      )}
      {currentDisplay === 'canvas' && (
        <>
          <ButtonToMapSelector
            className="switch-view inverted"
            onClick={onChangeDisplay('mapSelector')}
          >
            &lt; Map selector
          </ButtonToMapSelector>
          <ButtonToMapMenu
            className="switch-view inverted"
            onClick={onChangeDisplay('mapMenu')}
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
