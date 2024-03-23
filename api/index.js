import express from "express";
import playlistsRoutes from "./routes/playlists.js";

const app = express();

app.use(playlistsRoutes);

app.listen(process.env.PORT ?? 4202);
