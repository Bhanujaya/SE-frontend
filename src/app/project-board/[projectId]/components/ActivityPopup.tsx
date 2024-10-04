import { useRef, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";

interface ActivityPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ActivityPopup({
  isVisible,
  onClose,
}: ActivityPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="absolute bg-white border rounded shadow-lg p-4 z-50 w-[400px] h-[400px]"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div className="flex items-center justify-between">
          <p className="mb-2">Activity</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded p-1 ml-2"
          >
            <TfiClose className="w-4 h-4 text-gray-800" />
          </button>
        </div>
      </div>
    </>
  );
}
