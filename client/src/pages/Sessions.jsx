import { useState, useEffect } from "react";

const mockSessions = [
  {
    _id: "1",
    skill: "React Development",
    teacher: { name: "Alice Johnson", photo: "https://i.pravatar.cc/40?img=1" },
    learner: { name: "You" },
    status: "accepted",
    date: "2024-01-15",
    time: "10:00 AM",
    liveLink: "https://meet.jit.si/skillswap-demo"
  },
  {
    _id: "2",
    skill: "UI/UX Design",
    teacher: { name: "You" },
    learner: { name: "Bob Smith", photo: "https://i.pravatar.cc/40?img=2" },
    status: "pending",
    date: "2024-01-16",
    time: "2:00 PM",
    liveLink: null
  },
  {
    _id: "3",
    skill: "Python Programming",
    teacher: { name: "Carol White", photo: "https://i.pravatar.cc/40?img=3" },
    learner: { name: "You" },
    status: "completed",
    date: "2024-01-10",
    time: "4:00 PM",
    liveLink: null,
    rating: 5
  }
];

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions yet</h3>
            <p className="mt-2 text-gray-500">Start matching with others to schedule learning sessions!</p>
            <a href="/browse" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all">
              Browse Skills
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">Manage your learning and teaching sessions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${selectedSession?._id === session._id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{session.skill}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={session.teacher.photo || "https://i.pravatar.cc/40"}
                    alt={session.teacher.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Teacher</p>
                    <p className="font-medium text-gray-900">{session.teacher.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {session.date} at {session.time}
                </div>

                {session.status === "accepted" && session.liveLink && (
                  <a
                    href={session.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Join Session
                  </a>
                )}

                {session.status === "completed" && session.rating && (
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < session.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
