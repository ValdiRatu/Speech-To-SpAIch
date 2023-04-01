import { KeyboardController } from "./Controller/keyboard/KeyboardController";
import { SpeechController } from "./Controller/speech/SpeechController";

KeyboardController.addListener(
  "v",
  async () => {
    // console.log(getDevices())
    SpeechController.beginConversionProcess()
    console.log("saved file: ")
  },
  async () => {
    // console.log(getHostAPIs())
    const text = await SpeechController.finishConversionProcess()
    console.log(`transcription: ${text}`)
  }
)

// clean up
process.on('SIGINT', () => {
  KeyboardController.cleanUp();
  process.exit();
})