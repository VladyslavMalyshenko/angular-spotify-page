import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISong } from '../../../../services/playlists-service.service';
import { SongService } from '../../../../services/song.service';

@Component({
  selector: 'app-player',
  templateUrl: './player-template.component.html',
  styleUrl: './player-template.component.scss',
})
export class PlayerTemplateComponent implements OnInit, OnDestroy {
  public currentSong$?: Observable<ISong | undefined>;
  private onKeyDownBind = this.onKeyDown.bind(this);

  constructor(public songService: SongService) {}

  private onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 32) {
      this.songService.pauseSong();
    } else if (e.keyCode === 39) {
      this.songService.skipTo(true);
    } else if (e.keyCode === 37) {
      this.songService.skipTo(false);
    }
  }

  private addKeyEventListener() {
    window.addEventListener('keydown', this.onKeyDownBind);
  }

  private removeKeyEventListener() {
    window.removeEventListener('keydown', this.onKeyDownBind);
  }

  ngOnInit() {
    this.currentSong$ = this.songService.currentSong$;

    this.addKeyEventListener();
  }

  ngOnDestroy() {
    this.removeKeyEventListener();
  }
}
