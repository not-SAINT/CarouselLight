import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled.button`
  position: absolute;
  display: flex;
  width: 20px;
  height: 20px;
  top: 50%;
  ${(props) => (props.direction === 'left' ? 'left: 25px' : 'right: 25px')};
  z-index: 5;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid #000000;
  border-radius: 50%;
  color: #ffffff;
  outline: 0;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 15px 3px #000000;
  }
`;

const ArrowButton = ({ direction, callback }) => {
  return <Button direction={direction} onClick={callback} />;
};

ArrowButton.propTypes = {
  direction: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
};

export default ArrowButton;
