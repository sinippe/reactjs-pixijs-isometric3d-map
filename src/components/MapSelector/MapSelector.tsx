import React, { Component, createRef } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
import AreaSelector from '../AreaSelector/AreaSelector';
import 'leaflet/dist/leaflet.css';

// TODO: change state in order to have multiple steps: frameDisabled, frameEnabled, selectScale (steps), getData
// TODO: add a slider when on state "selectScale (steps)"
// TODO: add a bouton "get data"
type Props = {
  onFetchDataInit?: () => void;
  onFetchDataError?: (error: string) => void;
  onFetchData: (data: JSON) => void;
};

type State = {
  lat: number;
  lng: number;
  zoom: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  frameEnabled: boolean;
  frameReady: boolean;
  mapHeight: number;
};

interface IMapArea {
  lat: number;
  lng: number;
  width: number;
  height: number;
}

export default class MapSelector extends Component<Props, State> {
  private map: React.RefObject<Map>;
  private mapArea: IMapArea;

  constructor(props: any) {
    super(props);

    this.map = createRef();
    this.mapArea = {
      lat: 0,
      lng: 0,
      width: 0,
      height: 0
    };

    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 5,
      frameX: 0,
      frameY: 0,
      frameWidth: 0,
      frameHeight: 0,
      frameEnabled: false,
      frameReady: false,
      mapHeight: 600
    };

    this.handleClickLeaflet = this.handleClickLeaflet.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.updateStateAfterClick = this.updateStateAfterClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  addMouseMoveHandler(add: boolean = true) {
    if (add) {
      window.addEventListener('mousemove', this.handleMouseMove);
    } else {
      window.removeEventListener('mousemove', this.handleMouseMove);
    }
  }

  handleClickLeaflet(event: LeafletMouseEvent) {
    this.updateStateAfterClick(
      event.containerPoint.x,
      event.containerPoint.y,
      event.latlng.lat,
      event.latlng.lng
    );
    this.addMouseMoveHandler(this.state.frameEnabled && !this.state.frameReady);
  }

  handleMouseMove(event: MouseEvent) {
    const { frameX, frameY } = this.state;
    const frameWidth = event.clientX - frameX;
    const frameHeight = event.clientY - frameY;
    this.setState({
      frameWidth,
      frameHeight
    });
  }

  handleResize() {
    this.setState({ mapHeight: window.innerHeight });
  }

  fetchDataInit() {
    if (this.props.onFetchDataInit) {
      this.props.onFetchDataInit.call(this);
    }
  }

  fetchDataError(error: string) {
    if (this.props.onFetchDataError) {
      this.props.onFetchDataError.call(this, error);
    }
  }

  fetchData(area: IMapArea) {
    const { lat, lng, width, height } = area;
    this.fetchDataInit();
    const url = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/data/${lat},${lng},${width},${height},40`;
    fetch(url)
      .then(async response => {
        const json = await response.json();
        this.props.onFetchData.call(this, json);
      })
      .catch((error: Error) => {
        console.log(`Error fetching data: ${error.message}`);
        this.fetchDataError(error.message);
      });
  }

  updateStateAfterClick(x: number, y: number, lat: number, lng: number) {
    this.setState(
      prevState => {
        const newState: any = {};
        if (!prevState.frameEnabled) {
          newState.frameEnabled = true;
          newState.frameX = x;
          newState.frameY = y;
        } else {
          newState.frameReady = true;
        }
        return newState;
      },
      () => {
        // first click
        if (this.state.frameEnabled && !this.state.frameReady) {
          this.mapArea = {
            lat,
            lng,
            width: 0,
            height: 0
          };
        } else {
          let newWidth = lng - Number(this.mapArea.lng);
          let newHeight = Number(this.mapArea.lat) - lat;
          let newLng, newLat;
          if (newWidth < 0) {
            newLng = lng;
            newWidth = Math.abs(newWidth);
          } else {
            newLng = this.mapArea.lng;
          }
          if (newHeight < 0) {
            newLat = lat;
            newHeight = Math.abs(newHeight);
          } else {
            newLat = this.mapArea.lat;
          }
          this.mapArea.lng = newLng;
          this.mapArea.lat = newLat;
          this.mapArea.width = newWidth;
          this.mapArea.height = newHeight;
          this.fetchData(this.mapArea);
        }
      }
    );
  }

  render() {
    const position: LatLngLiteral = {
      lat: this.state.lat,
      lng: this.state.lng
    };
    return (
      <>
        {this.state.frameEnabled && (
          <AreaSelector
            x={this.state.frameX}
            y={this.state.frameY}
            width={this.state.frameWidth}
            height={this.state.frameHeight}
          />
        )}
        <Map
          ref={this.map}
          className="map-component"
          style={{ width: '100%', height: `${this.state.mapHeight}px` }}
          center={position}
          zoom={this.state.zoom}
          onclick={this.handleClickLeaflet}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </>
    );
  }
}
