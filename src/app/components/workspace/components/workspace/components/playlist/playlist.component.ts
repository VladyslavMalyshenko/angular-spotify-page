import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPlaylist,
  ISong,
} from '../../../../../../services/playlists-service.service';
import { SongService } from '../../../../../../services/song.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements AfterViewInit {
  @Input() playlist?: Observable<IPlaylist>;
  @Input() path?: string;

  public currentSong$?: Observable<ISong | undefined>;

  constructor(public songService: SongService) {}

  ngAfterViewInit() {
    this.currentSong$ = this.songService.currentSong$;
  }
}
