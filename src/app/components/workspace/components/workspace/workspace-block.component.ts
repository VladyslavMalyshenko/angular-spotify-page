import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ICollection,
  IPlaylist,
  ISong,
  PlaylistsService,
} from '../../../../services/playlists-service.service';
import { RouterService } from '../../../../services/router.service';
import { SongService } from '../../../../services/song.service';
import { transformToNumber } from '../../../../utils/transformToNumber';

@Component({
  selector: 'app-workspace-block',
  templateUrl: './workspace-block.component.html',
  styleUrl: './workspace-block.component.scss',
})
export class WorkspaceBlockComponent implements OnInit {
  public playlist$?: Observable<IPlaylist | ICollection>;
  public currentSong$?: Observable<ISong | undefined>;
  public path?: string;

  @ViewChild('workspace') workspace?: ElementRef<HTMLDivElement>;

  constructor(
    public route: ActivatedRoute,
    public songService: SongService,
    private playlistService: PlaylistsService,
    private routerService: RouterService
  ) {}

  public initializeWorkspace() {
    this.path = this.routerService.getCurrentRoute();

    if (this.routerService.compareUrls('collection/songs')) {
      this.playlist$ = this.playlistService.getCollection();
    } else if (this.routerService.compareUrls('playlist')) {
      const id: string | null = this.routerService.getParam(this.route, 'id');
      if (id !== null) {
        this.playlist$ = this.playlistService.getPlaylist(
          transformToNumber(id)
        );
      }
    }

    if (this.playlist$) {
      this.playlist$.subscribe(
        (playlist: IPlaylist | ICollection | undefined) => {
          if (this.workspace && playlist && playlist.color) {
            this.workspace.nativeElement.style.setProperty(
              '--first-color',
              playlist.color
            );
          }
        }
      );
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.initializeWorkspace());
  }
}
