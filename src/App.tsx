import React from 'react';
import './App.css';
import pc from 'playcanvas';
import {initializeOrbitCameraResources, scriptNames} from './orbit-camera';
import {ControlPanel} from './ControlPanel';

class App extends React.Component {
  private builderRoot: pc.GraphNode = new pc.GraphNode();

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

    app.root.addChild(this.builderRoot);
    var cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box'
    });
    this.builderRoot.addChild(cube);

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

  draw(controlValues: any) {
    this.builderRoot.children.forEach(destroySubtree);

    const mainColorMaterial = new pc.StandardMaterial();
    mainColorMaterial.diffuse = new pc.Color().fromString(controlValues.mainColor);

    const cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box',
        material: mainColorMaterial,
    });
    cube.setLocalScale(controlValues.width, controlValues.height, controlValues.depth);
    this.builderRoot.addChild(cube);
  }

  render() {
    return (
      <div className="App">
        <ControlPanel onInput={this.draw.bind(this)}></ControlPanel>
        <canvas ref="canvas"></canvas>
      </div>
    );
  }
}

function destroySubtree(node: pc.GraphNode | pc.Entity) {
  node.children.forEach(destroySubtree)
  node.parent.removeChild(node);
}

export default App;
