import React, { Component } from "react";
import "./App.scss";
import CanvasContainer from "./components/CanvasContainer/CanvasContainer";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapDataFile: "lyon.json"
    };
  }

  render() {
    return (
      <>
        <CanvasContainer file={this.state.mapDataFile} />
      </>
    );
  }
}

export default App;
