/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowButton from './ArrowButton';
import Pagination from './Pagination';

const PSEUDO_SLIDES = 2;
const TOUCH_LIMIT = 75;

const CarouselLight = ({ data, infinite, pagination, arrows, size }) => {
  const [carouselState, setCarouselState] = useState({
    activeSlide: 0,
    offset: 0,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchMove, setTouchMove] = useState(false);
  const [isGrabbing, setGrabbing] = useState(false);
  const [mouseOffset, setMouseOffset] = useState(0);
  const [mouseStart, setMouseStart] = useState(0);

  const carouselRef = useRef(null);

  const lastSlideIndex = data.length - 1;
  const contentWidth = containerWidth * (data.length + PSEUDO_SLIDES);

  const getOffset = (activeIndex) => activeIndex * containerWidth;

  useEffect(() => {
    setContainerWidth(carouselRef.current.offsetWidth);
  }, []);

  const nextSlide = () => {
    if (!infinite && carouselState.activeSlide === lastSlideIndex) {
      return setCarouselState({
        ...carouselState,
        offset: getOffset(carouselState.activeSlide),
      });
    }

    if (carouselState.activeSlide === lastSlideIndex) {
      return setCarouselState({
        activeSlide: 0,
        offset: 0,
      });
    }

    return setCarouselState({
      activeSlide: carouselState.activeSlide + 1,
      offset: getOffset(carouselState.activeSlide + 1),
    });
  };

  const prevSlide = () => {
    if (!infinite && carouselState.activeSlide === 0) {
      return setCarouselState({
        ...carouselState,
        offset: getOffset(carouselState.activeSlide),
      });
    }

    if (carouselState.activeSlide === 0) {
      return setCarouselState({
        activeSlide: lastSlideIndex,
        offset: getOffset(lastSlideIndex),
      });
    }

    return setCarouselState({
      activeSlide: carouselState.activeSlide - 1,
      offset: getOffset(carouselState.activeSlide - 1),
    });
  };

  const ScrollToSlide = (index) => {
    setCarouselState({
      activeSlide: index,
      offset: getOffset(index),
    });
  };

  const handleTouchStart = ({ targetTouches }) => {
    setTouchStart(targetTouches[0].clientX);
  };

  const handleTouchMove = ({ targetTouches }) => {
    setTouchEnd(targetTouches[0].clientX);
    setTouchMove(true);
  };

  const handleTouchEnd = () => {
    if (touchMove && touchStart - touchEnd > TOUCH_LIMIT) {
      nextSlide();
    }

    if (touchMove && touchStart - touchEnd < -TOUCH_LIMIT) {
      prevSlide();
    }

    setTouchMove(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setGrabbing(true);
    setMouseStart(e.pageX);
  };

  const handleMouseUp = () => {
    setGrabbing(false);

    if (mouseOffset > TOUCH_LIMIT) {
      return nextSlide();
    }

    if (Math.abs(mouseOffset) > TOUCH_LIMIT) {
      return prevSlide();
    }

    setCarouselState({
      ...carouselState,
      offset: getOffset(carouselState.activeSlide),
    });
    return setMouseOffset(0);
  };

  const handleMouseLeave = () => {
    setGrabbing(false);
  };

  const handleMouseMove = ({ pageX }) => {
    if (!isGrabbing) {
      return;
    }

    setCarouselState({
      ...carouselState,
      offset: getOffset(carouselState.activeSlide) + (mouseStart - pageX) * 3,
    });

    setMouseOffset(mouseStart - pageX);
  };

  return (
    <Carousel
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      grab={isGrabbing}
    >
      <CarouselContent offset={carouselState.offset} width={contentWidth}>
        <Slide key={`${data[lastSlideIndex]}pseudo`} url={data[lastSlideIndex]} draggable />
        {data.map((image) => (
          <Slide key={image} url={image} draggable />
        ))}
        <Slide key={`${data[0]}pseudo`} url={data[0]} draggable />
      </CarouselContent>
      {arrows && (
        <>
          {(infinite || (!infinite && carouselState.activeSlide !== 0)) && (
            <ArrowButton direction="left" callback={prevSlide} />
          )}
          {(infinite || (!infinite && carouselState.activeSlide !== lastSlideIndex)) && (
            <ArrowButton direction="right" callback={nextSlide} />
          )}
        </>
      )}
      {pagination && <Pagination data={data} activeIndex={carouselState.activeSlide} callback={ScrollToSlide} />}
    </Carousel>
  );
};

const Carousel = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: ${(props) => (props.grab ? 'grabbing' : 'grab')};
`;

const CarouselContent = styled.div.attrs((props) => ({
  style: {
    transform: `translateX(-${props.offset}px`,
  },
}))`
  display: flex;
  width: ${(props) => props.width}px;
  height: 100%;
  transition: transform 1s;
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
