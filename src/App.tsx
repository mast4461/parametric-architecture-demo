import React from 'react';
import './App.css';
import pc from 'playcanvas';
import {initializeOrbitCameraResources, scriptNames} from './orbit-camera';
import {ControlPanel, controlValues} from './ControlPanel';
import { Rect } from './Rect';
import Chance from 'chance';


class App extends React.Component {
  private builderRoot: pc.GraphNode = new pc.GraphNode("builder root");

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

    this.draw(controlValues);
  }

  draw(controlValues: any) {
    this.builderRoot.children.slice().forEach(destroySubtree);
    const chance = new Chance(1337);

    // const mainColorMaterial = new pc.StandardMaterial();
    // mainColorMaterial.diffuse = new pc.Color().fromString(controlValues.mainColor);

    const mainRect = new Rect(
      -controlValues.width / 2,
      -controlValues.height / 2,
      controlValues.width,
      controlValues.height,
    );

    const drawBox = (rect: Rect) => {
      const box = new pc.Entity('box');
      box.addComponent('model', {
        type: 'box',
        material: createMaterial(chance.color({format: "hex"})),
      });  

      box.setLocalScale(rect.w, rect.h, 0);
      box.setLocalPosition(rect.x1 + rect.w / 2, rect.y1 + rect.h / 2, 0);
      this.builderRoot.addChild(box);
    };

    const columns = mainRect.splitEvenlyX(controlValues.splitsX);
    columns
      .flatMap(column => column.splitEvenlyY(controlValues.splitsY))
      .forEach(drawBox);
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

function destroySubtree(node: pc.Entity | pc.GraphNode) {
  node.children.slice().forEach(destroySubtree);
  if (node instanceof pc.Entity) {
    node.destroy();
  }
}

function createMaterial(hexString: string): pc.StandardMaterial {
  const material = new pc.StandardMaterial();
  material.diffuse = new pc.Color().fromString(hexString);
  return material;
}

export default App;
