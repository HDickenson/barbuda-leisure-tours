import { FC } from 'react';

interface ModalProps {
  id?: string;
  className?: string;
  isOpen: boolean;
  /** Function to close modal */
  onClose: any;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = (props) => {
  const { id, className, isOpen, onClose, children } = props;

  return (
    <>
      {isOpen && (
        <div className="component modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
