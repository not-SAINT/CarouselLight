/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowButton from './ArrowButton';
import Pagination from './Pagination';

const PSEUDO_SLIDES = 2;
const TOUCH_LIMIT = 75;

const CarouselLight = ({ data, infinite, pagination, arrows, size }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [shift, setShift] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const carouselRef = useRef(null);

  const lastSlideIndex = useMemo(() => data.length - 1, [data.length]);
  const contentWidth = useMemo(() => {
    return containerWidth * (data.length + PSEUDO_SLIDES);
  }, [data.length, containerWidth]);

  const getShift = useCallback((activeIndex) => activeIndex * containerWidth, [activeSlide, containerWidth]);

  useEffect(() => {
    setContainerWidth(carouselRef.current.offsetWidth);
  }, []);

  const nextSlide = () => {
    if (activeSlide === lastSlideIndex) {
      setActiveSlide(0);
      setShift(0);

      return;
    }

    const nextSlideIndex = activeSlide + 1;

    setActiveSlide(nextSlideIndex);
    setShift(getShift(nextSlideIndex));
  };

  const prevSlide = () => {
    if (activeSlide === 0) {
      setActiveSlide(lastSlideIndex);
      setShift(getShift(lastSlideIndex));

      return;
    }

    const nextSlideIndex = activeSlide - 1;

    setActiveSlide(nextSlideIndex);
    setShift(getShift(nextSlideIndex));
  };

  const ScrollToSlide = (index) => {
    setActiveSlide(index);
    setShift(getShift(index));
  };

  const handleTouchStart = ({ targetTouches }) => {
    setTouchStart(targetTouches[0].clientX);
  };

  const handleTouchMove = ({ targetTouches }) => {
    setTouchEnd(targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > TOUCH_LIMIT) {
      nextSlide();
    }

    if (touchStart - touchEnd < -TOUCH_LIMIT) {
      prevSlide();
    }
  };

  return (
    <Carousel
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <CarouselContent shift={shift} width={contentWidth}>
        <Slide key={`${data[lastSlideIndex]}pseudo`} url={data[lastSlideIndex]} draggable />
        {data.map((image) => (
          <Slide key={image} url={image} draggable />
        ))}
        <Slide key={`${data[0]}pseudo`} url={data[0]} draggable />
      </CarouselContent>
      {arrows && (
        <>
          {(infinite || (!infinite && activeSlide !== 0)) && <ArrowButton direction="left" callback={prevSlide} />}
          {(infinite || (!infinite && activeSlide !== lastSlideIndex)) && (
            <ArrowButton direction="right" callback={nextSlide} />
          )}
        </>
      )}
      {pagination && <Pagination data={data} activeIndex={activeSlide} callback={ScrollToSlide} />}
    </Carousel>
  );
};

const Carousel = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: grab;
`;

const CarouselContent = styled.div`
  display: flex;
  width: ${(props) => props.width}px;
  height: 100%;
  transform: translateX(-${(props) => props.shift}px);
  transition: transform 1s cubic-bezier(0.66, -0.32, 0.38, 1.4);
`;

const Slide = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('${(props) => props.url}');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

CarouselLight.defaultProps = {
  infinite: true,
  arrows: true,
  pagination: true,
  size: 1,
};

CarouselLight.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  size: PropTypes.number,
  infinite: PropTypes.bool,
  arrows: PropTypes.bool,
  pagination: PropTypes.bool,
};

export default CarouselLight;
