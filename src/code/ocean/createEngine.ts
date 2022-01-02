/**
 * Based on the great Unity project https://github.com/gasgiant/FFT-Ocean by Ivan Pensionerov (https://github.com/gasgiant)
 */

 import * as BABYLON from "@babylonjs/core"
 import * as GUI from "@babylonjs/gui"
 import { CustomMaterial, PBRCustomMaterial, SkyMaterial } from "@babylonjs/materials"
 
 export async function createEngine() {
   const webGPUSupported = await (BABYLON.WebGPUEngine as any).IsSupportedAsync
   if (webGPUSupported) {
     const engine = new BABYLON.WebGPUEngine(document.getElementById("renderCanvas") as HTMLCanvasElement, {
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
     await engine.initAsync()
     return engine
   }
   return new BABYLON.Engine(document.getElementById("renderCanvas") as HTMLCanvasElement, true)
 }
 
 class Playground {
   public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): Promise<BABYLON.Scene> {
     const oceanDemo = new Ocean()
     return oceanDemo.createScene(engine, canvas)
   }
 }