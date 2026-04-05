import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SkillDetails() {
  const { state } = useLocation();
  const { title } = useParams();
  const navigate = useNavigate();

  // Get real data from BrowseSkills or use URL param as fallback
  const skillData = state?.skill || { skillName: decodeURIComponent(title) };
  const allMentors = state?.allMentors || [];

  // Use real database data if available, otherwise use title
  const skill = {
    title: skillData.skillName || decodeURIComponent(title),
    image: skillData.image,
    overview: skillData.overview || `${skillData.skillName} is an important modern skill.`,
    benefits: skillData.benefits || "Career growth and opportunities.",
    useCases: skillData.useCases || "Used in many industries.",
    outcomes: skillData.description || "Gain practical experience.",
    category: skillData.category,
    mentorsCount: allMentors.length || 0
  };

  // Use real mentors from the database
  const mentors = allMentors.length > 0 
    ? allMentors.map(m => ({
        id: m.user?._id,
        name: m.user?.name || "Unknown",
        exp: `${m.experienceLevel} • ${m.user?.yearsOfExperience || 0} years experience`,
        img: m.user?.photo,
        user: m.user,
        fullMentor: m
      }))
    : [];

  return (
    <div className="pt-20 px-6 max-w-6xl mx-auto pb-12">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/browse")}
        className="mb-6 text-primary font-semibold hover:underline"
      >
        ← Back to Skills
      </button>

      {/* 🔹 HERO IMAGE (UPDATED UI) */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-xl group">
        {skill.image ? (
          <img
            src={skill.image}
            alt={skill.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
            <span className="text-8xl opacity-50">📚</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Title on Image */}
        <div className="absolute bottom-6 left-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {skill.title}
          </h1>
          <p className="text-white/80 text-sm mt-1">Learn • Practice • Grow</p>
        </div>
      </div>

      {/* 🔹 CONTENT CARDS */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-blue-700">Overview</h2>
          <p className="text-gray-700">{skill.overview}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-green-700">Benefits</h2>
          <p className="text-gray-700">{skill.benefits}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-purple-700">Use Cases</h2>
          <p className="text-gray-700">{skill.useCases}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-orange-700">
            Learning Outcomes
          </h2>
          <p className="text-gray-700">{skill.outcomes}</p>
        </div>
      </div>

      {/* 🔹 MENTORS */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Available Mentors ({mentors.length})
        </h2>

        {mentors.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mentors.map((mentor, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                {mentor.img ? (
                  <img
                    src={mentor.img}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-100 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-100 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
                <h3 className="text-lg font-semibold text-center mt-4">
                  {mentor.name}
                </h3>
                <p className="text-sm text-gray-500 text-center">{mentor.exp}</p>

                <button
                  onClick={() =>
                    navigate(`/mentor/${mentor.id}`, {
                      state: { mentor: mentor.user, skill: skillData },
                    })
                  }
                  className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Select Mentor
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-lg">No mentors available for this skill yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
