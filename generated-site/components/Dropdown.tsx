import { FC } from 'react';

interface DropdownProps {
  id?: string;
  className?: string;
}

const Dropdown: FC<DropdownProps> = (props) => {
  const { id, className } = props;

  return (
    <div className="component dropdown">
      <button className="dropdown-toggle">Toggle</button>
      <div className="dropdown-menu">
        {/* Dropdown items */}
      </div>
    </div>
  );
};

export default Dropdown;
