import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../../pipes/filter.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { PlaylistsService } from '../../services/playlists-service.service';
import { SongService } from '../../services/song.service';
import { PlaylistComponent } from './components/workspace/components/playlist/playlist.component';
import { SearchComponent } from './components/workspace/components/search/search.component';
import { WorkspaceBlockComponent } from './components/workspace/workspace-block.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, FormsModule],
  exports: [WorkspaceBlockComponent],
  declarations: [
    WorkspaceBlockComponent,
    SearchFilterPipe,
    PlaylistComponent,
    SearchComponent,
  ],
  providers: [
    PlaylistsService,
    SongService,
    SearchFilterPipe,
    FavoritesService,
  ],
})
export class WorkspaceModule {}
