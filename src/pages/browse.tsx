import useSWRInfinite from "swr/infinite";
import Image from "next/image";
import Link from "@/components/Link";
import theme from "@/theme";
import { lighten, alpha, styled, FormLabel } from "@mui/material";
import { MapsetWithMaps } from "@/types";
import ratingColor from "@/helpers/ratingColor";
import useIntersection from "@/hooks/useIntersection";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Fab from "@mui/material/Fab";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { Map } from "@prisma/client";
import { useEffect, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
  width: "100%",
}));

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

function getModeString(maps: Map[]) {
  if (maps.every((map: Map) => map.game_mode == 1)) {
    return "4K";
  } else if (maps.every((map: Map) => map.game_mode == 2)) {
    return "7K";
  }
  return "4K / 7K";
}

function getModeColor(modeString: string) {
  if (modeString == "7K") {
    return theme.palette.secondary.main;
  } else if (modeString == "4K / 7K") {
    return `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  }
  return theme.palette.primary.main;
}

const getKey = (
  pageIndex: number,
  previousPageData: MapsetWithMaps[],
  query: string
) => {
  if (previousPageData && !previousPageData.length) return null;

  return `/api/search?amount=20&offset=${pageIndex * 20}&query=${query}`;
};

export default function Browse() {
  const [query, setQuery] = useState("");
  const [actualQuery, setActualQuery] = useState("");

  const [intersecting, ref] = useIntersection<HTMLDivElement>();
  const { data, error, size, setSize, isValidating } = useSWRInfinite<
    MapsetWithMaps[]
  >((...args) => getKey(...args, actualQuery), fetcher);

  const mapsets = data ? data.flat() : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = (data?.[0]?.length ?? 0) === 0;
  const isReachingEnd = isEmpty || (data?.[0]?.length ?? 0) < 20;
  const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    if (intersecting && !isRefreshing && !isReachingEnd) {
      setSize((size) => size + 1);
    }
  }, [intersecting, isReachingEnd, isRefreshing, setSize]);

  return (
    <Box sx={{ padding: theme.spacing(4) }}>
      <Paper
        sx={{
          marginBottom: theme.spacing(2),
          padding: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Search>
          {/* <Box display="flex" flexDirection="row">
            <FormGroup row>
              <FormLabel sx={{ alignSelf: "center", marginRight: 2 }}>
                Mode:{" "}
              </FormLabel>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="4K"
              />
              <FormControlLabel control={<Checkbox />} label="7K" />
            </FormGroup>
          </Box> */}
        </Box>
        <Button variant="contained" onClick={() => setActualQuery(query)}>
          Search
        </Button>
      </Paper>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {mapsets.map((mapset: MapsetWithMaps) => {
          if (isEmpty) return "";
          const modeString = getModeString(mapset.Map);
          const modeColor = getModeColor(modeString);

          return (
            <Grid item xs={4} sm={4} md={4} key={mapset.id}>
              <Card sx={{ position: "relative" }}>
                <Chip
                  label={modeString}
                  color="primary"
                  style={{ background: modeColor, fontWeight: "bold" }}
                  sx={{
                    position: "absolute",
                    zIndex: 1,
                    top: 10,
                    left: 10,
                    userSelect: "none",
                  }}
                />
                <CardActionArea>
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
                      />
                    </div>
                  </CardMedia>
                </CardActionArea>
                <CardContent
                  sx={{
                    backgroundColor: lighten(
                      theme.palette.background.paper,
                      0.025
                    ),
                    padding: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {mapset.Map.sort((a, b) =>
                    (a.difficulty_rating || 1) > (b.difficulty_rating || 1)
                      ? 1
                      : -1
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
                          backgroundColor: ratingColor(
                            map.difficulty_rating || 1
                          ),
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
                    <Link
                      href={`https://quavergame.com/user/${mapset.creator_id}`}
                    >
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Box
        ref={ref}
        display="flex"
        flexDirection="column"
        width="100%"
        alignItems="center"
        justifyContent="center"
        padding={10}
        gap={2}
      >
        {isLoadingMore || isLoadingInitialData ? (
          <>
            <CircularProgress />
            <Typography variant="h5">Loading mapsets...</Typography>
          </>
        ) : isEmpty ? (
          <Typography variant="h5">No mapsets found.</Typography>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
}
