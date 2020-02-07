/* eslint-disable jsx-a11y/accessible-emoji */
// https://www.npmjs.com/package/playcanvas
import React from 'react';
import './App.css';
import pc from "playcanvas";
import { initializeOrbitCamera } from './lib/orbit-camera';
import ControlPanel, { controlValues } from './ControlPanel';

export default class App extends React.Component {
  private builderRoot = new pc.GraphNode();

  componentDidMount() {
    // create a PlayCanvas application
    const canvas = this.refs.canvas as HTMLCanvasElement;
    const app = new pc.Application(canvas, { });
    app.start();

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', function() {
        app.resizeCanvas();
    });

    // add builder root node to app
    app.root.addChild(this.builderRoot);

    // create camera entity
    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.4, 0.4, 0.4)
    });

    // create directional light entity
    const light = new pc.Entity('light');
    light.addComponent('light');

    // add to hierarchy
    app.root.addChild(camera);
    app.root.addChild(light);

    // set up initial positions and orientations
    camera.setPosition(0, 0, 3);
    light.setEulerAngles(45, 30, 0);

    app.scene.ambientLight = new pc.Color(0.3, 0.3, 0.3);

    initializeOrbitCamera(app, camera, {
      distance: 10,
    });
    this.draw();
  }

  draw() {
    this.builderRoot.children.slice().forEach(destroyRecursively)

    const material = new pc.StandardMaterial();
    material.diffuse = new pc.Color().fromString(controlValues.color);

    const cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box',
        material: material,
    });
    cube.setLocalScale(parseFloat(controlValues.width), parseFloat(controlValues.height), parseFloat(controlValues.depth));

    this.builderRoot.addChild(cube);
  }

  render() {
    const draw = this.draw.bind(this);
    return (
      <div className="App">
        <ControlPanel onInput={draw}></ControlPanel>
        <canvas ref="canvas"></canvas>
      </div>
    )
  }
}

function destroyRecursively(node: pc.GraphNode | pc.Entity) {
  node.children.slice().forEach(destroyRecursively);
  if (node instanceof pc.Entity) {
    node.destroy();
  } else if (node.parent) {
    node.parent.removeChild(node);
  }
}