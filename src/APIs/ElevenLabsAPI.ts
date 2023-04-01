import axios from 'axios';
import { config } from '../config';
import { PATH } from '../utils/Paths';
import { createWriteStream } from 'fs';

interface IVoiceSettings {
  stability: number
  similarity_boost: number
}

interface ITextToSpeechBody {
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

export class ElevenLabsAPI {
  private static key = config.elevenLabsApiKey;
  private static baseUrl = "https://api.elevenlabs.io/v1/" 

  public static async textToSpeech(text: string, voiceId: string, voiceSettings?: IVoiceSettings): Promise<string> {
    const textToSpeechUrl = `text-to-speech/${voiceId}/stream`
    const body: ITextToSpeechBody = {
      text,
      voice_settings: voiceSettings
    }
    
    const res = await axios.post(
      `${this.baseUrl}${textToSpeechUrl}`,
      body,
      {
        headers: {
          "Accept": "audio/mpeg",
          "xiv-api-key": this.key
        },
        responseType: "stream"
      }
    )
    
    if (res.status !== 200) {
      const error = res.data as IElevenLabsValidationError
      throw new Error(error.detail[0].msg)
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const fileName = `${PATH.outputDir}/${timestamp}.mp3`
    
    res.data.pipe(createWriteStream(fileName))
    return fileName 
  }
}