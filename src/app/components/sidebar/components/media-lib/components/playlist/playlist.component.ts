import { Component, Input } from '@angular/core';
import { RouterService } from '../../../../../../services/router.service';
import { IPlaylist } from '../../../../../../services/playlists-service.service';

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
      e.dataTransfer?.setData('text/plain', `http://localhost:4200${this.url}`);
    }
  }
}
