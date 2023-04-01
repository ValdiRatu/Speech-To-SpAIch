import * as dotenv from "dotenv";
dotenv.config()

export const config = {
  openAIApiKey: process.env.OPEN_AI_API_KEY || "",
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY || "" 
}
