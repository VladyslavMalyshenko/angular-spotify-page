import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SongService } from '../../../../services/song.service';

@Component({
  selector: 'app-player',
  templateUrl: './player-template.component.html',
  styleUrl: './player-template.component.scss',
})
export class PlayerTemplateComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private onKeyDownBind = this.onKeyDown.bind(this);

  constructor(public songService: SongService) {}

  private onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 32) {
      this.songService.pauseSong();
    } else if (e.keyCode === 39) {
      this.songService.skipTo(true);
    } else if (e.keyCode === 37) {
      this.songService.skipTo(false);
    } else if (e.keyCode === 38) {
      this.songService.changeVolume(true);
    } else if (e.keyCode === 40) {
      this.songService.changeVolume(false);
    }
  }

  private addKeyEventListener() {
    window.addEventListener('keydown', this.onKeyDownBind);
  }

  private removeKeyEventListener() {
    window.removeEventListener('keydown', this.onKeyDownBind);
  }

  ngOnInit() {
    this.addKeyEventListener();
  }

  ngAfterViewInit() {
    this.songService.getCurrentSongVolume();
  }

  ngOnDestroy() {
    this.removeKeyEventListener();
  }
}
