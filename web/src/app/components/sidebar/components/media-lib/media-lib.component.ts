import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPlaylist,
  PlaylistsService,
} from '../../../../services/playlists-service.service';

@Component({
  selector: 'app-media-lib',
  templateUrl: './media-lib.component.html',
  styleUrl: './media-lib.component.scss',
})
export class MediaLibComponent implements OnInit {
  public playlist_1 = '../../../../../assets/playlist_1.jpg';
  public createPlaylist = false;

  public playlists$?: Observable<IPlaylist[]>;

  constructor(private playlistService: PlaylistsService) {}

  public changeState(value: boolean) {
    this.createPlaylist = value;
  }
  ngOnInit(): void {
    this.playlists$ = this.playlistService.getPlaylists();
  }
}
