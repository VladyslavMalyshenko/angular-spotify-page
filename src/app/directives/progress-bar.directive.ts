import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SongService } from '../services/song.service';

@Directive({
  selector: '[appProgressBar]',
})
export class ProgressDirective implements OnInit, OnDestroy {
  private timeUpdateSubscription?: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.timeUpdateSubscription = this.songService.time$.subscribe((time) => {
      if (
        time &&
        time.currentTime !== undefined &&
        time.duration !== undefined
      ) {
        const progressPercentage =
          ((time.currentTime as any) / (time.duration as any)) * 100;
        this.renderer.setStyle(
          this.el.nativeElement,
          'width',
          `${progressPercentage}%`
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }
}
