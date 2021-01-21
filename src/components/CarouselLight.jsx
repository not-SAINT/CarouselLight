import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowButton from './ArrowButton';
import Pagination from './Pagination';

const TOUCH_LIMIT = 75;
const TRANSITION_TIME_MS = 1000;
const MOUSE_SPEED = 3;

const CarouselLight = ({ data, pagination, arrows, slidesPerView }) => {
  const [carouselState, setCarouselState] = useState({
    activeIndex: 0,
    offset: 0,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchMove, setTouchMove] = useState(false);
  const [isGrabbing, setGrabbing] = useState(false);
  const [mouseOffset, setMouseOffset] = useState(0);
  const [mouseStart, setMouseStart] = useState(0);
  const [isTransition, setTransition] = useState(false);

  const carouselRef = useRef(null);

  const lastSlideIndex = data.length - slidesPerView;
  const contentWidth = containerWidth * data.length;

  const getOffset = (activeIndex) => activeIndex * containerWidth;

  useEffect(() => {
    setContainerWidth(Math.round(carouselRef.current.offsetWidth / slidesPerView));
    setCarouselState({
      activeIndex: 0,
      offset: 0,
    });
  }, [slidesPerView]);

  useEffect(() => {
    setTimeout(() => setTransition(false), TRANSITION_TIME_MS);
  }, [isTransition]);

  const nextSlide = () => {
    if (isTransition) {
      return null;
    }

    if (carouselState.activeIndex === lastSlideIndex) {
      return setCarouselState({
        ...carouselState,
        offset: getOffset(carouselState.activeIndex),
      });
    }

    if (carouselState.activeIndex === lastSlideIndex) {
      return setCarouselState({
        activeIndex: 0,
        offset: 0,
      });
    }

    setTransition(true);

    return setCarouselState({
      activeIndex: carouselState.activeIndex + 1,
      offset: getOffset(carouselState.activeIndex + 1),
    });
  };

  const prevSlide = () => {
    if (isTransition) {
      return null;
    }

    if (carouselState.activeIndex === 0) {
      return setCarouselState({
        ...carouselState,
        offset: getOffset(carouselState.activeIndex),
      });
    }

    if (carouselState.activeIndex === 0) {
      return setCarouselState({
        activeIndex: lastSlideIndex,
        offset: getOffset(lastSlideIndex),
      });
    }

    setTransition(true);

    return setCarouselState({
      activeIndex: carouselState.activeIndex - 1,
      offset: getOffset(carouselState.activeIndex - 1),
    });
  };

  const ScrollToSlide = (index) => {
    if (index > lastSlideIndex) {
      return setCarouselState({
        activeIndex: lastSlideIndex,
        offset: getOffset(lastSlideIndex),
      });
    }

    return setCarouselState({
      activeIndex: index,
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
      offset: getOffset(carouselState.activeIndex),
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
      offset: getOffset(carouselState.activeIndex) + (mouseStart - pageX) * MOUSE_SPEED,
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
        {data.map((image) => (
          <Slide key={image} url={image} slidesPerView={slidesPerView} draggable />
        ))}
      </CarouselContent>
      {arrows && (
        <>
          {carouselState.activeIndex !== 0 && <ArrowButton direction="left" callback={prevSlide} />}
          {carouselState.activeIndex !== lastSlideIndex && <ArrowButton direction="right" callback={nextSlide} />}
        </>
      )}
      {pagination && (
        <Pagination
          data={data.slice(0, lastSlideIndex + 1)}
          activeIndex={carouselState.activeIndex}
          callback={ScrollToSlide}
          slidesPerView={slidesPerView}
        />
      )}
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
  width: calc(${(props) => 100 / props.slidesPerView}%);
  margin-right: 5px;
  height: 100%;
  background-image: url('${(props) => props.url}');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

CarouselLight.defaultProps = {
  arrows: true,
  pagination: true,
  slidesPerView: 1,
};

CarouselLight.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  slidesPerView: PropTypes.number,
  arrows: PropTypes.bool,
  pagination: PropTypes.bool,
};

export default CarouselLight;
