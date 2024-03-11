import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SongService } from '../services/song.service';

@Directive({
  selector: '[appProgressBar]',
})
export class ProgressDirective implements OnInit, OnDestroy {
  private timeUpdateSubscription?: Subscription;

  constructor(private el: ElementRef, private songService: SongService) {}

  ngOnInit(): void {
    this.timeUpdateSubscription = this.songService.time$.subscribe((time) => {
      if (
        time &&
        time.currentTime !== undefined &&
        time.duration !== undefined
      ) {
        const duration: number = time.duration;
        const currentTime: number = time.currentTime;

        const progressBarElement = this.el.nativeElement.children[0];

        let progress = `${(currentTime / duration) * 100}%`;

        progressBarElement.style.width = progress;

        this.el.nativeElement.onclick = (e: any) => {
          const newWidth: number =
            (e.offsetX * 100) / this.el.nativeElement.clientWidth;

          progressBarElement.style.width = `${newWidth}%`;

          const newTime = (duration * newWidth) / 100;

          this.songService.setCurrentTime(newTime);
        };
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }
}
