import { Component, OnInit } from '@angular/core';
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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  public playlist$?: Observable<IPlaylist>;
  public playlists$?: Observable<IPlaylist[]>;
  public songs$?: Observable<ISong[]>;
  public currentSong$?: Observable<ISong | undefined>;
  public searchRequest: string = '';

  constructor(
    public routerService: RouterService,
    public songService: SongService,
    public playlistService: PlaylistsService,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    if (this.routerService.compareUrls('search')) {
      this.songs$ = this.playlistService.getSongs();
      this.playlists$ = this.playlistService.getPlaylists();
    }

    this.routerService.getCurrentRoute();

    this.favoritesService.loadFavorites(this.songs$ as Observable<ISong[]>);
    this.currentSong$ = this.songService.currentSong$;
  }
}
