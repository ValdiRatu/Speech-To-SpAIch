import { KeyboardController } from "./Controller/keyboard/KeyboardController";
import { SpeechController } from "./Controller/speech/SpeechController";
import { CycleDirection, VoiceController } from "./Controller/voice/VoiceController";

VoiceController.init()

KeyboardController.addListener(
  "v",
  async () => {
    console.log("recording, begin talking...")
    SpeechController.beginConversionProcess()
  },
  async () => {
    console.log("finished recording, processing...")
    const text = await SpeechController.finishConversionProcess()
    console.log(`transcription: ${text}`)
  }
)

KeyboardController.addListener(
  "l",
  async () => {
    VoiceController.cycleVoice()
    VoiceController.printCurrentVoice()
  },
  async () => {}
)

KeyboardController.addListener(
  "k",
  async () => {
    VoiceController.cycleVoice(CycleDirection.DOWN)
    VoiceController.printCurrentVoice()
  },
  async () => {}
)

// clean up
process.on('SIGINT', () => {
  KeyboardController.cleanUp();
  process.exit();
})