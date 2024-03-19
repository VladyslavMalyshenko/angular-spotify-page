import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public setLocalStorage(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  public getLocalStorage(name: string) {
    return localStorage.getItem(name) ?? '';
  }
}
