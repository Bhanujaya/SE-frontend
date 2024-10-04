import { useState, useRef, useEffect } from "react";

interface Comment {
  name: string;
  text: string;
  time: string;
}

interface CommentModalProps {
  taskName: string;
  comments: Comment[];
  onClose: () => void;
  onSendComment: (newComment: Comment) => void;
  position: { top: number; left: number }; // Position to render the modal
}

export default function CommentModal({
  comments,
  onClose,
  onSendComment,
  position,
}: CommentModalProps) {
  const [newComment, setNewComment] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        name: "Current User", // Replace this to dynamic user
        text: newComment,
        time: new Date().toLocaleString(),
      };
      onSendComment(comment);
      setNewComment("");
    }
  };

  return (
    <div
      ref={modalRef}
      className="absolute bg-gray-100 ring-1 ring-gray-300 rounded-lg p-2 w-[400px] shadow-xl z-50"
      style={{ top: position.top, left: position.left }}
    >
      <div className="overflow-y-auto max-h-60 mb-4" style={{ maxHeight: '300px' }}>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="my-4 mx-2 bg-white p-2 rounded-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center gap-4 font-semibold">
                  <img src="/profile.svg" alt="profile" className="h-8 w-8" />
                  {comment.name}
                </div>
                
                <span className="text-xs font-light text-gray-400">
                  {comment.time}
                </span>
              </div>
              <p className="text-sm font-light">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="ml-2 mt-2 text-gray-400">No comments yet.</p>
        )}
      </div>

      <div className="flex justify-end m-2">
        <input
          type="text"
          className="w-full p-2 border rounded-md mr-4"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-customPurple text-white rounded-md hover:bg-[#9B9FFF]"
          onClick={handleSendComment}
        >
          Send
        </button>
      </div>
    </div>
  );
}
