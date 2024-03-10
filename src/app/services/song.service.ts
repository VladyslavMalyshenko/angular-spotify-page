import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { ISong } from './playlists-service.service';

export interface ISongTime {
  currentTime: number | string | undefined;
  duration: number | string | undefined;
}

class HTMLAudioElementCustom extends HTMLAudioElement {
  constructor() {
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
}

customElements.define('audio-custom', HTMLAudioElementCustom, {
  extends: 'audio',
});

@Injectable({
  providedIn: 'root',
})
export class SongService implements OnDestroy {
  private currentSongSubject: BehaviorSubject<ISong | undefined> =
    new BehaviorSubject<ISong | undefined>(undefined);

  private currentTimeSubject: BehaviorSubject<ISongTime | undefined> =
    new BehaviorSubject<ISongTime | undefined>(undefined);

  public currentSong$: Observable<ISong | undefined> =
    this.currentSongSubject.asObservable();

  public time$: Observable<ISongTime | undefined> =
    this.currentTimeSubject.asObservable();

  public audio?: HTMLAudioElementCustom;
  private timeUpdateSubscription?: Subscription;

  constructor() {
    this.initTimeUpdates();
  }

  private initTimeUpdates(): void {
    this.timeUpdateSubscription = interval(1000).subscribe(() => {
      if (this.audio && !this.audio.paused) {
        const object: ISongTime = {
          currentTime: this.audio.currentTime,
          duration: this.audio.duration,
        };
        this.currentTimeSubject.next(object);
      }
    });
  }

  public createAudioElement(): void {
    this.audio = document.createElement('audio', {
      is: 'audio-custom',
    }) as unknown as HTMLAudioElementCustom;
    this.audio.id = 'audioElement';
    document.body.appendChild(this.audio);
  }

  public playSong(song: ISong): void {
    if (song.id === this.currentSongSubject.value?.id) {
      this.pauseSong();
    } else {
      if (!this.audio) {
        this.createAudioElement();
      }
      this.audio?.pause();
      this.audio?.removeAttribute('src');
      this.audio?.setAttribute('src', song.song);
      // this.audio?.setRate(0.75);
      this.audio?.setVolume(0.5);
      this.audio?.play();
      this.currentSongSubject.next(song);

      if (this.audio) {
        const object: ISongTime = {
          currentTime: this.audio.currentTime,
          duration: this.audio.duration,
        };
        this.currentTimeSubject.next(object);
      }
    }
  }

  public pauseSong() {
    const value = this.currentSongSubject.value;

    if (value && this.audio) {
      if (value.isPaused === undefined) {
        value.isPaused = this.audio.paused;
      }

      if (value.isPaused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
      value.isPaused = this.audio.paused;

      const object: ISongTime = {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration,
      };
      this.currentTimeSubject.next(object);
    }
  }

  public getIsLooped() {
    return this.audio?.loop;
  }

  public toggleIsLooped() {
    this.audio?.setLoop(!this.audio?.loop);
    if (this.audio?.paused) {
      this.pauseSong();
    }
  }

  public getCurrentSong(): ISong | undefined {
    (this.currentSongSubject.value as any).isPaused = this.audio?.paused;

    return this.currentSongSubject.value;
  }

  ngOnDestroy() {
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }
}
