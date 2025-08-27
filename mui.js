// ...imports & arrow components remain exactly as you have them

export default function Carousel({ list = [], onRetry }) {
  const isSingleItem = list.length <= 1;
  const styleRetryButton = list.length === 10 ? { opacity: 0.5, cursor: "not-allowed" } : null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: isSingleItem ? 1 : 2,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    // keep your custom arrows as-is
    nextArrow: <SampleNextArrow disabled={isSingleItem} />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: isSingleItem ? 1 : 2,
          slidesToScroll: 1,
          dots: false,
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
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // width reserved on each side so text doesn't sit under arrows
  const ARROW_GUTTER = 36; // match approx arrow button width

  return (
    <Box className="slider-container" sx={{ position: "relative" }}>
      <Box className="loop-icon-btn">
        <IconButton
          aria-label="retry"
          onClick={onRetry}
          sx={{ color: "black", padding: "0px", ...styleRetryButton }}
          disabled={list.length === 10}
        >
          <LoopIcon />
        </IconButton>
      </Box>

      {/* Create internal gutters so slide content never goes under arrows */}
      <Box
        className="slider-rail"
        sx={{
          overflow: "hidden",
          // add padding **inside** the slick viewport
          "& .slick-list": {
            padding: `0 ${ARROW_GUTTER}px !important`,
          },
          // tiny spacing between slides so text doesn't touch gutters
          "& .slick-slide > div": { padding: "0 4px" },
        }}
      >
        <Slider {...settings}>
          {list?.map((item, idx) => (
            <Box key={`s_${idx}`}>
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
    </Box>
  );
}
