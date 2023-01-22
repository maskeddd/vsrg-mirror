import theme from "@/theme";
import type { Map } from "@prisma/client";
import Chip from "@mui/material/Chip";

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

export default function ModePill({ maps }: { maps: Map[] }) {
  const modeString = getModeString(maps);
  const modeColor = getModeColor(modeString);

  return (
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
  );
}
