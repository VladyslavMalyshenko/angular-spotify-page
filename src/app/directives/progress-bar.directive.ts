import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ISongTime, SongService } from '../services/song.service';

@Directive({
  selector: '[appProgressBar]',
})
export class ProgressDirective implements OnInit, OnDestroy {
  private isMouseDown = false;
  private isMoving = false;

  constructor(private el: ElementRef, private songService: SongService) {}

  public onTimeUpdate = () => {
    const time: ISongTime = this.songService.getCurrentSongTime() as ISongTime;

    if (
      time &&
      time.currentTime !== undefined &&
      time.duration !== undefined &&
      !this.isMoving
    ) {
      const duration: number = time.duration;
      const currentTime: number = time.currentTime;
      const progressBarElement = this.el.nativeElement.children[0];

      const progress = `${(currentTime / duration) * 100}%`;

      progressBarElement.style.width = progress;
    }
  };

  private addEventListeners(): void {
    this.songService.audio?.addEventListener('timeupdate', this.onTimeUpdate);

    this.el.nativeElement.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private removeEventListeners(): void {
    this.songService.audio?.removeEventListener(
      'timeupdate',
      this.onTimeUpdate
    );

    this.el.nativeElement.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  ngOnInit(): void {
    this.addEventListeners();
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  // Mouse events
  private onMouseDown = () => {
    this.isMouseDown = true;
    this.isMoving = true;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isMouseDown) {
      const progressBarElement = this.el.nativeElement.children[0];
      const newWidth: number =
        ((e.clientX - this.el.nativeElement.getBoundingClientRect().left) *
          100) /
        this.el.nativeElement.clientWidth;
      progressBarElement.style.width = `${newWidth}%`;
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (this.isMouseDown) {
      const time: ISongTime =
        this.songService.getCurrentSongTime() as ISongTime;
      const newWidth: number =
        ((e.clientX - this.el.nativeElement.getBoundingClientRect().left) *
          100) /
        this.el.nativeElement.clientWidth;
      const newTime = (time.duration * newWidth) / 100;
      this.songService.setCurrentTime(newTime);
      this.isMouseDown = false;
      this.isMoving = false;
    }
  };
}
