# CarouselLight

CarouselLight is a simple slider for any html content for React. Works for mobile and desktop devices. Support swipes, mouse dragging.
Styled with styled-components.
No unnecessary dependencies

## [Demo](https://carousel-light.netlify.app/)

## Install demo

- Clone repository
- Install the dependencies and devDependencies and start the server

```sh
$ cd CarouselLight
$ npm install
$ npm start
```

## Usage

CarouselLight need a container with certain sizes.

```css
.carousel {
  max-width: 1000px;
  height: 500px;
  margin: 10px auto;
}
```

```javascript
const ImageSlides = images.map((item) => {
  return <Image url={item} key={item} />;
});

...

<div className="carousel">
  <CarouselLight slides={ImageSlides} slidesPerView={slidesPerView} arrows={isArrows} pagination={isPagination} />
</div>
```

## API

- **slides** - array. Slides with some html content. Slide is a react element with content. Required.
- **slidesPerView** - number. Count of slides on the screen. Max is 5. Default value 1.
- **arrows** - boolean. Display navigation buttons. Default value true.
- **pagination** - boolean. Display pagination buttons. Default value true.

## License

MIT
