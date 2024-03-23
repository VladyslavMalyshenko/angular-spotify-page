import { Component, OnInit } from '@angular/core';
import { SongService } from '../../../services/song.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.songService.restoreCurrentSong();
  }
}
