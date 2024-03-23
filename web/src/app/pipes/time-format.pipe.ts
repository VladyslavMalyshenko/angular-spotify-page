import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '0:00';
    }

    const minutes: number = Math.floor(value / 60);
    const seconds: number = Math.floor(value % 60);

    const formattedMinutes: string =
      minutes < 10 ? `0${minutes}` : minutes.toString();
    const formattedSeconds: string =
      seconds < 10 ? `0${seconds}` : seconds.toString();

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
