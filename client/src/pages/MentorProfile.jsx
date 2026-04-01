import { useLocation, useNavigate } from "react-router-dom";

export default function MentorProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const mentor = state?.mentor;
  const skill = state?.skill;

  if (!mentor) {
    return <div className="p-10 text-center">Mentor not found</div>;
  }

  // ✅ STATIC mentor data (NO RANDOM IMAGE NOW)
  const mentorDetails = {
    "Rahul Sharma": {
      expertise: ["React", "JavaScript", "Frontend"],
      rating: 4.8,
      sessions: 120,
      image: "/mentors/rahul.jpg",
    },
    "Sneh Patel": {
      expertise: ["UI/UX", "Figma", "Design Systems"],
      rating: 4.7,
      sessions: 95,
      image: "/mentors/sneha.jpg",
    },
    "Amit Verma": {
      expertise: ["Node.js", "MongoDB", "Full Stack"],
      rating: 4.9,
      sessions: 150,
      image: "/mentors/amit.jpg",
    },
  };

  const details = mentorDetails[mentor.name] || {
    expertise: ["General Skills"],
    rating: 4.5,
    sessions: 50,
    image: "/mentors/default.jpg",
  };

  // ⭐ Stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < Math.floor(rating) ? "⭐" : "☆"}</span>
    ));
  };

  return (
    <div className="pt-20 px-6 max-w-5xl mx-auto">
      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary font-semibold"
      >
        ← Back
      </button>

      {/* 🔹 PROFILE CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:flex gap-8 items-center">
        {/* ✅ STATIC IMAGE FIXED */}
        <div className="flex justify-center">
          <div className="relative group">
            <img
              src={mentor.img}
              alt={mentor.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition"
            />

            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-200 blur-xl -z-10"></div>
          </div>
        </div>

        {/* 🔹 INFO */}
        <div className="flex-1 mt-6 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{mentor.name}</h1>

          <p className="text-gray-500 mt-1">{mentor.exp}</p>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-2 mt-3 text-lg">
            <div className="text-yellow-500">{renderStars(details.rating)}</div>
            <span className="text-gray-600 text-sm">({details.rating})</span>
          </div>

          {/* 🔹 Expertise */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {details.expertise.map((item, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 🔹 Stats */}
          <div className="mt-4 text-gray-600">
            <p>📚 Sessions Completed: {details.sessions}</p>
            <p>🎯 Skill: {skill?.title}</p>
          </div>

          {/* 🔹 BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate("/chat")}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
            >
              💬 Chat
            </button>

            <button
              onClick={() => navigate("/sessions")}
              className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
            >
              📅 Book Session
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 ABOUT */}
      <div className="mt-8 bg-gray-50 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-2">About Mentor</h2>
        <p className="text-gray-600">
          {mentor.name} is an experienced mentor specializing in{" "}
          <b>{skill?.title}</b>. They focus on practical learning, real-world
          projects, and helping students build strong careers.
        </p>
      </div>
    </div>
  );
}
