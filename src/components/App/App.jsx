import React, { Component } from 'react';
import './App.scss';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import MapSelector from '../MapSelector/MapSelector';
import styled from 'styled-components';
import Progress from '../Progress/Progress';

const files = [
  {
    name: 'Lyon (FR)',
    file: 'lyon.json'
  },
  {
    name: 'Grand Canyon',
    file: 'grand_canyon.json'
  },
  {
    name: 'Kilimanjaro',
    file: 'kilimanjaro.json'
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFileIndex: 0,
      mapData: undefined,
      displayMap: false,
      isLoading: false
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
    this.setState({ displayMap: true });
  }

  onMapDataLoadInit() {
    this.setState({ isLoading: true });
  }

  onMapData(data) {
    this.setState({
      mapData: data,
      displayMap: false,
      isLoading: false
    });
  }

  render() {
    return (
      <>
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
