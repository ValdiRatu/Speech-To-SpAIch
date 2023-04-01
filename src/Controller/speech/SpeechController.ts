import { ElevenLabsAPI } from "../../APIs/ElevenLabsAPI"
import { OpenAPIWrapper } from "../../APIs/OpenAPI"
import { PATH } from "../../utils/Paths"
import { SpeechRecorder } from "./SpeechRecorder"

export class SpeechController {
  private static inputFileName: string = ""
  private static outputFileName: string = ""

  public static beginConversionProcess() {
    this.inputFileName = SpeechRecorder.record()
  }

  public static async finishConversionProcess(): Promise<string> {
    if (!this.inputFileName) {
      throw new Error("No file name")
    }
    SpeechRecorder.stopRecording()

    const filePath = `${PATH.inputDir}/${this.inputFileName}`
    const text = await OpenAPIWrapper.getTextFromSpeech(filePath)
    this.outputFileName = await ElevenLabsAPI.textToSpeech(text, "21m00Tcm4TlvDq8ikWAM")

    return text
  }
}