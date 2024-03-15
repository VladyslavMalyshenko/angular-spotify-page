import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent {
  @Input() image: string | undefined =
    '../../../../../../assets/playlist_1.jpg';
  @Input() isFavorite?: boolean = false;
  @Input() url!: string;

  onDragStart(e: DragEvent): void {
    if (this.url) {
      e.dataTransfer?.setData(
        'text/plain',
        `http://localhost:4200${this.url}`
      );
    }
  }
}
