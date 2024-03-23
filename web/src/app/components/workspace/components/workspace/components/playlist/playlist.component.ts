import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../../../../../../services/favorites.service';
import {
  IPlaylist,
  ISong,
  PlaylistsService,
} from '../../../../../../services/playlists-service.service';
import { RouterService } from '../../../../../../services/router.service';
import { SongService } from '../../../../../../services/song.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements AfterViewInit {
  @Input() playlist?: Observable<any>;

  public currentSong$?: Observable<ISong | undefined>;
  public playlists$?: Observable<IPlaylist[]>;

  constructor(
    public songService: SongService,
    public playlistService: PlaylistsService,
    public favoritesService: FavoritesService,
    public routerService: RouterService
  ) {}

  public addSongToPlaylist(
    song: ISong,
    playlistId: string | number | undefined
  ) {
    this.playlistService
      .addSongToPlaylist(song, playlistId as string | number)
      .subscribe();
  }

  ngAfterViewInit() {
    this.currentSong$ = this.songService.currentSong$;
    this.favoritesService.loadFavorites(this.playlist as Observable<IPlaylist>);
    this.playlists$ = this.playlistService.getPlaylists();
  }
}
