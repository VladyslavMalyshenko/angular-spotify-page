import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';

@Directive({
  selector: '[appVolume]',
})
export class VolumeDirective implements OnInit, OnDestroy {
  private isMouseDown = false;
  private isMoving = false;

  constructor(private el: ElementRef, private songService: SongService) {}

  public onVolumeUpdate = () => {
    const volume: number = this.songService.getCurrentSongVolume();

    if (volume >= 0 || (volume <= 1 && !this.isMoving)) {
      const maxVolume: number = 1;
      const currentVolume: number = volume;
      const progressBarElement = this.el.nativeElement.children[0];

      const progress = `${(currentVolume / maxVolume) * 100}%`;

      progressBarElement.style.width = progress;
    }
  };

  private addEventListeners(): void {
    this.songService.audio?.addEventListener(
      'volumechange',
      this.onVolumeUpdate
    );

    this.el.nativeElement.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private removeEventListeners(): void {
    this.songService.audio?.addEventListener(
      'volumechange',
      this.onVolumeUpdate
    );

    this.el.nativeElement.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  ngOnInit(): void {
    this.onVolumeUpdate();
    this.addEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private setProgress(e: MouseEvent) {
    const progressBarElement = this.el.nativeElement.children[0];
    const newWidth: number =
      ((e.clientX - this.el.nativeElement.getBoundingClientRect().left) * 100) /
      this.el.nativeElement.clientWidth;
    progressBarElement.style.width = `${newWidth}%`;
    const newVolume = newWidth / 100;
    this.songService.setVolume(newVolume);
  }

  // Mouse events
  private onMouseDown = (e: MouseEvent) => {
    this.isMouseDown = true;
    this.isMoving = true;
    this.setProgress(e);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown) {
      this.setProgress(e);
    }
  };

  private onMouseUp = () => {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.isMoving = false;
    }
  };
}
