import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Static skills from Home page - fallback display
const staticSkills = [
  {
    title: "Web Development",
    wants: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
    users: 120,
    color: "from-blue-500 to-cyan-500",
    category: "technology",
    skillName: "Web Development"
  },
  {
    title: "Graphic Design",
    wants: "SEO Marketing",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    users: 85,
    color: "from-purple-500 to-pink-500",
    category: "design",
    skillName: "Graphic Design"
  },
  {
    title: "Video Editing",
    wants: "Content Writing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80",
    users: 65,
    color: "from-orange-500 to-red-500",
    category: "design",
    skillName: "Video Editing"
  },
  {
    title: "Data Science",
    wants: "Web Development",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    users: 95,
    color: "from-green-500 to-emerald-500",
    category: "technology",
    skillName: "Data Science"
  },
  {
    title: "Mobile Apps",
    wants: "Backend Dev",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
    users: 78,
    color: "from-indigo-500 to-purple-500",
    category: "technology",
    skillName: "Mobile Apps"
  },
  {
    title: "Photography",
    wants: "Photoshop",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80",
    users: 52,
    color: "from-pink-500 to-rose-500",
    category: "art",
    skillName: "Photography"
  }
];

export default function BrowseSkills() {
  const [skills, setSkills] = useState(staticSkills);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/skills", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      // Combine API data with static skills - remove duplicates by skillName
      if (data && data.length > 0) {
        const apiSkillNames = new Set(data.map(s => s.skillName?.toLowerCase()));
        const staticFallback = staticSkills.filter(
          s => !apiSkillNames.has(s.skillName?.toLowerCase())
        );
        setSkills([...data, ...staticFallback]);
      } else {
        // Use static skills if API returns empty
        setSkills(staticSkills);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
      // Fallback to static skills if API fails
      setSkills(staticSkills);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (skillGroup) => {
    // Navigate to SkillDetails with the full skill data
    navigate(`/skill/${encodeURIComponent(skillGroup.skillName || skillGroup.title)}`, {
      state: { skill: skillGroup, allMentors: skillGroup.mentors || [skillGroup] }
    });
  };

  const categories = ["all", "technology", "design", "business", "language", "music", "art", "sports", "other"];

  // Use static skills if no skills are loaded yet or if API returns empty
  const displaySkills = skills.length > 0 ? skills : staticSkills;

  // Group all skills by skillName to show mentors per skill
  const allSkillsWithMentors = displaySkills.reduce((acc, skill) => {
    const skillName = skill.skillName || skill.title;
    const category = skill.category || "other";
    const existing = acc.find(s => s.skillName === skillName);
    
    if (existing) {
      // If this skill already exists, add this mentor to the mentors array
      if (!existing.mentors) existing.mentors = [existing];
      existing.mentors.push(skill);
    } else {
      // New skill - initialize with mentors array
      acc.push({ 
        ...skill, 
        skillName, 
        mentors: [skill] 
      });
    }
    return acc;
  }, []);

  // Filter and sort to get popular skills (sorted by number of mentors)
  const popularSkills = allSkillsWithMentors.length > 0 
    ? allSkillsWithMentors.sort((a, b) => b.mentors.length - a.mentors.length)
    : staticSkills.map((skill, idx) => ({ ...skill, mentors: [skill] }));

  if (loading && skills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 pt-20 pb-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 pt-20 pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* POPULAR SKILLS SECTION */}
        {popularSkills && popularSkills.length > 0 && (
          <div id="popular-skills" className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Skills</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularSkills.map((skillGroup, i) => (
                  <div
                    key={`popular-${i}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 card-hover"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      {skillGroup.image ? (
                        <img
                          src={skillGroup.image}
                          alt={skillGroup.skillName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-6xl opacity-50">📚</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {skillGroup.mentors.length} mentor{skillGroup.mentors.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                        {skillGroup.skillName || skillGroup.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <span className="text-secondary">📚</span> {(skillGroup.category || "other").charAt(0).toUpperCase() + (skillGroup.category || "other").slice(1)}
                      </p>
                      {skillGroup.users && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <span>👥</span> {skillGroup.users} learners
                        </p>
                      )}
                      <button
                        onClick={() => handleRequestSwap(skillGroup)}
                        className="mt-4 w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-2.5 rounded-xl"
                      >
                        Request Swap
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Skill Details Modal removed - now navigates to SkillDetails page */}
    </div>
  );
}
