import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlaylistsService } from '../../services/playlists-service.service';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreatePopoutComponent } from './components/media-lib/components/create-popout/create-popout.component';
import { PlaylistComponent } from './components/media-lib/components/playlist/playlist.component';
import { MediaLibComponent } from './components/media-lib/media-lib.component';
import { SideBarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SideBarComponent],
  declarations: [
    SideBarComponent,
    MediaLibComponent,
    CategoriesComponent,
    PlaylistComponent,
    CreatePopoutComponent,
  ],
  providers: [PlaylistsService],
})
export class SidebarModule {}
