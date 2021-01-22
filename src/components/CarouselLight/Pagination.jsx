import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Pages = styled.div`
  position: absolute;
  display: flex;
  top: calc(95% - 20px);
  justify-content: center;
  flex-wrap: wrap;
  left: 0;
  right: 0;
  z-index: 5;
`;

const Page = styled.span`
  width: 15px;
  height: 15px;
  margin: 5px;
  background-color: ${(props) => (props.active ? '#ffffff' : '#a4a4a4')};
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 15px 3px #000000;
  }
`;

const Pagination = ({ slides, activeIndex, callback }) => {
  return (
    <Pages>
      {slides.map((item, index) => {
        const key = `${item}_${index}`;

        return <Page key={key} active={index === activeIndex} onClick={() => callback(index)} />;
      })}
    </Pages>
  );
};

Pagination.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeIndex: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
};

export default Pagination;
