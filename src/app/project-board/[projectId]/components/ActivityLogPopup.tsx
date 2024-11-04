
import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface LogResponse {
  logAction: string;
  logTime: string;
  logProject: string;
  logActor: string;
  taskName: string;
}

interface MemberDetail {
  memberEmail: string;
  memberName: string;
  memberLastname: string;
  username: string;
  img: string | null;
}

interface MemberResponse {
  memberId: string;
  detail: MemberDetail;
}

interface ActivityLogPopupProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

export default function ActivityLogPopup({ projectId, isOpen, onClose, projectName = "Project Name" }: ActivityLogPopupProps) {
  const [logs, setLogs] = useState<LogResponse[]>([]);
  const [members, setMembers] = useState<Record<string, MemberResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  //hardcode
  const projId = "a4c208c0-2c8d-41dd-9042-4bc3eaa54a16";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !event.composedPath().includes(modalRef.current)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(projectId)

        const storedData = localStorage.getItem("jwt");
        if (!storedData) {
          window.location.href = '/login';
          return;
        }

        const userData = JSON.parse(storedData) as { token: string; memberId: string };
        if (!userData.token) {
          window.location.href = '/login';
          return;
        }

        //change to project ID
        const response = await fetch(`${API_BASE_URL}/log?p=${projId}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch logs');
        const logData: LogResponse[] = await response.json();

        const filteredLogs = logData.filter(log =>
          log.logAction.toLowerCase() === 'add' ||
          log.logAction.toLowerCase() === 'delete'
        );

        setLogs(filteredLogs);

        const uniqueActors = Array.from(new Set(filteredLogs.map(log => log.logActor)));
        const memberDetails: Record<string, MemberResponse> = {};

        await Promise.all(

          uniqueActors.map(async (actorId) => {
            try {
              console.log(actorId)
              const memberResponse = await fetch(`${API_BASE_URL}/member?m=${actorId}`, {
                headers: {
                  'Authorization': `Bearer ${userData.token}`,
                  'Content-Type': 'application/json',
                },
              });
              if (memberResponse.ok) {
                const memberData: MemberResponse = await memberResponse.json();
                memberDetails[actorId] = memberData;
              }
            } catch (error) {
              console.error(`Failed to fetch member details for ${actorId}`, error);
            }
          })
        );

        setMembers(memberDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'delete':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'add':
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] overflow-hidden z-50"
      >
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b">
          <h2 className="text-xl text-gray-500">
            {projectName} <span className="text-black mx-2">{">"}</span> Activity Log
          </h2>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 4rem)' }}>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No activity logs found</div>
          ) : (
            <div className="space-y-6">
              {logs
                .sort((a, b) => new Date(b.logTime).getTime() - new Date(a.logTime).getTime())
                .map((log, index) => {
                  const member = members[log.logActor];
                  const time = new Date(log.logTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });

                  return (
                    <div key={index} className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {member?.detail.img ? (
                          <img
                            src={member.detail.img}
                            alt={`${member.detail.memberName}'s avatar`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <span className="font-medium">
                          {member ? `${member.detail.memberName} ${member.detail.memberLastname}` : 'Unknown User'}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="text-gray-500">
                        {formatDate(log.logTime)} {time}
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.logAction)}
                        <span className="font-medium">Task name</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
