<Box
  sx={{
    position: "relative",
    width: "100%",
    overflow: "hidden",

    // keep arrows off the text
    "& .slick-list": { padding: `0 ${ARROW_SIZE + 8}px !important` },

    // make slides flex so height grows with content
    "& .slick-track": { display: "flex" },
    "& .slick-slide": { height: "auto" },

    // CRITICAL: let slide content shrink and stay inside the container
    "& .slick-slide > div": { width: "100%", minWidth: 0, boxSizing: "border-box" },
  }}
>
  <Slider {...settings}>
    {list.map((item, idx) => (
      <Box key={`sug_${idx}`} sx={{ p: 1, width: "100%", minWidth: 0, boxSizing: "border-box" }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.75,
            color: "text.secondary",
            // force wrapping so long strings/URLs never overflow
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
