import { GlobalKeyboardListener } from "node-global-key-listener";
export enum KeyState{
  DOWN = "DOWN",
  UP = "UP"
}
export class KeyboardController {
  private static controller = new GlobalKeyboardListener();

  public static addListener = (key: string, onDownCallback: () => Promise<void>, onReleaseCallback: () => Promise<void>) => {
    let pressed = false;
    const formattedKey = key.toUpperCase()
    this.controller.addListener((e, down)=> {
      if (e.state === KeyState.DOWN && e.name === formattedKey && !pressed) {
        pressed = true
        onDownCallback()
      }
      if (e.state === KeyState.UP && e.name === formattedKey) {
        pressed = false
        onReleaseCallback()
      }
    })
  }

  public static cleanUp = () => {
    this.controller.kill();
  }
}