import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PlayerModule } from '../components/player/player.module';
import { SidebarModule } from '../components/sidebar/sidebar.module';
import { WorkspaceModule } from '../components/workspace/workspace.module';
import { SongService } from '../services/song.service';
import { MainComponent } from './components/main/main.component';
import { MainPageRoutingModule } from './main-page-routing.module';

@NgModule({
  imports: [
    MainPageRoutingModule,
    SidebarModule,
    WorkspaceModule,
    PlayerModule,
    HttpClientModule,
  ],
  declarations: [MainComponent],
  providers: [SongService],
})
export class MainPageModule {}
