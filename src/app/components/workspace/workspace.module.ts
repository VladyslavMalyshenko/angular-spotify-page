import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PlaylistsService } from '../../services/playlists-service.service';
import { WorkspaceBlockComponent } from './components/workspace/workspace-block.component';
import { SongService } from '../../services/song.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [WorkspaceBlockComponent],
  declarations: [WorkspaceBlockComponent],
  providers: [PlaylistsService, SongService],
})
export class WorkspaceModule {}
