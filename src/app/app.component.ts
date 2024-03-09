import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'angular-webpage';

  ngAfterViewInit(): void {
    const audio = new Audio();
    audio.id = 'audioElement';
    console.log('AUDIO IS HERE: ', audio);
  }
}
