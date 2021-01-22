import React, { useState } from 'react';

import CarouselLight from './components/CarouselLight';
import { ImageSlides, blockSlides } from './components/DemoSlides';

import './App.css';

const App = () => {
  const [isArrows, setArrows] = useState(true);
  const [isPagination, setPagination] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(1);

  const handleChangeSize = ({ target }) => {
    setSlidesPerView(+target.value);
  };

  const handleChangeArrows = ({ target }) => {
    setArrows(target.checked);
  };

  const handleChangePagination = ({ target }) => {
    setPagination(target.checked);
  };

  return (
    <div className="container">
      <h1 className="header">CarouselLight demo</h1>
      <div className="control-panel">
        <label className="label" htmlFor="arrows">
          <input id="arrows" type="checkbox" onChange={handleChangeArrows} checked={isArrows} />
          Arrows
        </label>
        <label className="label" htmlFor="pagination">
          <input id="pagination" type="checkbox" onChange={handleChangePagination} checked={isPagination} />
          Pagination
        </label>
        <label className="label" htmlFor="carouselSize">
          <select className="carousel-size" id="carouselSize" onChange={handleChangeSize}>
            <option value="1" defaultValue>
              1
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          Slides per view
        </label>
      </div>
      <h2 className="header">CarouselLight - images</h2>
      <div className="carousel">
        <CarouselLight slides={ImageSlides} slidesPerView={slidesPerView} arrows={isArrows} pagination={isPagination} />
      </div>
      <h2 className="header">CarouselLight - empty blocks</h2>
      <div className="carousel-small">
        <CarouselLight slides={blockSlides} slidesPerView={slidesPerView} arrows={isArrows} pagination={isPagination} />
      </div>
    </div>
  );
};

export default App;
