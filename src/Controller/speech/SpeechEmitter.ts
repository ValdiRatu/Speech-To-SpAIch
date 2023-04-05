import { createReadStream } from "fs";
import { AudioIO, AudioOptions, SampleFormat16Bit } from "naudiodon";
const StreamSkip = require("stream-skip");

/**
 * only works with wav files so far
 */
export class SpeechEmitter {
  /**
   * TODO: make this more dynamic using naudiondon's getDevices()
   */
  private static defaultAudioOptions: AudioOptions = {
    sampleRate: 44100,
    channelCount: 1,
    sampleFormat: SampleFormat16Bit,
    deviceId: 9,
    closeOnError: true
  }

  public static emit(filePath: string, options: Partial<AudioOptions> = {}) {
    const audioIO = AudioIO({
      outOptions: {
        ...this.defaultAudioOptions,
        ...options
      }
    })

    const fileStream = createReadStream(filePath)

    /**
     * skip number of first bytes because there is a clap sound when converting 
     * from mp3 to wav 
     */
    fileStream.pipe(new StreamSkip({ skip: 1300 })).pipe(audioIO)
    audioIO.start()
  }
}