import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlaylistsService } from '../../services/playlists-service.service';
import { CategoriesComponent } from './components/categories/categories.component';
import { PlaylistComponent } from './components/media-lib/components/playlist/playlist.component';
import { MediaLibComponent } from './components/media-lib/media-lib.component';
import { SideBarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  imports: [RouterModule, CommonModule, HttpClientModule],
  exports: [SideBarComponent],
  declarations: [
    SideBarComponent,
    MediaLibComponent,
    CategoriesComponent,
    PlaylistComponent,
  ],
  providers: [PlaylistsService],
})
export class SidebarModule {}
