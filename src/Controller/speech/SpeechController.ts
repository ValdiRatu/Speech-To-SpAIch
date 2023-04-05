import { ElevenLabsAPI } from "../../APIs/ElevenLabsAPI"
import { OpenAPIWrapper } from "../../APIs/OpenAPI"
import { Mp3ToWavEncoder } from "../../utils/Mp3ToWavEncoder"
import { PATH } from "../../utils/Paths"
import { VoiceController } from "../voice/VoiceController"
import { SpeechEmitter } from "./SpeechEmitter"
import { SpeechRecorder } from "./SpeechRecorder"
import { rmSync } from "fs"

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

    await this.emitVoice(text)

    rmSync(filePath)
    
    return text
  }

  private static async emitVoice(text: string) {
    const currentVoice = VoiceController.getCurrentVoice() 
    const mpegOutputPath = await ElevenLabsAPI.textToSpeech(text, currentVoice.id)
    const wavOutputPath = await Mp3ToWavEncoder.encode(mpegOutputPath)

    /**
     * probably a way to save the stream given by ElevenLabs directly
     * as a wav file, but I have failed every attempt at doing so
     * and now I hate working with streams so this is how we are gonna do it :)
     */
    rmSync(mpegOutputPath)
    SpeechEmitter.emit(wavOutputPath)
  }
}