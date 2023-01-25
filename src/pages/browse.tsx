import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import useIntersection from "@/hooks/useIntersection";
import fetcher from "@/helpers/fetcher";
import { useMediaQuery } from "@mui/material";

import theme from "@/theme";
import { MapsetWithMaps } from "@/types";

import MapsetCard from "@/components/MapsetCard";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "@/components/SearchBar";
import AudioPlayer from "@/components/AudioPlayer";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
// import Checkbox from "@mui/material/Checkbox";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";

import SearchIcon from "@mui/icons-material/Search";

const PAGE_SIZE = 18;

const getKey = (
  pageIndex: number,
  previousPageData: MapsetWithMaps[],
  query: string
) => {
  if (previousPageData && !previousPageData.length) return null;

  return `/api/search?amount=${PAGE_SIZE}&offset=${
    pageIndex * PAGE_SIZE
  }&query=${query}`;
};

export default function Browse() {
  const [query, setQuery] = useState("");
  const [actualQuery, setActualQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [previewMapset, setPreviewMapset] = useState<MapsetWithMaps>(
    {} as MapsetWithMaps
  );

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
  const isReachingEnd = isEmpty || (data?.[0]?.length ?? 0) < PAGE_SIZE;
  const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    if (intersecting && !isRefreshing && !isReachingEnd) {
      setSize((size) => size + 1);
    }
  }, [intersecting, isReachingEnd, isRefreshing, setSize]);

  function previewHandler(mapset: MapsetWithMaps) {
    setOpen(true);
    setPreviewMapset(mapset);
  }

  return (
    <Box sx={{ padding: theme.spacing(4) }}>
      <AudioPlayer
        open={open}
        setOpen={setOpen}
        mapset={previewMapset}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: useMediaQuery(theme.breakpoints.up("xs"))
            ? "right"
            : "center",
        }}
      />
      <Paper
        sx={{
          marginBottom: theme.spacing(2),
          padding: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setActualQuery(e.currentTarget.value);
              }
            }}
          />
        </Search>
        <Box display="flex" flexDirection="column" gap={2}>
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
        {!isEmpty
          ? mapsets.map((mapset: MapsetWithMaps) => (
              <MapsetCard
                key={mapset.id}
                previewHandler={previewHandler}
                mapset={mapset}
              />
            ))
          : ""}
      </Grid>
      <Box
        ref={ref}
        display="flex"
        flexDirection="column"
        width="100%"
        alignItems="center"
        textAlign="center"
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
