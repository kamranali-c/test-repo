// src/components/molecules/Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography, IconButton } from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";

// Keep your arrow styling via existing classes
function SamplePrevArrow(props) {
  const { onClick } = props;
  return <div className="left-btn-carousel" onClick={onClick} />;
}
function SampleNextArrow(props) {
  const { onClick } = props;
  return <div className="right-btn-carousel" onClick={onClick} />;
}

export default function Carousel({ list = [], onRetry }) {
  const isSingle = list.length <= 1;
  const ARROW_GUTTER = 36; // reserve space inside the track so arrows don't overlap text

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: isSingle ? 1 : 2,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    nextArrow: <SampleNextArrow />,   // <- correct casing
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: isSingle ? 1 : 2, slidesToScroll: 1 } },
      { breakpoint: 600,  settings: { slidesToShow: 1, slidesToScroll: 1, initialSlide: 0 } },
      { breakpoint: 480,  settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box className="loop-icon-btn">
        <IconButton aria-label="retry" onClick={onRetry} sx={{ color: "black", p: 0 }}>
          <LoopIcon />
        </IconButton>
      </Box>

      {/* Make slider fill container and add inner gutters so arrows never cover text */}
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          "& .slick-slider": { width: "100%" },
          "& .slick-list": {
            width: "100%",
            padding: `0 ${ARROW_GUTTER}px !important`, // <-- key: keep text clear of arrows
          },
          "& .slick-slide > div": { padding: "0 4px" }, // small spacing between slides
        }}
      >
        <Slider {...settings}>
          {list.map((item, idx) => (
            <Box key={`sug_${idx}`} sx={{ width: "100%" }}>
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
