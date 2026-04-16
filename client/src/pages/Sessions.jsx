import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sessions() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(state?.mentor || null);
  const [requestForm, setRequestForm] = useState({ 
    skill: state?.skill?.skillName || "", 
    date: "", 
    time: "" 
  });
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState("");

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    fetchSessions();
  }, []);

  // Auto-open request modal if mentor is passed from MentorProfile
  useEffect(() => {
    if (state?.mentor) {
      setShowRequestModal(true);
    }
  }, [state?.mentor]);

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/session", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSession = async (sessionId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/session/accept", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to accept session");
      }

      setSessions(sessions.map(s => 
        s._id === sessionId ? data.session : s
      ));
      alert("Session accepted! Meeting link has been created.");
    } catch (err) {
      console.error("Error accepting session:", err);
      alert(err.message || "Failed to accept session");
    }
  };

  const handleUpdateMeetingLink = async (sessionId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/session/update-link", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, meetingLink: meetingLinkInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to update meeting link");
      }

      setSessions(sessions.map(s => 
        s._id === sessionId ? data.session : s
      ));
      setShowLinkModal(false);
      setMeetingLinkInput("");
      setEditingSessionId(null);
      alert("Meeting link updated successfully!");
    } catch (err) {
      console.error("Error updating meeting link:", err);
      alert(err.message || "Failed to update meeting link");
    }
  };

  const openLinkModal = (session) => {
    setEditingSessionId(session._id);
    setMeetingLinkInput(session.meetingLink || "");
    setShowLinkModal(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSendingRequest(true);

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          teacherId: selectedTeacher._id,
          skill: requestForm.skill,
          date: requestForm.date,
          time: requestForm.time
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to send request");
      }

      const data = await response.json();
      setSessions([data.session, ...sessions]);
      setShowRequestModal(false);
      setSelectedTeacher(null);
      setRequestForm({ skill: state?.skill?.skillName || "", date: "", time: "" });
      alert("Session request sent! Teacher will confirm and create the meeting link.");
    } catch (err) {
      console.error("Error sending request:", err);
      alert(err.message);
    } finally {
      setSendingRequest(false);
    }
  };

  // Generate unique Google Meet ID
  const generateMeetingId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 2) result += "-";
    }
    return result;
  };

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

  const isMentor = (session) => {
    return currentUser && session.mentor && session.mentor._id === currentUser._id;
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-gray-600 mt-2">Manage your learning and teaching sessions</p>
          </div>
          <button
            onClick={() => navigate("/browse")}
            className="px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Find Mentors
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions yet</h3>
            <p className="mt-2 text-gray-500">Start matching with others to schedule learning sessions!</p>
            <button 
              onClick={() => navigate("/browse")}
              className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Browse Skills
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => {
              const amIMentor = isMentor(session);
              const otherUser = amIMentor ? session.learner : session.mentor;
              
              // Format date and time from scheduledAt
              const scheduledDate = session.scheduledAt ? new Date(session.scheduledAt) : null;
              const dateStr = scheduledDate ? scheduledDate.toLocaleDateString() : "N/A";
              const timeStr = scheduledDate ? scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";
              
              return (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{session.skillTopic?.skillName || "Session"}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                      <span className="font-medium">{amIMentor ? "Learner:" : "Mentor:"}</span>
                      <span>{otherUser?.name || "User"}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      {otherUser?.photo ? (
                        <img
                          src={otherUser?.photo}
                          alt={otherUser?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{amIMentor ? "Learner" : "Mentor"}</p>
                        <p className="font-semibold text-gray-900">{otherUser?.name || "User"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span><strong>Scheduled:</strong> {dateStr} at {timeStr}</span>
                    </div>

                    {/* Status-based actions */}
                    <div className="space-y-2">
                      {/* For Mentors: Accept pending sessions and create link */}
                      {amIMentor && session.status === "pending" && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
                            💡 <strong>You control the meeting</strong> - Accept to create the link
                          </p>
                          <button
                            onClick={() => handleAcceptSession(session._id)}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                          >
                            ✅ Accept & Create Meeting Link
                          </button>
                        </div>
                      )}
                      
                      {/* For Learners: Waiting for mentor to accept and create link */}
                      {!amIMentor && session.status === "pending" && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600 bg-purple-50 p-2 rounded-lg">
                            💡 <strong>Mentor creates the link</strong> - Waiting for mentor to accept...
                          </p>
                          <div className="w-full py-3 bg-yellow-50 border-2 border-yellow-200 text-yellow-800 font-medium rounded-xl text-center">
                            ⏳ Waiting for mentor to accept...
                          </div>
                        </div>
                      )}
                      
                      {/* When session is accepted: Show join button if link exists */}
                      {session.status === "accepted" && session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                          🎥 Join Google Meet
                        </a>
                      )}
                      
                      {/* For mentors: Option to update meeting link */}
                      {amIMentor && session.status === "accepted" && session.meetingLink && (
                        <button
                          onClick={() => openLinkModal(session)}
                          className="w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-xl transition-all text-sm"
                        >
                          🔗 Update Meeting Link
                        </button>
                      )}
                      
                      {/* Waiting message for learners when link not yet created */}
                      {!amIMentor && session.status === "accepted" && !session.meetingLink && (
                        <div className="w-full py-3 bg-yellow-50 border-2 border-yellow-200 text-yellow-800 font-medium rounded-xl text-center">
                          ⏳ Mentor is setting up the meeting...
                        </div>
                      )}
                    </div>

                    {/* Show rating for completed sessions */}
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
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for requesting session */}
      {showRequestModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Schedule Learning Session</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mentor: <span className="font-semibold">{selectedTeacher.name}</span>
            </p>
            
            <form onSubmit={handleSendRequest} className="space-y-4">
              {/* Skill */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <input
                  type="text"
                  value={requestForm.skill}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, skill: e.target.value })
                  }
                  placeholder="e.g., Web Development"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Date
                </label>
                <input
                  type="date"
                  value={requestForm.date}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, date: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Time
                </label>
                <input
                  type="time"
                  value={requestForm.time}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, time: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-blue-700">
                  ✓ A Google Meet link will be automatically created for this session
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedTeacher(null);
                    setRequestForm({ skill: state?.skill?.skillName || "", date: "", time: "" });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest || !requestForm.skill || !requestForm.date || !requestForm.time}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingRequest ? "Scheduling..." : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for updating meeting link */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Meeting Link</h3>
            <p className="text-sm text-gray-500 mb-4">
              If you need to use a different meeting link, you can change it here.
            </p>
            <input
              type="url"
              value={meetingLinkInput}
              onChange={(e) => setMeetingLinkInput(e.target.value)}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setMeetingLinkInput("");
                  setEditingSessionId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateMeetingLink(editingSessionId)}
                disabled={!meetingLinkInput.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

