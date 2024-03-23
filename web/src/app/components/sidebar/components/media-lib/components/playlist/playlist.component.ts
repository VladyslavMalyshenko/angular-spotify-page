import { Component, Input } from '@angular/core';
import { IPlaylist } from '../../../../../../services/playlists-service.service';
import { RouterService } from '../../../../../../services/router.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent {
  @Input() isFavorite?: boolean = false;
  @Input() url!: string;
  @Input() playlist!: IPlaylist;

  constructor(public routerService: RouterService) {}

  onDragStart(e: DragEvent): void {
    if (this.url) {
      e.dataTransfer?.setData(
        'text/plain',
        `${location.protocol}//${location.host}${this.url}`
      );
    }
  }
}
