import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { environment } from '../../environment.dev';

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

  private addSongToFavorites(
    collection: ICollection,
    data: ISong
  ): Observable<ISong> {
    collection.songs?.push(data);

    return this._httpClient.put<ISong>(
      `${environment.domain}/collection`,
      collection
    );
  }

  private removeSongFromFavorites(
    collection: ICollection,
    data: ISong
  ): Observable<ICollection> {
    const songs = collection.songs as ISong[];
    const index = songs.findIndex((song: ISong) => song.id === data.id);

    if (index > -1) {
      songs.splice(index, 1);
      return this._httpClient.put<ICollection>(
        `${environment.domain}/collection`,
        collection
      );
    } else {
      return of(collection);
    }
  }

  public toggleSongFavorites(data: ISong): Observable<ICollection> {
    return this.getCollection().pipe(
      tap((collection: ICollection) => {
        const songs = collection.songs as ISong[];
        const songExists = songs.some((song: ISong) => song.id === data.id);

        if (songExists) {
          return this.removeSongFromFavorites(collection, data).subscribe();
        } else {
          return this.addSongToFavorites(collection, data).subscribe();
        }
      })
    );
  }

  public checkIfFavorite(data: ISong): Observable<boolean> {
    return this.getCollection().pipe(
      map((collection: ICollection) => {
        const songs = collection.songs as ISong[];
        return songs.some((song: ISong) => song.id === data.id);
      })
    );
  }
}
