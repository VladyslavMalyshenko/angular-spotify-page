import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import {
  ICollection,
  IPlaylist,
  ISong,
  PlaylistsService,
} from './playlists-service.service';

export interface ISongTime {
  currentTime: number;
  duration: number;
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
}

customElements.define('audio-custom', HTMLAudioElementCustom, {
  extends: 'audio',
});

@Injectable({
  providedIn: 'root',
})
export class SongService implements OnDestroy {
  public playlist$?: Subscription | Observable<IPlaylist | undefined>;
  private currentSongSubject: BehaviorSubject<ISong | undefined> =
    new BehaviorSubject<ISong | undefined>(undefined);

  public currentSong$: Observable<ISong | undefined> =
    this.currentSongSubject.asObservable();

  public audio?: HTMLAudioElementCustom;
  private timeUpdateSubscription?: Subscription;

  constructor(
    private playlistService: PlaylistsService,
    private localStorage: LocalStorageService
  ) {}

  public setCurrentTime(value: number) {
    if (this.audio) {
      this.audio.setCurrentTime(value);
    }
  }

  public switchSong(isNext: boolean = true) {
    const currentSong: ISong = this.getCurrentSong() as ISong;

    const transformToNumber = (value: string | number) => {
      if (typeof value === 'string') {
        return parseInt(value);
      } else {
        return value;
      }
    };

    const setNewSong = (data: IPlaylist | ICollection | ISong[]) => {
      let newSong;
      const time = this.getCurrentSongTime();
      const songs = (data as IPlaylist | ICollection).songs
        ? (data as IPlaylist | ICollection).songs
        : (data as ISong[]);

      if (songs) {
        const isSongId = currentSong.songId ? true : false;
        const lastArrayElement = songs[songs.length - 1];
        if (isNext === true) {
          const nextId = isSongId
            ? transformToNumber(currentSong.songId) + 1
            : transformToNumber(currentSong.id) + 1;

          const maxIdRaw = isSongId
            ? lastArrayElement.songId
            : lastArrayElement.id;
          const maxId =
            typeof maxIdRaw === 'string' ? parseInt(maxIdRaw) : maxIdRaw;

          if (nextId <= maxIdRaw) {
            newSong = songs.find((song: ISong) => {
              const songId = isSongId
                ? song.songId
                : typeof song.id === 'string'
                ? parseInt(song.id)
                : song.id;
              return songId === nextId;
            });
          } else {
            newSong = songs[0];
          }
        } else {
          if (time && time.currentTime < 2) {
            const previousId = isSongId
              ? transformToNumber(currentSong.songId) - 2
              : transformToNumber(currentSong.id) - 2;

            if (previousId >= 0) {
              newSong = songs[previousId];
            } else {
              const newSongId = isSongId
                ? lastArrayElement.songId
                : lastArrayElement.id;

              newSong = songs.find((song: ISong) =>
                isSongId ? song.songId === newSongId : song.id === newSongId
              );
            }
          } else {
            this.setCurrentTime(0);
          }
        }
      }

      this.setCurrentSong(newSong as ISong);
    };

    const playlistId: number = currentSong?.playlistId;

    if (playlistId > 0) {
      this.playlistService
        .getPlaylist(playlistId)
        .subscribe((data: IPlaylist | ICollection) => setNewSong(data));
    } else if (playlistId === 0) {
      this.playlistService
        .getCollection()
        .subscribe((data: IPlaylist | ICollection) => setNewSong(data));
    } else if (!playlistId) {
      this.playlistService
        .getSongs()
        .subscribe((data: ISong[]) => setNewSong(data));
    }
  }

  public createAudioElement(): void {
    this.audio = document.createElement('audio', {
      is: 'audio-custom',
    }) as unknown as HTMLAudioElementCustom;
    this.audio.id = 'audioElement';

    this.audio.addEventListener('ended', () => this.switchSong(true));

    document.body.appendChild(this.audio);
  }

