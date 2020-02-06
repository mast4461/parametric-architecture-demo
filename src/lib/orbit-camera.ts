import {scriptNames, createOrbitCameraScripts} from './orbit-camera-source.js';
import pc from 'playcanvas';

interface OrbitCameraOptions {
  distance: number;
  pitch: number;
  yaw: number;
}

export function initializeOrbitCamera(app: pc.Application, cameraEntity: pc.Entity, options: Partial<OrbitCameraOptions> = {}) {
  createOrbitCameraScripts();
  app.mouse = app.mouse ?? new pc.Mouse(document.body);
  app.touch = app.mouse ?? new pc.TouchDevice(document.body);

  const cameraScriptComponent = cameraEntity.addComponent("script") as pc.ScriptComponent;

  const orbitCamera: any = cameraScriptComponent.create(scriptNames.OrbitCamera);
  cameraScriptComponent.create(scriptNames.OrbitCameraInputMouse);
  cameraScriptComponent.create(scriptNames.OrbitCameraInputTouch);
  orbitCamera.distance = options.distance ?? 3;
  orbitCamera.pitch = options.pitch ?? -20;
  orbitCamera.yaw = options.yaw ?? 30;
}