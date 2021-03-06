//import "@babylonjs/loaders"
//import "@babylonjs/gui"
import { Engine } from "@babylonjs/core/Engines"
import { Game } from "./Game"

//Initialize Game
export function main() {
  window.addEventListener("DOMContentLoaded", () => {
    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        if (Engine.isSupported()) {
          new Game("renderCanvas").start()
        } else {
          console.error("BabylonJS engine not supported")
        }
      } else {
        console.error("Expected document state 'complete' but received state: " + document.readyState)
      }
    }
  })
}