  public playSong(song: ISong, isPausedByDefault: boolean = false): void {
    if (
      song.id === this.currentSongSubject.value?.id &&
      song.playlistId === this.currentSongSubject.value?.playlistId &&
      this.audio
    ) {
      this.pauseSong();
    } else {
      if (!this.audio) {
        this.createAudioElement();
      }

      this.audio?.pause();
      this.audio?.removeAttribute('src');
      this.audio?.setSource(song.song);
      this.audio?.setVolume(0.5);
      this.audio?.load();
      if (!isPausedByDefault) {
        const play = this.audio?.play();

        if (play !== undefined) {
          play
            .then((_) => {})
            .catch(() => {
              this.pauseSong();
            });
        }
      }

      this.currentSongSubject.next(song);
      (this.currentSongSubject.value as ISong).isPaused = isPausedByDefault;
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
    if (this.currentSongSubject.value) {
      (this.currentSongSubject.value as ISong).isPaused = this.audio?.paused;

      this.updateCurrentSong();

      return this.currentSongSubject.value;
    } else {
      return;
    }
  }

  public setCurrentSong(newSong: ISong): ISong | undefined {
    this.playSong(newSong);
    return newSong;
  }

  public getCurrentSongTime(): ISongTime | undefined {
    if (this.audio) {
      return {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration,
      };
    } else {
      return undefined;
    }
  }

  public isCurrentSong(song: ISong) {
    const currentSong = this.getCurrentSong() as ISong;

    if (currentSong) {
      return (
        currentSong.id === song.id && currentSong.playlistId === song.playlistId
      );
    } else {
      return false;
    }
  }

  public isCurrentSongPaused() {
    const currentSong = this.getCurrentSong() as ISong;

    if (currentSong) {
      return currentSong.isPaused;
    } else {
      return true;
    }
  }

  public updateCurrentSong() {
    if (this.audio) {
      const newSongObject: ISong | undefined = this.currentSongSubject.value;

      if (newSongObject) {
        newSongObject.currentTime = this.audio.currentTime;
        this.localStorage.setLocalStorage(
          'currentSong',
          JSON.stringify(newSongObject)
        );
      }
    }
  }

  public restoreCurrentSong() {
    const currentSong = this.getCurrentSong();

    if (!currentSong) {
      try {
        const song = JSON.parse(
          this.localStorage.getLocalStorage('currentSong')
        ) as ISong;

        if (song) {
          if (song && song.id) {
            if (song.id && song.playlistId > 0 && song.songId) {
              this.playlistService
                .getPlaylists()
                .subscribe((data: IPlaylist[]) => {
                  const playlist = data.find(
                    (playlistItem: IPlaylist) =>
                      song.playlistId == playlistItem.id
                  );

                  if (playlist && playlist.songs) {
                    const songFound = playlist.songs.find(
                      (dataSong: ISong) =>
                        dataSong.id === song.id &&
                        dataSong.songId === song.songId &&
                        dataSong.playlistId === song.playlistId
                    );

                    if (songFound) {
                      this.playSong(songFound, song.isPaused ?? true);
                      this.audio?.setCurrentTime(
                        (song.currentTime as number) ?? 0
                      );
                    }
                  }
                });
            } else if (song.id && song.playlistId == 0 && song.songId) {
              this.playlistService
                .getCollection()
                .subscribe((data: ICollection) => {
                  if (data && data.songs) {
                    const songFound = data.songs.find(
                      (dataSong: ISong) =>
                        dataSong.id === song.id &&
                        dataSong.songId === song.songId &&
                        dataSong.playlistId === song.playlistId
                    );

                    if (songFound) {
                      this.playSong(songFound, song.isPaused ?? true);
                      this.audio?.setCurrentTime(
                        (song.currentTime as number) ?? 0
                      );
                    }
                  }
                });
            } else if (song.id && !song.playlistId) {
              this.playlistService.getSongs().subscribe((data: ISong[]) => {
                const songFound = data.find(
                  (dataSong: ISong) => dataSong.id === song.id
                );

                if (songFound) {
                  this.playSong(songFound, song.isPaused ?? true);
                  this.audio?.setCurrentTime((song.currentTime as number) ?? 0);
                }
              });
            }
          }
        }
      } catch (err) {
        return;
      }
    }
  }

  ngOnDestroy() {
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }
}
