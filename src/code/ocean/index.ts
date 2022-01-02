import { Engine } from "@babylonjs/core/Engines/engine"
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine"
import type { Scene } from "@babylonjs/core/scene"
import "@babylonjs/loaders"
import { Ocean } from "./Ocean-36"


//import "@babylonjs/inspector";

export interface CreateSceneClass {
  createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>
  preTasks?: Promise<unknown>[]
}

export interface CreateSceneModule {
  default: CreateSceneClass
}

export const main = async (): Promise<void> => {
  // get the module to load

  //(window as any).BABYLON = BABYLON; // required for ES6 to work for the time being

  // Execute the pretasks, if defined
  //await Promise.all(createSceneModule.preTasks || []);
  // Get the canvas element
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement
  // Generate the BABYLON 3D engine
  //const engine = new Engine(canvas, true);

  let engine: Engine
  const webgpuSupported = await WebGPUEngine.IsSupportedAsync

  if (webgpuSupported) {
    engine = new WebGPUEngine(canvas, {
      deviceDescriptor: {
        requiredFeatures: [
          "depth-clip-control",
          "depth24unorm-stencil8",
          "depth32float-stencil8",
          "texture-compression-bc",
          "texture-compression-etc2",
          "texture-compression-astc",
          "timestamp-query",
          "indirect-first-instance",
        ],
      },
    })
    await (engine as WebGPUEngine).initAsync()
  } else {
    engine = new Engine(canvas, true)
  }

  // Create the scene

  const scene = await new Ocean().createScene(engine, canvas) //await createSceneModule.createScene(engine, canvas);

  ;(window as any).engine = engine
  ;(window as any).scene = scene

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render()
  })

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize()
  })
}
