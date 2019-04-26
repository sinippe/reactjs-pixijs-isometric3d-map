import React, { Component } from "react";
import "./App.scss";
import Menu from "./components/Menu/Menu";

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
        <Menu />
      </>
    );
  }
}

export default App;
