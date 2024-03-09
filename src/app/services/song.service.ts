import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISong } from './playlists-service.service';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private currentSongSubject: BehaviorSubject<ISong | undefined> =
    new BehaviorSubject<ISong | undefined>(undefined);
  public currentSong$: Observable<ISong | undefined> =
    this.currentSongSubject.asObservable();
  public audio?: HTMLAudioElement;

  constructor() {}

  public createAudioElement(): void {
    this.audio = new Audio();
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
      this.audio?.setAttribute('src', song.song); // Set the song source
      this.audio?.play();
      this.currentSongSubject.next(song);
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

  public getCurrentSong(): ISong | undefined {
    (this.currentSongSubject.value as any).isPaused = this.audio?.paused;

    return this.currentSongSubject.value;
  }
}
