# db.json
You need to create db.json file in root folder of project and here is a template of data:

```
{
  "collection": {
    "songs": [
      {
        "id": number,
        "name": "string",
        "image": "string",
        "creator": "string",
        "song": "string"
      },
    ]
  },
  "playlists": [
    {
      "id": number,
      "name": "string",
      "image": "string",
      "user": "string",
      "songs": [
        {
          "id": number,
          "name": "string",
          "image": "string",
          "creator": "string",
          "song": "string"
        }
      ]
    }
  ]
}

```