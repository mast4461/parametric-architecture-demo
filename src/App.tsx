import React, { InputHTMLAttributes } from 'react';
import Chance from 'chance';
import { BoundingBox as Bb } from './BoundingBox';
import './App.css';
import pc from 'playcanvas';

const controls: {[key: string]: InputHTMLAttributes<HTMLInputElement>} = {
  width: {
    type: "range",
    min: 100,
    max: 40*100,
    step: 1,
    defaultValue: 20*100,
  },
  depth: {
    type: "range",
    min: 100,
    max: 40*100,
    step: 1,
    defaultValue: 10*100,
  },
  height: {
    type: "range",
    min: 100,
    max: 30*100,
    step: 1,
    defaultValue: 12*100,
  },
  roofHeight: {
    type: "range",
    min: 100,
    max: 20*100,
    step: 1,
    defaultValue: 4*100,
  },
  cellWidth: {
    type: "range",
    min: 100,
    max: 20*100,
    step: 1,
    defaultValue: 400,
  },
  cellHeight: {
    type: "range",
    min: 100,
    max: 10*100,
    step: 1,
    defaultValue: 300,
  },
  windowWidth: {
    type: "range",
    min: 20,
    max: 500,
    step: 1,
    defaultValue: 100,
  },
  windowHeight: {
    type: "range",
    min: 30,
    max: 500,
    step: 1,
    defaultValue: 120,
  },
  windowCapHeight: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 10,
  },
  horizontalSpröjsWidth: {
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    defaultValue: 8,
  },
  horizontalSpröjsSpacing: {
    type: "range",
    min: 10,
    max: 1000,
    step: 1,
    defaultValue: 50,
  },
  verticalSpröjsWidth: {
    type: "range",
    min: 1,
    max: 30,
    step: 1,
    defaultValue: 3,
  },
  verticalSpröjsSpacing: {
    type: "range",
    min: 10,
    max: 1000,
    step: 1,
    defaultValue: 60,
  },
  wallColor: {
    type: "color",
    defaultValue: "#eae94e",
  },
  roofColor: {
    type: "color",
    defaultValue: "#a77760",
  },
  windowBorderColor: {
    type: "color",
    defaultValue: "#babdb1",
  },
  spröjsColor: {
    type: "color",
    defaultValue: "#fffdfd",
  },
};

const controlValues = Object.entries(controls)
  .reduce((acc, [controlName, options]) => {
    acc[controlName] = options.defaultValue;
    return acc;
  }, {} as {[key: string]: any});

const seed = 3;
const noop = () => {};
const scaleFactor = 0.005;

class App extends React.Component {
  app?: pc.Application;
  chance: Chance.Chance = new Chance(seed) 
  defaultMaterial: pc.StandardMaterial | undefined;
  materials: pc.StandardMaterial[] = [];
  allEntities: pc.Entity[] = [];
  allContainers: pc.GraphNode[] = [];
  roofNode?: pc.GraphNode;
  pcRender = noop;

