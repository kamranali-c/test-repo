// src/components/molecules/Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Loop as LoopIcon } from "@mui/icons-material";

const ARROW_SIZE = 36; // also used as left/right gutter so content never sits under arrows

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
  const isSingle = list.length <= 1;

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: isSingle ? 1 : 2,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: isSingle ? 1 : 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, initialSlide: 0 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
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
          // gutters so arrows never overlap content
          "& .slick-list": { padding: `0 ${ARROW_SIZE + 8}px !important` },
          "& .slick-slider, & .slick-list, & .slick-track": { width: "100%" },
          "& .slick-slide > div": { padding: "0 6px" }, // small spacing between slides
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
