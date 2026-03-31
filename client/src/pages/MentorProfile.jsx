import { useLocation, useNavigate } from "react-router-dom";

export default function MentorProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const mentor = state?.mentor;
  const skill = state?.skill;

  if (!mentor) {
    return <div className="p-10 text-center">Mentor not found</div>;
  }

  return (
    <div className="pt-20 px-6 max-w-5xl mx-auto">

      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 font-semibold"
      >
        ← Back
      </button>

      {/* 🔹 PROFILE CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

        <img
          src={mentor.img}
          alt={mentor.name}
          className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-200"
        />

        <h1 className="text-3xl font-bold mt-4">{mentor.name}</h1>

        <p className="text-gray-500 mt-1">{mentor.exp}</p>

        <p className="mt-3 text-indigo-600 font-medium">
          Skill: {skill?.title}
        </p>

        {/* 🔹 DETAILS */}
        <div className="mt-8 grid md:grid-cols-2 gap-6 text-left">

          <div className="p-5 bg-indigo-50 rounded-2xl">
            <h3 className="font-semibold mb-2">Expertise</h3>
            <p className="text-gray-600">{mentor.skills}</p>
          </div>

          <div className="p-5 bg-green-50 rounded-2xl">
            <h3 className="font-semibold mb-2">Experience</h3>
            <p className="text-gray-600">{mentor.exp}</p>
          </div>

          <div className="p-5 bg-purple-50 rounded-2xl">
            <h3 className="font-semibold mb-2">About Mentor</h3>
            <p className="text-gray-600">
              Passionate mentor helping students learn {skill?.title} with practical projects and real-world examples.
            </p>
          </div>

          <div className="p-5 bg-orange-50 rounded-2xl">
            <h3 className="font-semibold mb-2">Teaching Style</h3>
            <p className="text-gray-600">
              Interactive sessions, live coding, and real-world problem solving.
            </p>
          </div>

        </div>

        {/* 🔹 ACTION BUTTONS */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <button
            onClick={() => navigate("/chat")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
          >
            Chat
          </button>

          <button
            onClick={() => navigate("/sessions")}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
          >
            Book Session
          </button>

        </div>

      </div>
    </div>
  );
}