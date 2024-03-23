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
    if (e.key === 'ArrowRight') {
      this.songService.skipTo(true);
    } else if (e.key === 'ArrowLeft') {
      this.songService.skipTo(false);
    } else if (e.key === 'ArrowUp') {
      this.songService.changeVolume(true);
    } else if (e.key === 'ArrowDown') {
      this.songService.changeVolume(false);
    } else if (e.key === 'm') {
      this.songService.muteAudio();
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
