import { ElevenLabsAPI, IVoice } from "../../APIs/ElevenLabsAPI";


/**
 * donald trump: stability 0.5, similarity_boost 0.88
 */

const ERROR_MESSAGE = "voice not initialized"
export enum CycleDirection {
  UP = "UP",
  DOWN = "DOWN"
}
export class VoiceController {
  public static voices: IVoice[] | undefined
  public static currentVoiceIndex: number = -1

  public static async init() {
    this.voices = await ElevenLabsAPI.getVoiceList()
    console.log("voices initialized")
    this.listAllVoices()

    /**
     * should be fine to use hard coded index since ElevenLabs 
     * has a number of freely available voices
     */
    this.currentVoiceIndex = 0
  }

  public static cycleVoice(direction: CycleDirection = CycleDirection.UP) {
    if (this.voices === undefined) {
      throw new Error(ERROR_MESSAGE)
    }

    if (direction === CycleDirection.UP) {
      this.currentVoiceIndex = (this.currentVoiceIndex + 1) % this.voices.length
    } else {
      this.currentVoiceIndex = (this.currentVoiceIndex - 1 + this.voices.length) % this.voices.length
    }

  }

  public static getCurrentVoice(): IVoice { 
    if (this.voices === undefined) {
      throw new Error(ERROR_MESSAGE)
    }
    return this.voices[this.currentVoiceIndex]
  }

  public static printCurrentVoice() {
    if (this.voices === undefined) {
      throw new Error(ERROR_MESSAGE)
    }
    console.log(`current voice: ${this.getCurrentVoice().name}`)
  }

  public static listAllVoices() {
    if (this.voices === undefined) {
      throw new Error(ERROR_MESSAGE)
    }
    this.voices.map((voice, index) => {
      console.log(`${index}: ${voice.name}`)
    })
  }
}