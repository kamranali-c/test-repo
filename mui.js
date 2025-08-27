// add to imports
import { ChevronLeft, ChevronRight, Loop as LoopIcon } from "@mui/icons-material";

// inside Carousel's return, ABOVE the grid wrapper:
<Box sx={{ width: "100%" }}>
  {/* Loop / Regenerate button */}
  <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 0.5 }}>
    <IconButton
      aria-label="regenerate suggestions"
      onClick={onRetry}
      disabled={!onRetry}
      size="small"
    >
      <LoopIcon fontSize="small" />
    </IconButton>
  </Box>

  {/* existing grid with docked arrows + slider goes here */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "40px 1fr 40px",
      alignItems: "center",
      width: "100%",
      columnGap: 8,
    }}
  >
    {/* ...left IconButton, center <Slider/>, right IconButton... */}
  </Box>
</Box>
