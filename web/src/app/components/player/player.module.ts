import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressDirective } from '../../directives/progress-bar.directive';
import { VolumeDirective } from '../../directives/volume.directive';
import { FormatTimePipe } from '../../pipes/time-format.pipe';
import { PlayerTemplateComponent } from './components/player-template/player-template.component';

@NgModule({
  imports: [CommonModule],
  exports: [PlayerTemplateComponent, ProgressDirective],
  declarations: [
    PlayerTemplateComponent,
    FormatTimePipe,
    ProgressDirective,
    VolumeDirective,
  ],
  providers: [],
})
export class PlayerModule {}
