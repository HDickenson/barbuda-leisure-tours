import { FC } from 'react';

interface CarouselProps {
  id?: string;
  className?: string;
  /** Array of items to display */
  items: any[];
  autoplay?: boolean;
  interval?: number;
}

const Carousel: FC<CarouselProps> = (props) => {
  const { id, className, items, autoplay, interval } = props;

  return (
    <div className="swiper carousel">
      {items?.map((item, index) => (
        <div key={index} className="carousel-item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
