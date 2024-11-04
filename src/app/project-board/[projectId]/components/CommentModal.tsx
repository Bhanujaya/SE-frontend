import { useState, useRef, useEffect } from "react";

interface Comment {
  commentId: string;
  name: string; // Member's name
  text: string;
  time: string;
}

interface CommentModalProps {
  taskId: string;
  onClose: () => void;
  position: { top: number; left: number };
}

export default function CommentModal({
  taskId,
  onClose,
  position,
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = getAuthToken();

        const response = await fetch(`http://localhost:9000/${taskId}/comment`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch comments");

        const data = await response.json();

        // Fetch member names for each comment
        const commentsWithNames = await Promise.all(
          data.map(async (comment: any) => {
            const memberName = await fetchMemberName(comment.commentMemberId, token);
            return {
              commentId: comment.commentId,
              name: memberName,
              text: comment.commentContent,
              time: formatCommentTime(comment.commentPostTime),
            };
          })
        );

        setComments(commentsWithNames);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [taskId, onClose]);

  // Helper function to get the auth token
  const getAuthToken = () => {
    const tokenData = localStorage.getItem("jwt");
    const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
    return parsedTokenData ? parsedTokenData.token : "";
  };

  // Cache to store member names to avoid redundant fetches
  const memberNameCache: { [key: string]: string } = {};

  const fetchMemberName = async (memberId: string, token: string) => {
    if (memberNameCache[memberId]) {
      return memberNameCache[memberId];
    }
    try {
      const response = await fetch(`http://localhost:9000/member?m=${memberId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error(`Failed to fetch member with ID ${memberId}`);
        return "Unknown User";
      }
      const memberData = await response.json();
      const memberName = memberData.detail.memberName || "Unknown User";
      memberNameCache[memberId] = memberName; // Cache the name
      return memberName;
    } catch (error) {
      console.error("Error fetching member name:", error);
      return "Unknown User";
    }
  };

  const formatCommentTime = (commentTime: string) => {
    // Parse the backend time and convert to local time string
    const utcDate = new Date(commentTime.endsWith("Z") ? commentTime : commentTime + "Z");
    return utcDate.toLocaleString();
  };

  const handleSendComment = async () => {
    if (newComment.trim()) {
      try {
        const token = getAuthToken();
        const tokenData = localStorage.getItem("jwt");
        const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
        const memberId = parsedTokenData ? parsedTokenData.memberId : "";
        const memberName = parsedTokenData.detail.memberName || "You";

        const requestBody = {
          commentContent: newComment,
          commentTaskId: taskId,
          commentMemberId: memberId,
        };

        const response = await fetch(`http://localhost:9000/comment/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error("Failed to send comment");

        const data = await response.json();

        const comment: Comment = {
          commentId: data.commentId,
          name: memberName,
          text: data.commentContent,
          // Use the current local time
          time: new Date().toLocaleString(),
        };

        setComments((prevComments) => [...prevComments, comment]);
        setNewComment("");
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  };

  return (
    <div
      ref={modalRef}
      className="absolute bg-gray-100 ring-1 ring-gray-300 rounded-lg p-2 w-[400px] shadow-xl z-50"
      style={{ top: position.top, left: position.left }}
    >
      <div className="overflow-y-auto max-h-60 mb-4" style={{ maxHeight: "300px" }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="my-4 mx-2 bg-white p-2 rounded-lg ring-1 ring-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center gap-4 font-semibold">
                  <img src="/profile.svg" alt="profile" className="h-8 w-8" />
                  {comment.name}
                </div>
                <span className="text-xs font-light text-gray-400">{comment.time}</span>
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
