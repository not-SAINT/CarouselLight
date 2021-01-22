import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowButton from './ArrowButton';
import Pagination from './Pagination';

const TOUCH_OFFSET_LIMIT = 75;
const TRANSITION_TIME_MS = 1000;
const GRAB_SPEED = 3;
const SLIDES_PER_VIEW_MAX = 5;

const CarouselLight = ({ slides, pagination, arrows, slidesPerView: size }) => {
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

  const slidesPerView = size > SLIDES_PER_VIEW_MAX ? SLIDES_PER_VIEW_MAX : size;
  const lastSlideIndex = slides.length - slidesPerView < 0 ? 0 : slides.length - slidesPerView;
  const contentWidth = containerWidth * slides.length;

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

  const goToSlide = (index) => {
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

    setCarouselState({
      ...carouselState,
      offset: getOffset(carouselState.activeIndex) + (touchStart - targetTouches[0].clientX) * GRAB_SPEED,
    });
  };

  const handleTouchEnd = () => {
    setTouchMove(false);

    if (touchMove && touchStart - touchEnd > TOUCH_OFFSET_LIMIT) {
      return nextSlide();
    }

    if (touchMove && touchStart - touchEnd < -TOUCH_OFFSET_LIMIT) {
      return prevSlide();
    }

    return setCarouselState({
      ...carouselState,
      offset: getOffset(carouselState.activeIndex),
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setGrabbing(true);
    setMouseStart(e.pageX);
  };

  const handleMouseUp = () => {
    setGrabbing(false);

    if (mouseOffset > TOUCH_OFFSET_LIMIT) {
      return nextSlide();
    }

    if (Math.abs(mouseOffset) > TOUCH_OFFSET_LIMIT) {
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
      offset: getOffset(carouselState.activeIndex) + (mouseStart - pageX) * GRAB_SPEED,
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
        {slides.map((slide, index) => {
          const key = `$slide_${index}`;
          return (
            <Slide key={key} slidesPerView={slidesPerView} draggable>
              {slide}
            </Slide>
          );
        })}
      </CarouselContent>
      {arrows && (
        <>
          {carouselState.activeIndex !== 0 && <ArrowButton direction="left" callback={prevSlide} />}
          {carouselState.activeIndex !== lastSlideIndex && <ArrowButton direction="right" callback={nextSlide} />}
        </>
      )}
      {pagination && (
        <Pagination
          slides={slides.slice(0, lastSlideIndex + 1)}
          activeIndex={carouselState.activeIndex}
          callback={goToSlide}
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
`;

CarouselLight.defaultProps = {
  arrows: true,
  pagination: true,
  slidesPerView: 1,
};

CarouselLight.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.object).isRequired,
  slidesPerView: PropTypes.number,
  arrows: PropTypes.bool,
  pagination: PropTypes.bool,
};

export default CarouselLight;