  constructor(props: any) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
  }

  get canvas() {
    return this.refs.canvas as HTMLCanvasElement;
  }

  get canvasContainer() {
    return this.refs.canvasContainer as HTMLElement;
  }

  handleInput(event: any) {
    const getters: {[type: string]: (el: HTMLInputElement) => any} = {
      range: el => el.valueAsNumber,
      color: el => el.value,
    }
    const getValue = getters[event.target.type as string] ?? (el => el.value);
    controlValues[event.target.id as string] = getValue(event.target);
    this.draw(this.app!);
  }

  componentDidMount() {
    window.pc = pc;
    this.initializePart1();
  }

  initializePart1() {
    const app = new pc.Application(this.canvas, {
      mouse: new pc.Mouse(document.body),
      touch: new pc.TouchDevice(document.body)
    });
    this.app = app;
    this.pcRender = app.render.bind(app);
    app.render = noop;
    // A list of assets that need to be loaded
    var assetManifest = [
      {
          type: "script",
          url: "orbit-camera.js",
          asset: null as unknown as pc.Asset,
      }
    ];
    // Load all assets and then run the example
    var assetsToLoad = assetManifest.length;
    assetManifest.forEach((entry) => {
        app.assets.loadFromUrl(entry.url, entry.type, (err, asset) => {
            if (!err && asset) {
                assetsToLoad--;
                entry.asset = asset;
                if (assetsToLoad === 0) {
                    this.initializePart2(app);
                }
            }
        });
    });
  }

  initializePart2(app: pc.Application) {
    this.canvas.width = this.canvasContainer.clientWidth;
    this.canvas.height = this.canvasContainer.clientHeight;
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    const resizeCanvas = () => {
      app.setCanvasFillMode(pc.FILLMODE_NONE, this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
      app.resizeCanvas();
    }

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // create box entity
    const cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box'
    });

    // create camera entity
    const camera = new pc.Entity('camera');
    camera.addComponent('camera', {
      clearColor: new pc.Color(0.5, 0.5, 0.5)
    });
    const cameraScriptComponent = camera.addComponent("script") as pc.ScriptComponent;
    const orbitCamera: any = cameraScriptComponent.create("orbitCamera", {
      attributes: {
        inertiaFactor: 0, // Override default of 0 (no inertia)
        startAutoRender: () => {app.render = this.pcRender},
        stopAutoRender: () => {app.render = noop;},
        render: this.pcRender,
        scaleFactor: scaleFactor,
      }
    });
    cameraScriptComponent.create("orbitCameraInputMouse");
    cameraScriptComponent.create("orbitCameraInputTouch");

    // create light
    const light = new pc.Entity('light');
    light.addComponent('light');
    app.scene.ambientLight = new pc.Color(0.5, 0.5, 0.5, 1);

    // add to hierarchy
    app.root.addChild(camera);
    app.root.addChild(light);
    app.root.setLocalScale(scaleFactor, scaleFactor, scaleFactor);

    // set up initial positions and orientations
    if (orbitCamera) {
      orbitCamera.distance = 25;
      orbitCamera.pitch = -20;
      orbitCamera.yaw = 180;
    }
    light.setEulerAngles(45, 210, 0);

    this.defaultMaterial = (cube.model?.material as pc.StandardMaterial).clone();

    this.materials = Array(32).fill(0).map(() =>
      this.createMaterial(this.chance.color({format: "hex"})),
    );

    app.start();
    this.draw(app);
  }

  createMaterial(hexStr: string): pc.StandardMaterial {
    const material = this.defaultMaterial!.clone();
    material.diffuse = new pc.Color().fromString(hexStr);
    return material;
  }

  draw(app: pc.Application) {
    this.chance = new Chance(seed);

    const defaultMaterial = this.defaultMaterial;
    if (!app || !defaultMaterial) {
      return;
    }

    const planeEntityName = "plane-entity";
    const boxEntityName = "box-entity";
    const depthEpsilon = 0.1;

    this.allEntities.forEach(e => e.model?.hide());
    const previousPlanes = this.allEntities.filter(e => e.name === planeEntityName);
    const previousBoxes = this.allEntities.filter(e => e.name === boxEntityName);
    const previousContainers = this.allContainers.slice();

    const materials = {
      walls: this.createMaterial(controlValues.wallColor),
      roof: this.createMaterial(controlValues.roofColor),
      windowBorder: this.createMaterial(controlValues.windowBorderColor),
      windowSpröjs: this.createMaterial(controlValues.spröjsColor),
    };

    console.log(controlValues);

    const getPlane = (): pc.Entity => {
      let entity: pc.Entity | undefined = previousPlanes.pop();
      if (!entity) {
        entity = new pc.Entity(planeEntityName);
        entity.addComponent('model', {
            type: 'plane',
        });
        this.allEntities.push(entity);
      }
      return resetEntity(entity);
    }

    const getBox = (): pc.Entity => {
      let entity: pc.Entity | undefined = previousBoxes.pop();
      if (!entity) {
        entity = new pc.Entity(boxEntityName);
        entity.addComponent('model', {
            type: 'box',
        });
        this.allEntities.push(entity);
      }
      return resetEntity(entity);
    }

    const resetEntity = (entity: pc.Entity): pc.Entity => {
      entity.reparent(app.root);
      entity.setLocalPosition(0, 0, 0);
      entity.setLocalScale(1, 1, 1);
      entity.setLocalEulerAngles(0, 0, 0);
      return entity;
    }

    const showAndColorModel = (entity: pc.Entity, material?: pc.StandardMaterial): pc.Entity => {
      if (entity.model) {
        entity.model.show();
        entity.model.material = material ?? this.getRandomMaterial();
      }
      return entity;
    }

    const drawBuildingSide = (bb: Bb, orientationDegrees: number = 0): pc.GraphNode => {
      let container: pc.GraphNode | undefined = previousContainers.pop();
      if (!container) {
        container = new pc.GraphNode();
        this.allContainers.push(container);
        app.root.addChild(container);
      }
      container.setLocalEulerAngles(-90, orientationDegrees, 0);

      drawPlane(bb, 0, materials.walls).reparent(container);
      const columns = bb.cellsX(controlValues.cellWidth);
      const i = Math.floor(columns.length / 2);
      const centerColumns: Bb[] = columns.length % 2 === 0
        ? [columns[i - 1], columns[i]]
        : [columns[i]];
      const outerColums = columns.filter(c => !centerColumns.includes(c));
      const cells = outerColums.flatMap(column => column.cellsY(controlValues.cellHeight));
      cells.flatMap(cell => {
        return drawCenteredWindow(cell, controlValues.windowWidth, controlValues.windowHeight, 4);
      }).forEach(entity => entity.reparent(container!));

      const centerColumn = Bb.bounds(centerColumns);
      const columnThickness = 100;
      drawBox(centerColumn, 100, 0, this.materials[1]).reparent(container);
      const cells2 = centerColumn.cellsY(controlValues.cellHeight);
      cells2.flatMap(cell => {
        return drawCenteredWindow(cell, controlValues.windowWidth, controlValues.windowHeight, 4, columnThickness);
      }).forEach(entity => entity.reparent(container!));

      return container;
    }

    const drawRoof = (w: number, d: number, h: number): pc.Entity => {
      const box = getBox();
      const roofNode = this.roofNode ?? new pc.GraphNode();
      this.roofNode = roofNode;

      showAndColorModel(box, materials.roof);

      const rh = controlValues.roofHeight;
      roofNode.setLocalPosition(w/2, h, d/2);
      
      box.setLocalEulerAngles(45, 0, 0);
      const dd = d / Math.sqrt(2);
      roofNode.setLocalScale(1, rh  / dd, 1);
      box.setLocalScale(w - 2 * depthEpsilon, dd, dd);

      roofNode.reparent(app.root);
      box.reparent(roofNode);
      return box;
    } 

    const drawPlane = (bb: Bb, depthOffset: number = 0, material?: pc.StandardMaterial): pc.Entity => {
      const entity = getPlane();
      showAndColorModel(entity, material);
      entity.setLocalScale(bb.w, 1, bb.h);
      entity.setLocalPosition(bb.x1 + bb.w / 2, depthOffset, bb.y1 + bb.h / 2);
      return entity;
    }

    const drawBox = (bb: Bb, thickness: number = 10, depthOffset = 0, material?: pc.StandardMaterial): pc.Entity => {
      const entity = getBox();
      showAndColorModel(entity, material);
      entity.setLocalScale(bb.w, thickness, bb.h);
      entity.setLocalPosition(bb.x1 + bb.w / 2, thickness / 2 + depthOffset, bb.y1 + bb.h / 2);
      return entity;
    }

    const drawCenteredWindow = (bb: Bb, w: number, h: number, borderWidth: number, depthOffset = 0): pc.Entity[] => {
      w = Math.min(w, bb.w);
      h = Math.min(h, bb.h);

      const x1 = bb.x1 + bb.w/2 - w/2;
      const y1 = bb.y1 + bb.h/2 - h/2;
      const windowBounds = new Bb(x1, y1, w, h);

      const windowParts = windowBounds.splitBorders({
        t: 0.01 * controlValues.windowCapHeight * controlValues.windowHeight,
        r: borderWidth,
        b: borderWidth,
        l: borderWidth
      });

      const spröjsX = windowParts.c.gridX(controlValues.horizontalSpröjsSpacing, controlValues.horizontalSpröjsWidth);
      const spröjsY = windowParts.c.gridY(controlValues.verticalSpröjsSpacing, controlValues.verticalSpröjsWidth);

      return [
        drawPlane(windowParts.c, depthEpsilon + depthOffset, this.materials[0]),
        [windowParts.t, windowParts.r, windowParts.b, windowParts.l].map(bb =>
          drawBox(bb, 10, depthOffset, materials.windowBorder)
        ),
        [...spröjsX, ...spröjsY].flatMap(bb => drawBox(bb, 5, depthOffset, materials.windowSpröjs))
      ].flat()
      // drawTriangleUp(windowParts.t);
    }

    // function drawTriangleUp(bb: Bb) {
    //   ctx.beginPath();
    //   ctx.lineTo(bb.x1, bb.y2);
    //   ctx.lineTo(bb.x1 + bb.w / 2, bb.y1);
    //   ctx.lineTo(bb.x2, bb.y2);
    //   ctx.closePath();
    //   ctx.fill();
    // }

    const w = controlValues.width;
    const d = controlValues.depth;
    const h = controlValues.height;
    // ctx.fillStyle = controlValues.wallColor;
    const sideBase1 = new Bb(0, 0, w, h);
    const sideBase2 = new Bb(0, 0, d, h);

    drawBuildingSide(sideBase1).setLocalPosition(0, 0, 0);
    drawBuildingSide(sideBase2, 90).setLocalPosition(0, 0, d);
    drawBuildingSide(sideBase1, 180).setLocalPosition(w, 0, d);
    drawBuildingSide(sideBase2, 270).setLocalPosition(w, 0, 0);
    drawRoof(w, d, h);

    app.root.setLocalPosition(-w / 2 * scaleFactor, 0, -d / 2 * scaleFactor);
    this.pcRender();
  }

  getRandomMaterial() {
    return this.materials[this.chance.integer({min: 0, max: this.materials.length - 1})];
  }

  render() {
    return (
      <div className="App">
        <div id="main-canvas-container" ref="canvasContainer">
          <canvas id="main-canvas" ref="canvas"></canvas>
        </div>
        <section id="controls">
        {Object.entries(controls).map(([controlName, options]) => {
          return (<div key={controlName}>
            <div>{controlName}</div>
            <input id={controlName} {...options} onInput={this.handleInput}></input>
          </div>);
        })}
        </section>
    </div>
    );
  }
}

export default App;
