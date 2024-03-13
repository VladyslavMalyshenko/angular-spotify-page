import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {
      return null;
    } else if (!args) {
      return value;
    }

    args = args.toLowerCase();

    return value.filter((item: any) =>
      JSON.stringify(item).toLocaleLowerCase().includes(args)
    );
  }
}
