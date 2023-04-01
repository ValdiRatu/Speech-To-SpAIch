import { Configuration, OpenAIApi } from "openai"
import { config } from "../config"
import { createReadStream } from "fs"

enum OpenAPIModels { 
  whisper_1 = "whisper-1",
}
export class OpenAPIWrapper {
  private static configuration = new Configuration({
    apiKey: config.openAIApiKey
  })

  public static async getTextFromSpeech(filePath: string): Promise<string> {
    const client = new OpenAIApi(this.configuration)

    const file = createReadStream(filePath)
    const res = await client.createTranscription(file as any as File, OpenAPIModels.whisper_1) 

    return res.data.text
  }
}