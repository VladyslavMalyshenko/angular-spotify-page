### This project was inspired by [Spotify](https://www.spotify.com/).

# db.json

You need to create `db.json` file in root folder of project and here is a template of data:

```
{
  "collection": {
    "id": number,
    "color": string,
    "songs": [
        {
          "id": number,
          "songId": number,
          "playlistId": number (set 0),
          "name": string,
          "image": string,
          "creator": string,
          "song": string
        }
        ...
    ]
  },
  "playlists": [
    {
      "id": number,
      "name": string,
      "image": string,
      "user": string,
      "color": string,
      "songs": [
        {
          "id": number,
          "songId": number,
          "playlistId": number,
          "name": string,
          "image": string,
          "creator": string,
          "song": string
        }
        ...
      ]
    }
    ...
  ],
  "songs": [
    {
      "id": number,
      "name": string
      "image": string,
      "creator": string,
      "song": string
    }
    ...
  ]
}
```
