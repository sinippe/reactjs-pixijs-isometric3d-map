import React, { Component } from "react";
import cn from "classnames";
import CanvasContainer from "../CanvasContainer/CanvasContainer";
import "./Menu.scss";

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

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(index) {
    this.setState({
      activeIndex: index
    });
  }

  render() {
    return (
      <>
        <div className="menu">
          {files.map((file, index) => {
            const active = this.state.activeIndex;
            const isActive = index === active;
            return (
              <button
                key={`menuButton${index}`}
                className={cn({ active: isActive })}
                onClick={() => {
                  this.handleClick(index);
                }}
              >
                {file.name}
              </button>
            );
          })}
        </div>
        <CanvasContainer
          key={`mapData${this.state.activeIndex}`}
          file={files[this.state.activeIndex].file}
        />
      </>
    );
  }
}

export default Menu;
