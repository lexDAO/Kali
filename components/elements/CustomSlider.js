import React, { useState } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from "@chakra-ui/react";

function CustomSlider(props) {
  const [sliderValue, setSliderValue] = useState(props.defaultValue);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Slider
      aria-label={props.label}
      defaultValue={props.defaultValue}
      colorScheme="red"
      min={props.min}
      max={props.max}
      onChange={(v) => setSliderValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onChangeEnd={props.onChangeEnd}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        placement="top"
        isOpen={showTooltip}
        label={`${sliderValue}`}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}

export default CustomSlider;
