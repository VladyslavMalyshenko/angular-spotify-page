import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPlaylist,
  ISong,
  PlaylistsService,
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
  favoriteStatuses: { [id: string]: boolean } = {};

  public currentSong$?: Observable<ISong | undefined>;

  constructor(
    public songService: SongService,
    public playlistService: PlaylistsService
  ) {}

  public toggleSongFavorites(e: any, song: ISong): void {
    if (e.currentTarget) {
      e.currentTarget.classList.toggle('active');
      this.playlistService
        .toggleSongFavorites(song)
        .subscribe((result) => result);
    }
  }

  loadFavorites() {
    this.playlistService.getCollection().subscribe(() => {
      this.playlist?.subscribe((playlist: IPlaylist) => {
        const songs = playlist.songs as ISong[];
        songs.forEach((song: ISong) => {
          this.playlistService.checkIfFavorite(song).subscribe((isFavorite) => {
            this.favoriteStatuses[song.id] = isFavorite;
          });
        });
      });
    });
  }

  ngAfterViewInit() {
    this.currentSong$ = this.songService.currentSong$;
    this.loadFavorites();
  }
}
