import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private activeRoute: ActivatedRoute, private router: Router) {}

  public navigateTo = (value: any[]) => {
    this.router.navigate(value);
  };

  public getCurrentRoute() {
    return this.router.url;
  }

  public compareUrls(value: string) {
    return this.router.url.includes(value);
  }

  public getParam(route: ActivatedRoute, paramName: string): string | null {
    return route.snapshot.paramMap.get(paramName);
  }
}
