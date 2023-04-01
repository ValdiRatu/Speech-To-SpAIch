import { AudioIO, AudioOptions, IoStreamRead, SampleFormat16Bit } from "naudiodon";
import { FileWriter } from "wav";
import { PATH } from "../../utils/Paths";

export class SpeechRecorder {
  private static audioIO: undefined | IoStreamRead
  private static defaultAudioOptions: AudioOptions = {
    sampleRate: 44100,
    channelCount: 1,
    // channelCount: 1, // check this
    sampleFormat: SampleFormat16Bit,
    deviceId: 3, // Microphone  
    closeOnError: true,
  }

  public static record(options: Partial<AudioOptions> = {}): string {
    if (this.audioIO) {
      throw new Error("Already recording speech stream")
    }
    this.audioIO = AudioIO({
      inOptions: {
        ...this.defaultAudioOptions,
        ...options,
      }
    })
    const timestamp = Math.floor(Date.now() / 1000);
    const fileName = `speech-${timestamp}.wav`;
    const filePath = `${PATH.inputDir}/${fileName}`

    const fileStream = new FileWriter(filePath, {
      ...this.defaultAudioOptions,
      channels: this.defaultAudioOptions.channelCount,
      bitDepth: this.defaultAudioOptions.sampleFormat,
    })

    this.audioIO.pipe(fileStream)

    /**
     * Because for some reason, there is no built in way to mute
     * naudiodon's logs so we have to resort to this :pensive:
     */
    this.audioIO.start();

    return fileName;
  }

  public static stopRecording(): void {
    if (!this.audioIO) {
      return
    }
    this.audioIO.quit();
    this.audioIO = undefined;
  }

}