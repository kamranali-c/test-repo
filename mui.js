// src/components/molecules/Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Loop as LoopIcon } from "@mui/icons-material";

const PrevArrow = ({ onClick, currentSlide }) => (
  <IconButton
    aria-label="previous"
    onClick={onClick}
    disabled={currentSlide === 0}
    size="small"
    sx={{
      position: "absolute",
      top: "50%",
      left: 8,
      transform: "translateY(-50%)",
      zIndex: 2,
      bgcolor: "background.paper",
      boxShadow: 1,
      "&:disabled": { opacity: 0.4 },
    }}
  >
    <ChevronLeft fontSize="small" />
  </IconButton>
);

const NextArrow = ({ onClick, currentSlide, slideCount }) => (
  <IconButton
    aria-label="next"
    onClick={onClick}
    disabled={currentSlide >= (slideCount ?? 0) - 1}
    size="small"
    sx={{
      position: "absolute",
      top: "50%",
      right: 8,
      transform: "translateY(-50%)",
      zIndex: 2,
      bgcolor: "background.paper",
      boxShadow: 1,
      "&:disabled": { opacity: 0.4 },
    }}
  >
    <ChevronRight fontSize="small" />
  </IconButton>
);

export default function Carousel({ list = [], onRetry }) {
  const isSingle = list.length <= 1;

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: isSingle ? 1 : 2,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: isSingle ? 1 : 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
    ],
  };

  return (
    <Box
      className="slider-container"
      sx={{
        position: "relative",
        overflow: "hidden",   // keep arrows/content inside
        px: 5,                // space so arrows don’t overlap text
      }}
    >
      <Box className="loop-icon-btn" sx={{ mb: 0.5 }}>
        <IconButton
          aria-label="retry"
          onClick={onRetry}
          sx={{ color: "black", p: 0 }}
          disabled={list.length === 0}
        >
          <LoopIcon />
        </IconButton>
      </Box>

      <Slider {...settings}>
        {list.map((item, idx) => (
          <Box key={`sug_${idx}`} sx={{ px: 1 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.75, color: "text.secondary" }}
            >
              <strong>GenAI Output:</strong> {item}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
