import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../../pipes/filter.pipe';
import { PlaylistsService } from '../../services/playlists-service.service';
import { SongService } from '../../services/song.service';
import { WorkspaceBlockComponent } from './components/workspace/workspace-block.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, FormsModule],
  exports: [WorkspaceBlockComponent],
  declarations: [WorkspaceBlockComponent, SearchFilterPipe],
  providers: [PlaylistsService, SongService, SearchFilterPipe],
})
export class WorkspaceModule {}
