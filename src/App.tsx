/* eslint-disable jsx-a11y/accessible-emoji */
// https://www.npmjs.com/package/playcanvas
import React from 'react';
import './App.css';
import pc from "playcanvas";
import { initializeOrbitCamera } from './lib/orbit-camera';
import ControlPanel, { controlValues } from './ControlPanel';

export default class App extends React.Component {
  private cube?: pc.Entity;
  private cubeMaterial?: pc.StandardMaterial;

  componentDidMount() {
    // create a PlayCanvas application
    const canvas = this.refs.canvas as HTMLCanvasElement;
    const app = new pc.Application(canvas, { });
    app.start();
    this.cubeMaterial = app.scene.defaultMaterial.clone();

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', function() {
        app.resizeCanvas();
    });

    // create box entity
    const cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box',
        material: this.cubeMaterial,
    });
    this.cube = cube;

    // create camera entity
    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.4, 0.4, 0.4)
    });

    // create directional light entity
    const light = new pc.Entity('light');
    light.addComponent('light');

    // add to hierarchy
    app.root.addChild(cube);
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
    if (!this.cube || !this.cubeMaterial) {
      throw new Error("Cube or cubematerial is missing");
    }

    this.cube.setLocalScale(controlValues.width, controlValues.height, controlValues.depth);

    this.cubeMaterial.diffuse = new pc.Color().fromString(controlValues.color);
    this.cubeMaterial.update();
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
