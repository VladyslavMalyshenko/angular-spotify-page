import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  IPlaylist,
  ISong,
  PlaylistsService,
} from '../../../../services/playlists-service.service';
import { SongService } from '../../../../services/song.service';

@Component({
  selector: 'app-workspace-block',
  templateUrl: './workspace-block.component.html',
  styleUrl: './workspace-block.component.scss',
})
export class WorkspaceBlockComponent implements AfterViewInit {
  public playlist$?: Observable<IPlaylist>;
  public currentSong$?: Observable<ISong | undefined>;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistsService,
    public songService: SongService
  ) {}

  public playSong(song: ISong) {
    this.songService.playSong(song);
  }

  ngAfterViewInit() {
    const path = this.route.snapshot.routeConfig?.path;

    if (path === 'collection/songs') {
      this.playlist$ = this.playlistService.getCollection();
    } else {
      const id: any = this.route.snapshot.paramMap.get('id');
      this.playlist$ = this.playlistService.getPlaylist(parseInt(id));
    }

    this.currentSong$ = this.songService.currentSong$;
  }
}
