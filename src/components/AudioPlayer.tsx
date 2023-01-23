import { Box, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import Button from "@mui/material/Button";
import theme from "@/theme";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import CardMedia from "@mui/material/CardMedia";
import Fab from "@mui/material/Fab";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { MapsetWithMaps } from "@/types";
import { useEffect, useRef, useState } from "react";

function formatDuration(milliseconds: number) {
  let hours = 0,
    minutes = 0,
    seconds = 0;

  while (milliseconds >= 3600000) (milliseconds -= 3600000), hours++;
  while (milliseconds >= 60000) (milliseconds -= 60000), minutes++;
  while (milliseconds >= 1000) (milliseconds -= 1000), seconds++;

  return `${hours ? `${hours}:` : ""}${
    hours ? minutes.toString().padStart(2, "0") : minutes
  }:${seconds.toString().padStart(2, "0")}`;
}

const AudioPlayer = (props: any) => {
  const { mapset, ...other }: { mapset: MapsetWithMaps; other: any } = props;
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef && audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef && audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplaying = () => setPlaying(true);
    }
  }, [audioRef]);

  useEffect(() => {
    const interval = setInterval(() =>
      setProgress(
        ((audioRef.current?.currentTime || 0) /
          (audioRef.current?.duration || 100)) *
          100
      )
    );
    return () => clearInterval(interval);
  });

  return (
    <Snackbar
      sx={{ padding: "none", minWidth: { sm: 400 } }}
      autoHideDuration={16000}
      {...other}
    >
      <SnackbarContent
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          position: "relative",
          overflow: "hidden",
          padding: 0,
          width: "100%",
          "& .MuiSnackbarContent-message": { padding: 0, width: "100%" },
        }}
        message={
          <Card sx={{ padding: 0 }}>
            <audio
              ref={audioRef}
              src={`https://cdn.quavergame.com/audio-previews/${mapset.id}.mp3`}
              autoPlay
            />
            <CardMedia>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100px",
                  filter: "brightness(70%)",
                }}
              >
                <Image
                  src={`https://cdn.quavergame.com/mapsets/${mapset.id}.jpg`}
                  alt="artwork"
                  fill={true}
                  style={{ objectFit: "cover", userSelect: "none" }}
                  draggable={false}
                  // copied from nextjs. idk how to properly do this rn
                  sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                />
              </div>
            </CardMedia>
            <CardContent sx={{ padding: 0 }}>
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  color="secondary"
                  value={progress}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" padding={1}>
                <Typography variant="overline" lineHeight={1}>
                  {formatDuration((audioRef.current?.currentTime || 0) * 1000)}
                </Typography>
                <Typography variant="overline" lineHeight={1}>
                  {" "}
                  {formatDuration((audioRef.current?.duration || 10) * 1000)}
                </Typography>
              </Box>
            </CardContent>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Fab
                size="small"
                color="primary"
                onClick={() => {
                  setPlaying(!playing);

                  if (audioRef.current?.paused || false) playAudio();
                  else pauseAudio();
                }}
              >
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
              </Fab>
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="h6"
                  component="div"
                  lineHeight={1}
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {mapset.title}
                </Typography>
                <Typography variant="body1" component="div">
                  {mapset.artist}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        }
      />
    </Snackbar>
  );
};

export default AudioPlayer;
