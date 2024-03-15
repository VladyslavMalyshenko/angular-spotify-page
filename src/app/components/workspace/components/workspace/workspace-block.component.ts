import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class WorkspaceBlockComponent implements OnInit {
  public playlist$?: Observable<IPlaylist>;
  public currentSong$?: Observable<ISong | undefined>;
  public path?: string;

  @ViewChild('workspace') workspace?: ElementRef<HTMLDivElement>;

  constructor(
    public route: ActivatedRoute,
    public songService: SongService,
    private playlistService: PlaylistsService
  ) {}

  ngOnInit() {
    this.path = this.route.snapshot.routeConfig?.path;

    if (this.path === 'collection/songs') {
      this.playlist$ = this.playlistService.getCollection();
    } else if (this.path === 'playlist/:id') {
      const id: string | null = this.route.snapshot.paramMap.get('id');
      if (id !== null) {
        this.playlist$ = this.playlistService.getPlaylist(parseInt(id));
      }
    }

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
