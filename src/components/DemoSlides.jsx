import React from 'react';
import styled from 'styled-components';

import { images, colors } from '../demo-data';

const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('${(props) => props.url}');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Block = styled.div`
  height: 100%;
  border: 2px solid #000000;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #${(props) => props.color};
`;

const ImageSlides = images.map((item) => {
  return <Image url={item} key={item} />;
});

const blockSlides = [];

for (let i = 0; i < 10; i += 1) {
  blockSlides.push(
    <Block color={colors[i % colors.length]} key={i}>
      <h3 style={{ textAlign: 'center' }}>{`Slide ${i}`}</h3>
    </Block>,
  );
}

export { ImageSlides, blockSlides };
