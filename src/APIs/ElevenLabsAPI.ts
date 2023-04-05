import axios from 'axios';
import { config } from '../config';
import { PATH } from '../utils/Paths';
import { createWriteStream } from 'fs';
import { Lame } from 'node-lame';
import { FileWriter } from 'wav';
import { StreamUtils } from '../utils/StreamUtils';

interface IVoiceSettings {
  stability: number
  similarity_boost: number
}

export interface ITextToSpeechBody {
  text: string
  voice_settings?: IVoiceSettings
}

interface IElevenLabsValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export interface IVoice {
  id: string
  name: string
}

export class ElevenLabsAPI {
  private static key = config.elevenLabsApiKey;
  private static baseUrl = "https://api.elevenlabs.io/v1/" 

  public static async textToSpeech(text: string, voiceId: string, voiceSettings?: IVoiceSettings): Promise<string> {
    const textToSpeechUrl = `text-to-speech/${voiceId}/stream`
    const body: ITextToSpeechBody = {
      text,
      voice_settings: voiceSettings
    }
    
    // console.log(this.key)
    const res = await axios.post(
      this.buildEndpointUrl(textToSpeechUrl), 
      body,
      {
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": this.key
        },
        responseType: "stream"
      }
    )

    if (res.status !== 200) {
      const error = res.data as IElevenLabsValidationError
      throw new Error(error.detail[0].msg)
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    const filePath = `${PATH.outputDir}/speech-${timestamp}.mp3`

    res.data.pipe(createWriteStream(filePath))

    await StreamUtils.waitForPipe(res.data)
    return filePath 
  }

  public static async getVoiceList(): Promise<Array<IVoice>> {
    const voiceListUrl = "voices"
    const res = await axios.get(
      this.buildEndpointUrl(voiceListUrl),
      {
        headers: {
          "xi-api-key": this.key
        }
      }

    )

    const voices = res.data.voices
    return voices.map((voice: { voice_id: string, name: string}) => ({
      id: voice.voice_id,
      name: voice.name
    })) 
  }

  private static buildEndpointUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}` 
  }
}