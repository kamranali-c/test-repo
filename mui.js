// src/components/molecules/Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const ARROW_COL = 40; // arrow column width (px)

export default function Carousel({ list = [] }) {
  const sliderRef = React.useRef(null);
  const [current, setCurrent] = React.useState(0);

  // Show 2 entries whenever possible (1 if only one item exists)
  const slidesToShow = Math.min(2, Math.max(1, list.length));

  const prevDisabled = current === 0;
  const nextDisabled = current >= Math.max(0, list.length - slidesToShow);

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false, // we render our own arrows (docked, not overlaying)
    initialSlide: 0,
    afterChange: (idx) => setCurrent(idx),
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `${ARROW_COL}px 1fr ${ARROW_COL}px`,
          alignItems: "center",
          width: "100%",
          columnGap: 8,
        }}
      >
        {/* Left docked arrow */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            aria-label="previous suggestion"
            onClick={() => sliderRef.current?.slickPrev()}
            disabled={prevDisabled}
            size="small"
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
        </Box>

        {/* Slider (center) */}
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            // Ensure slick fills and wraps properly
            "& .slick-slider, & .slick-list, & .slick-track": { width: "100%" },
            "& .slick-track": { display: "flex" },
            "& .slick-slide": { height: "auto" },
            "& .slick-slide > div": {
              width: "100%",
              minWidth: 0,            // allow shrinking inside container
              boxSizing: "border-box",
              padding: "0 6px",       // small gap between slides
            },
          }}
        >
          <Slider ref={sliderRef} {...settings}>
            {list.map((item, idx) => (
              <Box key={`sug_${idx}`} sx={{ width: "100%", minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.75,
                    color: "text.secondary",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    maxWidth: "100%",
                  }}
                >
                  <strong>GenAI Output:</strong> {item}
                </Typography>
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Right docked arrow */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            aria-label="next suggestion"
            onClick={() => sliderRef.current?.slickNext()}
            disabled={nextDisabled}
            size="small"
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
