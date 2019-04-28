import React, { Component } from "react";
import { isMobile } from "mobile-device-detect";
const Isometric3DGrid = require("../../lib/Isometric3DMap/isometric3dgrid")
  .default;
const PIXI = require("pixi.js");

let app, isometric3DGrid;

class CanvasContainer extends Component {
  constructor(props) {
    super(props);
    this.initViewPort();
  }

  componentDidMount() {
    this.initStage();
    this.initIsometric3DGrid();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    if (isometric3DGrid && typeof isometric3DGrid.kill === "function") {
      isometric3DGrid.kill();
    }
  }

  initStage() {
    // define renderer options
    const rendererOptions = {
      autoResize: true,
      antialias: true,
      transparent: true
    };
    // create renderer & application
    let renderer;
    if (isMobile) {
      renderer = new PIXI.CanvasRenderer(rendererOptions);
    } else {
      renderer = new PIXI.WebGLRenderer(rendererOptions);
    }
    app = new PIXI.Application(window.innerWidth, window.innerHeight);
    app.renderer = renderer;
    this.refs.canvasContainer.appendChild(app.view);
    // init resizing
    window.addEventListener("resize", this.resize);
    // resize
    this.resize();
  }

  async initIsometric3DGrid() {
    const data = await fetch(`./data/${this.props.file}`);
    const dataJSON = await data.json();
    isometric3DGrid = new Isometric3DGrid({
      app,
      params: {
        data: dataJSON.results,
        mobile: isMobile
      }
    });
  }

  initViewPort() {
    if (isMobile) {
      const viewPort = document.createElement("meta");
      viewPort.name = "viewport";
      viewPort.content =
        "width=device-width, initial-scale=1.0, shrink-to-fit=no, user-scalable=no, maximum-scale=1";
      document.getElementsByTagName("head")[0].appendChild(viewPort);
    }
  }

  resize(event) {
    if (isometric3DGrid && typeof isometric3DGrid.resize === "function") {
      isometric3DGrid.resize(event);
    }
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  render() {
    return (
      <div id="canvasContainer" ref="canvasContainer" key={this.props.file} />
    );
  }
}

export default CanvasContainer;
