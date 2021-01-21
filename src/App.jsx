import React, { useState } from 'react';

import CarouselLight from './components/CarouselLight';

import './App.css';

const data = [
  'https://images.unsplash.com/photo-1457269449834-928af64c684d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80',
  'https://images.unsplash.com/photo-1489674267075-cee793167910?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=967&q=80',
  'https://images.unsplash.com/photo-1484313544071-4d67c88b99be?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1352&q=80',
  'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1455156218388-5e61b526818b?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1483737946376-7c6c89443adb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
  'https://images.unsplash.com/photo-1483309830935-35efd1b07946?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1423145406370-2b342ae5b597?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80',
  'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80',
];

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
      <div className="carousel">
        <CarouselLight data={data} slidesPerView={slidesPerView} arrows={isArrows} pagination={isPagination} />
      </div>
    </div>
  );
};

export default App;
