import React, { Component } from 'react';
import './App.scss';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import MapSelector from '../MapSelector/MapSelector';
import styled from 'styled-components';
import Progress from '../Progress/Progress';
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
const ButtonToMap = styled.button`
  top: 1em;
  left: 1em;
`;

type Props = {};
type State = {
  activeFileIndex: number;
  mapData: JSON | undefined;
  displayMap: boolean;
  isLoading: boolean;
  mapFirstVisit: boolean;
  displayMapWarning: boolean;
};

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeFileIndex: 0,
      mapData: undefined,
      displayMap: false,
      isLoading: false,
      mapFirstVisit: true,
      displayMapWarning: true
    };

    this.displayIsometric3dView = this.displayIsometric3dView.bind(this);
    this.displayMap = this.displayMap.bind(this);
    this.onMapDataLoadInit = this.onMapDataLoadInit.bind(this);
    this.onMapData = this.onMapData.bind(this);
  }

  displayIsometric3dView() {
    this.setState({ displayMap: false });
  }

  displayMap() {
    const newState: any = { displayMap: true };
    if (this.state.mapFirstVisit) {
      newState.mapFirstVisit = false;
    } else if (this.state.displayMapWarning) {
      newState.displayMapWarning = false;
    }
    this.setState(newState);
  }

  onMapDataLoadInit() {
    this.setState({ isLoading: true });
  }

  onMapData(data: JSON) {
    this.setState({
      mapData: data,
      displayMap: false,
      isLoading: false
    });
  }

  render() {
    return (
      <>
        {this.state.displayMap && this.state.displayMapWarning && (
          <CustomDialog content="Drag around the map to select the area to render. Click once to start drawing the area. Click once more to end drawing."></CustomDialog>
        )}
        {this.state.isLoading && <Progress></Progress>}
        {this.state.displayMap && (
          <>
            <ButtonToIsometric
              className="switch-view"
              onClick={this.displayIsometric3dView}
            >
              Isometric 3d View &gt;
            </ButtonToIsometric>
            <MapSelector
              onFetchDataInit={this.onMapDataLoadInit}
              onFetchData={this.onMapData}
            />
          </>
        )}
        {!this.state.displayMap && (
          <>
            <ButtonToMap
              className="switch-view inverted"
              onClick={this.displayMap}
            >
              &lt; Map
            </ButtonToMap>
            <CanvasContainer
              key={`mapData${this.state.activeFileIndex}`}
              file={files[this.state.activeFileIndex].file}
              data={this.state.mapData}
            />
          </>
        )}
      </>
    );
  }
}

export default App;
