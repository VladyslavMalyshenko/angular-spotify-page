import { NgModule } from '@angular/core';
import { SidebarModule } from '../components/sidebar/sidebar.module';
import { WorkspaceModule } from '../components/workspace/workspace.module';
import { MainComponent } from './components/main/main.component';
import { MainPageRoutingModule } from './main-page-routing.module';

@NgModule({
  imports: [MainPageRoutingModule, SidebarModule, WorkspaceModule],
  declarations: [MainComponent],
  providers: [],
})
export class MainPageModule {}
