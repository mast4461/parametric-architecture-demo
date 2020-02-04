import React from 'react';
import './App.css';
import pc from 'playcanvas';
import {initializeOrbitCameraResources, scriptNames} from './orbit-camera';

class App extends React.Component {
  componentDidMount() {
    var app = new pc.Application(this.refs.canvas as HTMLCanvasElement, {
      mouse: new pc.Mouse(document.body),
      touch: new pc.TouchDevice(document.body)
    });
    app.start();

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', function() {
        app.resizeCanvas();
    });

    // create box entity
    var cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box'
    });
    app.root.addChild(cube);

    // create camera entity
    var camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.1, 0.1)
    });
    app.root.addChild(camera);

    initializeOrbitCameraResources();
    const cameraScriptComponent = camera.addComponent("script") as pc.ScriptComponent;
    const orbitCamera: any = cameraScriptComponent.create(scriptNames.OrbitCamera);
    cameraScriptComponent.create(scriptNames.OrbitCameraInputMouse);
    cameraScriptComponent.create(scriptNames.OrbitCameraInputTouch);
    orbitCamera.distance = 10;
    orbitCamera.pitch = -20;
    orbitCamera.yaw = 30;

    // create light
    var light = new pc.Entity('light');
    light.addComponent('light');
    light.setEulerAngles(40, 30, 0);
    app.root.addChild(light);
    app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5, 1);
  }

  render() {
    return (
      <div className="App">
        <canvas ref="canvas"></canvas>
      </div>
    );
  }
}

export default App;
