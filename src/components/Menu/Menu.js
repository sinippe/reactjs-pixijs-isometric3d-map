import React, { Component } from "react";
import cn from "classnames";
import "./Menu.scss";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: this.props.default
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(index) {
    this.setState({
      activeIndex: index
    });
    if (typeof this.props.onButtonClick === "function") {
      this.props.onButtonClick(index);
    }
  }

  render() {
    return (
      <>
        <div className="menu">
          {this.props.items.map((item, index) => {
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
                {item}
              </button>
            );
          })}
        </div>
      </>
    );
  }
}

export default Menu;
