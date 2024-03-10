import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISong } from '../../../../services/playlists-service.service';
import { SongService } from '../../../../services/song.service';

@Component({
  selector: 'app-player',
  templateUrl: './player-template.component.html',
  styleUrl: './player-template.component.scss',
})
export class PlayerTemplateComponent implements OnInit {
  public currentSong$?: Observable<ISong | undefined>;
  public songTime$?: Observable<any>;

  constructor(public songService: SongService) {}

  ngOnInit() {
    this.currentSong$ = this.songService.currentSong$;
    this.songTime$ = this.songService.time$;
  }
}
