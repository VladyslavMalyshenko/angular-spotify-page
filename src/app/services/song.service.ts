import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import {
  ICollection,
  IPlaylist,
  ISong,
  PlaylistsService,
} from './playlists-service.service';

export interface ISongTime {
  currentTime: number | undefined;
  duration: number | undefined;
}

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
        this.songService.onSongEnded();
      }
    } else {
      if (this.currentTime > 0) {
        this.currentTime -= step;
      } else if (this.currentTime < 0) {
        this.currentTime = 0;
      }
    }
  }
}

customElements.define('audio-custom', HTMLAudioElementCustom, {
  extends: 'audio',
});

@Injectable({
  providedIn: 'root',
})
export class SongService implements OnDestroy {
  public playlist$?: Subscription | Observable<any>;
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

  constructor(private playlistService: PlaylistsService) {
    this.initTimeUpdates();
  }

  public setCurrentTime(value: number) {
    if (this.time$ && this.audio && this.currentTimeSubject) {
      (this.time$ as any).currentTime = value;
      (this.currentTimeSubject as any).currentTime = value;
      this.audio?.setCurrentTime(value);
    }
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

  public switchSong(isNext: boolean = true) {
    const currentSong: ISong = this.getCurrentSong() as ISong;

    const setNewSong = (data: IPlaylist | ICollection) => {
      if (data.songs) {
        let newSong;

        if (isNext === true) {
          const nextId = currentSong.songId + 1;

          if (nextId <= data.songs[data.songs.length - 1].songId) {
            newSong = data.songs.find((song: ISong) => song.songId === nextId);
          } else {
            newSong = data.songs[0];
          }
        } else {
          const previousId = currentSong.songId - 2;

          if (previousId >= 0) {
            newSong = data.songs[previousId];
          } else {
            const newSongId = data.songs[data.songs.length - 1].songId;

            newSong = data.songs.find(
              (song: ISong) => song.songId === newSongId
            );
          }
        }

        this.setCurrentSong(newSong as ISong);
      }
    };

    const playlistId: number = currentSong?.playlistId;

    if (playlistId !== 0) {
      this.playlistService
        .getPlaylist(playlistId)
        .subscribe((data: IPlaylist | ICollection) => setNewSong(data));
    } else {
      this.playlistService
        .getCollection()
        .subscribe((data: IPlaylist | ICollection) => setNewSong(data));
    }
  }

  public onSongEnded() {
    const setNewSong = (data: IPlaylist | ICollection) => {
      if (data.songs) {
        let newSong;

        if (currentSong.songId !== data.songs[data.songs.length - 1].songId) {
          newSong = data.songs.find(
            (song: ISong) => song.songId === currentSong.songId + 1
          );
        } else {
          newSong = data.songs[0];
        }

        this.setCurrentSong(newSong as ISong);
      }
    };

    const currentSong: ISong = this.getCurrentSong() as ISong;
    const playlistId: number = currentSong?.playlistId;

    if (playlistId !== 0) {
      this.playlistService
        .getPlaylist(playlistId)
        .subscribe((data: IPlaylist | ICollection) => setNewSong(data));
    } else {
      this.playlistService
        .getCollection()
        .subscribe((data: IPlaylist | ICollection) => setNewSong(data));
    }
  }

  public createAudioElement(): void {
    this.audio = document.createElement('audio', {
      is: 'audio-custom',
    }) as unknown as HTMLAudioElementCustom;
    this.audio.id = 'audioElement';

    this.audio.addEventListener('ended', () => this.onSongEnded());

    document.body.appendChild(this.audio);
  }

  public playSong(song: ISong): void {
    if (song.id === this.currentSongSubject.value?.id && this.audio) {
      this.pauseSong();
    } else {
      if (!this.audio) {
        this.createAudioElement();
      }

      this.audio?.pause();
      this.audio?.removeAttribute('src');
      this.audio?.setSource(song.song);
      this.audio?.setVolume(0.5);
      this.audio?.play();
      this.currentSongSubject.next(song);
      (this.currentSongSubject.value as any).isPaused = false;

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

  public skipTo(forward: boolean = true, step: number = 5) {
    this.audio?.skipTo(forward, step);
  }

  public getIsLooped() {
    if (this.audio) {
      return this.audio.loop;
    } else {
      return;
    }
  }

  public toggleIsLooped() {
    if (this.audio) {
      this.audio.setLoop(!this.audio?.loop);
      if (this.audio.paused) {
        this.pauseSong();
      }
    }
  }

  public getCurrentSong(): ISong | undefined {
    (this.currentSongSubject.value as any).isPaused = this.audio?.paused;

    return this.currentSongSubject.value;
  }

  public setCurrentSong(newSong: ISong): ISong | undefined {
    this.playSong(newSong);
    return newSong;
  }

  public getCurrentSongDuration() {
    if (this.audio) {
      return this.audio.duration;
    } else {
      return;
    }
  }

  ngOnDestroy() {
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }
}
