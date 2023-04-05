
export class StreamUtils {
  public static async waitForPipe(stream: any): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.on("end", resolve);
    });
  }
}