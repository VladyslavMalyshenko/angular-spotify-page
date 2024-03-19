import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environment.dev';
import { transformToNumber } from '../utils/transformToNumber';
import {
  ICollection,
  IPlaylist,
  ISong,
  PlaylistsService,
} from './playlists-service.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  public favoriteStatuses: { [id: string]: boolean } = {};

  constructor(
    private _httpClient: HttpClient,
    private playlistService: PlaylistsService
  ) {}

  private updateSongsIndexes(songs: ISong[]) {
    songs.forEach((song, index) => {
      songs[0].songId = 1;

      if (index !== 0) {
        song.songId = index + 1;
      }
    });
  }

  private addSongToFavorites(
    collection: ICollection,
    data: ISong
  ): Observable<ISong> {
    const newSong = data;
    const songs = collection.songs as ISong[];

    this.updateSongsIndexes(songs);

    newSong.songId = songs[songs.length - 1]
      ? transformToNumber(songs[songs.length - 1].songId) + 1
      : 1;
    newSong.playlistId = 0;
    songs.push(newSong);

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
    const id = transformToNumber(data.id);
    const index = songs.findIndex(
      (song: ISong) => transformToNumber(song.id) === id
    );

    if (index > -1) {
      songs.splice(index, 1);

      this.updateSongsIndexes(songs);

      delete this.favoriteStatuses[id];

      return this._httpClient.put<ICollection>(
        `${environment.domain}/collection`,
        collection
      );
    } else {
      return of(collection);
    }
  }

  public toggleSongFavoritesData(data: ISong): Observable<ICollection> {
    return this.playlistService.getCollection().pipe(
      tap((collection: ICollection) => {
        const songs = collection.songs as ISong[];
        const songExists = songs.some(
          (song: ISong) =>
            transformToNumber(song.id) === transformToNumber(data.id)
        );

        if (songExists) {
          return this.removeSongFromFavorites(collection, data).subscribe();
        } else {
          return this.addSongToFavorites(collection, data).subscribe();
        }
      })
    );
  }

  public toggleSongFavorites(e: any, song: ISong): void {
    if (e.currentTarget) {
      const classList = e.currentTarget.classList;
      classList.toggle('active');
      if (classList.contains('active')) {
        e.currentTarget.style.setProperty('animation', 'heartBump 1s');
      }
      this.toggleSongFavoritesData(song).subscribe((result) => result);
    }
  }

  public loadFavorites(playlistObs: Observable<IPlaylist | ISong[]>): void {
    if (!playlistObs) {
      return;
    }

    playlistObs
      .pipe(
        switchMap((playlist) =>
          this.playlistService
            .getCollection()
            .pipe(map((collection) => ({ playlist, collection })))
        )
      )
      .subscribe(({ playlist, collection }) => {
        const songs = ((playlist as IPlaylist).songs ?? playlist) as ISong[];
        const songsCollection = collection.songs as ISong[];

        songs.forEach((song) => {
          const id = transformToNumber(song.id);
          this.favoriteStatuses[id] = songsCollection.some(
            (songItem) => transformToNumber(songItem.id) === id
          );
        });
      });
  }
}
