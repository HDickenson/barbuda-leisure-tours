import { FC } from 'react';

interface MenuProps {
  id?: string;
  className?: string;
}

const Menu: FC<MenuProps> = (props) => {
  const { id, className } = props;

  return (
    <div className="component">
      {/* menu widget */}
    </div>
  );
};

export default Menu;
