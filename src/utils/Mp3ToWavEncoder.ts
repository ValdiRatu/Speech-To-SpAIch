import { Lame } from "node-lame";
import { PATH } from "./Paths";

export class Mp3ToWavEncoder {
  public static async encode(filePath: string, newFileName?: string): Promise<string> {
    const fileName = newFileName ? newFileName : filePath.split("/").pop().split(".")[0]
    const newFilePath = `${PATH.outputDir}/${fileName}.wav`

    /**
     * because node-lame is from the perspective of mp3 encoding / decoding
     * we use the word "decode" to mean "encode" to wav LMAO
     */
    const decoder = new Lame({
      output: newFilePath
    }).setFile(filePath);

    await decoder.decode();
    return newFilePath
  }
}