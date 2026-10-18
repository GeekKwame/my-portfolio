import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div
      className="fixed top-20 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

