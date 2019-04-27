import React, { Component } from "react";
import "./App.scss";
import Menu from "./components/Menu/Menu";
import CanvasContainer from "./components/CanvasContainer/CanvasContainer";

const files = [
  {
    name: "Lyon (FR)",
    file: "lyon.json"
  },
  {
    name: "Grand Canyon",
    file: "grand_canyon.json"
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFileIndex: 0
    };

    this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
  }

  onMenuButtonClick(index) {
    this.setState({ activeFileIndex: index });
  }

  render() {
    return (
      <>
        <Menu
          items={files.map((file, index) => {
            return file.name;
          })}
          default={this.state.activeFileIndex}
          onButtonClick={this.onMenuButtonClick}
        />
        <CanvasContainer
          key={`mapData${this.state.activeFileIndex}`}
          file={files[this.state.activeFileIndex].file}
        />
      </>
    );
  }
}

export default App;
