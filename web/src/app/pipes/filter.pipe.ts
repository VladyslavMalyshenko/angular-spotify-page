import { Pipe, PipeTransform } from '@angular/core';
import { IPlaylist, ISong } from '../services/playlists-service.service';

@Pipe({
  name: 'appFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: ISong[] | IPlaylist[], args?: string): any {
    if (!value) {
      return null;
    } else if (!args) {
      return value;
    }

    args = args.toLowerCase();

    const result = value.filter((item: ISong | IPlaylist) =>
      JSON.stringify(item)
        .toLocaleLowerCase()
        .includes(args as string)
    );

    return result;
  }
}
