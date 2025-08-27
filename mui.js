// src/components/molecules/Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Loop as LoopIcon } from "@mui/icons-material";

const ARROW_SIZE = 36; // also used as left/right gutter

function PrevArrow({ onClick, currentSlide }) {
  const disabled = currentSlide === 0;
  return (
    <IconButton
      aria-label="previous suggestion"
      onClick={onClick}
      disabled={disabled}
      size="small"
      sx={{
        position: "absolute",
        top: "50%",
        left: 8,
        transform: "translateY(-50%)",
        zIndex: 2,
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        bgcolor: "background.paper",
        boxShadow: 1,
        "&:disabled": { opacity: 0.4 },
      }}
    >
      <ChevronLeft fontSize="small" />
    </IconButton>
  );
}

function NextArrow({ onClick, currentSlide, slideCount }) {
  const disabled = currentSlide >= (slideCount ?? 0) - 1;
  return (
    <IconButton
      aria-label="next suggestion"
      onClick={onClick}
      disabled={disabled}
      size="small"
      sx={{
        position: "absolute",
        top: "50%",
        right: 8,
        transform: "translateY(-50%)",
        zIndex: 2,
        width: ARROW_SIZE,
        height: ARROW_SIZE,
        bgcolor: "background.paper",
        boxShadow: 1,
        "&:disabled": { opacity: 0.4 },
      }}
    >
      <ChevronRight fontSize="small" />
    </IconButton>
  );
}

export default function Carousel({ list = [], onRetry }) {
  const slidesToShow = Math.min(2, Math.max(1, list.length)); // 2 visible (or 1 if only one item)

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // always 2 across breakpoints (or 1 if list length < 2)
    responsive: [
      { breakpoint: 3000, settings: { slidesToShow } },
      { breakpoint: 1920, settings: { slidesToShow } },
      { breakpoint: 1280, settings: { slidesToShow } },
      { breakpoint: 960,  settings: { slidesToShow } },
      { breakpoint: 600,  settings: { slidesToShow } },
      { breakpoint: 0,    settings: { slidesToShow } },
    ],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 0.5 }}>
        <IconButton aria-label="retry generation" onClick={onRetry} sx={{ color: "text.primary", p: 0 }}>
          <LoopIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          "& .slick-slider, & .slick-list, & .slick-track": { width: "100%" },
          // gutters so arrows never overlap slide content
          "& .slick-list": { padding: `0 ${ARROW_SIZE + 8}px !important` },
          // small spacing between slides
          "& .slick-slide > div": { padding: "0 6px" },
        }}
      >
        <Slider {...settings}>
          {list.map((item, idx) => (
            <Box key={`sug_${idx}`}>
              <Typography variant="caption" sx={{ display: "block", mt: 0.75, color: "text.secondary" }}>
                <strong>GenAI Output:</strong> {item}
              </Typography>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
