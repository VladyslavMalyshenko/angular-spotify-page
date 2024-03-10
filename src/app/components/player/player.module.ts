import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressDirective } from '../../directives/progress-bar.directive';
import { FormatTimePipe } from '../../pipes/time-format.pipe';
import { PlayerTemplateComponent } from './components/player-template/player-template.component';

@NgModule({
  imports: [CommonModule],
  exports: [PlayerTemplateComponent, ProgressDirective],
  declarations: [PlayerTemplateComponent, FormatTimePipe, ProgressDirective],
  providers: [],
})
export class PlayerModule {}
