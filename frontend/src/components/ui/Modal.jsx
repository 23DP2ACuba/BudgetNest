const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div>
            {children}
        </div>
    );
};

export default Modal;
