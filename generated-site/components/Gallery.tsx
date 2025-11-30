import { FC } from 'react';

interface GalleryProps {
  id?: string;
  className?: string;
}

const Gallery: FC<GalleryProps> = (props) => {
  const { id, className } = props;

  return (
    <div className="component">
      {/* gallery widget */}
    </div>
  );
};

export default Gallery;
