import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ISong {
  id: number;
  name: string;
  image: string;
  creator: string;
  song: string;
  isPaused?: boolean;
}

export interface IPlaylist {
  id?: number;
  name?: string;
  image?: string;
  user?: string;
  songs?: ISong[];
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistsService {
  constructor(private _httpClient: HttpClient) {}

  public getPlaylists(): Observable<IPlaylist[]> {
    return this._httpClient.get<IPlaylist[]>('http://localhost:4201/playlists');
  }

  public getPlaylist(id: number): Observable<IPlaylist> {
    return this._httpClient
      .get<IPlaylist[]>(`http://localhost:4201/playlists?id=${id}`)
      .pipe(map((data: IPlaylist[]) => data[0]));
  }

  public getCollection(): Observable<any> {
    return this._httpClient.get<any>(`http://localhost:4201/collection`);
  }
}
