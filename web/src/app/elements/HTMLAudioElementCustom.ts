import { SongService } from '../services/song.service';

class HTMLAudioElementCustom extends HTMLAudioElement {
  constructor(private songService: SongService) {
    super();
  }

  public setRate(value: number) {
    this.playbackRate = value;
  }

  public setVolume(value: number) {
    this.volume = value;
  }

  public setLoop(value: boolean) {
    this.loop = value;
  }

  public setCurrentTime(value: number) {
    this.currentTime = value;
  }

  public setSource(value: string) {
    this.src = value;
  }

  public skipTo(forward: boolean, step: number) {
    if (forward) {
      if (this.currentTime <= this.duration) {
        this.currentTime += step;
      } else if (this.currentTime >= this.duration) {
        this.songService.switchSong(true);
      }
    } else {
      if (this.currentTime > 0) {
        this.currentTime -= step;
      } else if (this.currentTime < 0) {
        this.currentTime = 0;
      }
    }
  }

  public setMuted(value: boolean) {
    this.muted = value;
  }

  public getVolume() {
    return this.volume;
  }
}

export default HTMLAudioElementCustom;
