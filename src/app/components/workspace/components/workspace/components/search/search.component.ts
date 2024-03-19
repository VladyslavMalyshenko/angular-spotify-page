import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../../../../../../services/favorites.service';
import {
  IPlaylist,
  ISong,
  PlaylistsService,
} from '../../../../../../services/playlists-service.service';
import { SongService } from '../../../../../../services/song.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Input() path?: string;

  public playlist$?: Observable<IPlaylist>;
  public playlists$?: Observable<IPlaylist[]>;
  public songs$?: Observable<ISong[]>;
  public currentSong$?: Observable<ISong | undefined>;
  public searchRequest: string = '';

  constructor(
    public songService: SongService,
    public playlistService: PlaylistsService,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    if (this.path === 'search' || this.path === 'search/:request') {
      this.songs$ = this.playlistService.getSongs();
      this.playlists$ = this.playlistService.getPlaylists();
    }

    this.favoritesService.loadFavorites(this.songs$ as Observable<ISong[]>);
    this.currentSong$ = this.songService.currentSong$;
  }
}
