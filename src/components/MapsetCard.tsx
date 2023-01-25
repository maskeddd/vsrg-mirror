import Image from "next/image";
import Link from "@/components/Link";
import ModePill from "@/components/ModePill";
import theme from "@/theme";
import { lighten } from "@mui/material";
import { MapsetWithMaps } from "@/types";
import ratingColor from "@/helpers/ratingColor";
import { Map } from "@prisma/client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import Chip from "@mui/material/Chip";

import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import React from "react";

const MapsetCard = ({
  mapset,
  previewHandler,
}: {
  mapset: MapsetWithMaps;
  previewHandler: (mapset: MapsetWithMaps) => void;
}) => {
  return (
    <Grid item xs={4} sm={4} md={4} key={mapset.id}>
      <Card sx={{ position: "relative" }}>
        <ModePill maps={mapset.Map} />
        <CardActionArea onClick={() => previewHandler(mapset)}>
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
        </CardActionArea>
        <CardContent
          sx={{
            backgroundColor: lighten(theme.palette.background.paper, 0.025),
            padding: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {mapset.Map.sort((a, b) =>
            (a.difficulty_rating || 1) > (b.difficulty_rating || 1) ? 1 : -1
          ).map((map: Map) => (
            <Tooltip
              title={`${Number(map.difficulty_rating?.toFixed(2))} - ${
                map.difficulty_name
              }`}
              placement="top"
              key={map.id}
              disableInteractive
            >
              <Box
                component="a"
                href={`https://quavergame.com/mapset/map/${map.id}`}
                target="_blank"
                borderRadius={100}
                minWidth={14}
                minHeight={14}
                sx={{
                  backgroundColor: ratingColor(map.difficulty_rating || 1),
                }}
              />
            </Tooltip>
          ))}
        </CardContent>
        <CardContent sx={{ position: "relative" }}>
          <Typography
            variant="h6"
            component="div"
            lineHeight={1}
            textOverflow="ellipsis"
            overflow="hidden"
            display="-webkit-box"
            sx={{ WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
          >
            {mapset.title}
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {mapset.artist}
          </Typography>
          <Typography>
            <span>Mapped by: </span>
            <Link href={`https://quavergame.com/user/${mapset.creator_id}`}>
              {mapset.creator_username}
            </Link>
          </Typography>
          <Box
            gap={1}
            display="flex"
            position="absolute"
            bottom={10}
            right={10}
          >
            <Tooltip title="View on Quaver" placement="top">
              <Fab
                color="secondary"
                LinkComponent="a"
                href={`https://quavergame.com/mapset/${mapset.id}`}
                target="_blank"
                aria-label="open"
                size="small"
                sx={{ boxShadow: 2 }}
              >
                <OpenInNewIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Download" placement="top">
              <Fab
                color="primary"
                LinkComponent="a"
                href={`api/d/${mapset.id}`}
                aria-label="download"
                size="small"
                sx={{ boxShadow: 2 }}
              >
                <DownloadIcon />
              </Fab>
            </Tooltip>
          </Box>
        </CardContent>
        <CardActions>
          <Box
            display="flex"
            gap={0.5}
            sx={{
              overflowX: "scroll",
              "::-webkit-scrollbar": {
                width: 0,
                height: 0,
                backgroundColor: "transparent",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "transparent",
              },
            }}
          >
            {mapset.tags
              ?.split(/[, ]+/)
              // .slice(0, 3)
              .map((tag, index) => (
                <Chip key={index} label={tag} size="small" />
              ))}
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default MapsetCard;
