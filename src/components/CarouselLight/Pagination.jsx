import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Pages = styled.div`
  position: absolute;
  display: flex;
  top: 90%;
  justify-content: center;
  flex-wrap: wrap;
  left: 0;
  right: 0;
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

const Pagination = ({ data, activeIndex, callback }) => {
  return (
    <Pages>
      {data.map((item, index) => (
        <Page key={item} active={index === activeIndex} onClick={() => callback(index)} />
      ))}
    </Pages>
  );
};

Pagination.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeIndex: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
};

export default Pagination;
