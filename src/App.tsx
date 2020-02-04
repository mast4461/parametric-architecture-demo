import React from 'react';
import './App.css';
import pc from 'playcanvas';

class App extends React.Component {
  componentDidMount() {
    var app = new pc.Application(this.refs.canvas as HTMLCanvasElement, { });
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

    // create camera entity
    var camera = new pc.Entity('camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.1, 0.1, 0.1)
    });

    // create directional light entity
    var light = new pc.Entity('light');
    light.addComponent('light');

    // add to hierarchy
    app.root.addChild(cube);
    app.root.addChild(camera);
    app.root.addChild(light);

    // set up initial positions and orientations
    camera.setPosition(0, 0, 3);
    light.setEulerAngles(45, 0, 0);

    // register a global update event
    app.on('update', function (deltaTime) {
        cube.rotate(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);
    });
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
