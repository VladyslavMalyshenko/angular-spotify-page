import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environment.dev';
import { transformToNumber } from '../utils/transformToNumber';

export interface ISong {
  id: number;
  songId: number;
  playlistId: number;
  name: string;
  image: string;
  creator: string;
  song: string;
  isPaused?: boolean;
  isLooped?: boolean;
  currentTime?: number;
}

export interface IPlaylist {
  id?: number;
  name?: string;
  image?: string;
  user?: string;
  songs?: ISong[];
  color?: string;
}

export interface ICollection {
  id?: number;
  color?: string;
  songs?: ISong[];
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistsService {
  constructor(private _httpClient: HttpClient) {}

  public getPlaylists(): Observable<IPlaylist[]> {
    return this._httpClient.get<IPlaylist[]>(`${environment.domain}/playlists`);
  }

  public getPlaylist(id: number): Observable<IPlaylist> {
    return this._httpClient
      .get<IPlaylist[]>(`${environment.domain}/playlists?id=${id}`)
      .pipe(map((data: IPlaylist[]) => data[0]));
  }

  public getCollection(): Observable<ICollection> {
    return this._httpClient.get<ICollection>(
      `${environment.domain}/collection`
    );
  }

  public getSongs(): Observable<ISong[]> {
    return this._httpClient.get<ISong[]>(`${environment.domain}/songs`);
  }

  public addPlaylist(data: any): Observable<IPlaylist[]> {
    const newData = { ...data };
    delete newData['description'];

    const generateColor = () => {
      return (
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')
          .toUpperCase()
      );
    };
    
    return this.getPlaylists().pipe(
      map((playlists: IPlaylist[]) => playlists[playlists.length - 1]),
      switchMap((lastPlaylist: IPlaylist) => {
        const playlistId = lastPlaylist.id as string | number;

        newData.id = transformToNumber(playlistId) + 1;
        newData.color = generateColor();
        newData.user = 'KAKTyC';

        return this._httpClient.post<IPlaylist>(
          `${environment.domain}/playlists`,
          newData
        );
      }),
      switchMap(() => this.getPlaylists())
    );
  }
}
