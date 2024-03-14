import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  public playlists$?: Observable<IPlaylist[]>;
  public songs$?: Observable<ISong[]>;
  public currentSong$?: Observable<ISong | undefined>;
  public path?: string;
  public searchRequest: string = '';

  @ViewChild('workspace') workspace?: ElementRef<HTMLDivElement>;

  constructor(
    public route: ActivatedRoute,
    private playlistService: PlaylistsService,
    public songService: SongService
  ) {}

  public playSong(song: ISong) {
    this.songService.playSong(song);
  }

  ngAfterViewInit() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        this.songService.pauseSong();
      } else if (e.keyCode === 39) {
        this.songService.skipTo(true);
      } else if (e.keyCode === 37) {
        this.songService.skipTo(false);
      }
    });

    this.path = this.route.snapshot.routeConfig?.path;

    if (this.path === 'collection/songs') {
      this.playlist$ = this.playlistService.getCollection();
    } else if (this.path === 'playlist/:id') {
      const id: string | null = this.route.snapshot.paramMap.get('id');
      if (id !== null) {
        this.playlist$ = this.playlistService.getPlaylist(parseInt(id));
      }
    } else if (this.path === 'search' || this.path === 'search/:request') {
      this.songs$ = this.playlistService.getSongs();
      this.playlists$ = this.playlistService.getPlaylists();
    }

    this.currentSong$ = this.songService.currentSong$;

    if (this.playlist$) {
      this.playlist$.subscribe((playlist: IPlaylist | undefined) => {
        if (this.workspace && playlist && playlist.color) {
          this.workspace.nativeElement.style.setProperty(
            '--first-color',
            playlist.color
          );
        }
      });
    }
  }
}
