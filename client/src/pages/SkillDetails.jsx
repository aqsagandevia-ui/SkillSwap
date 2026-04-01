import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SkillDetails() {
  const { state } = useLocation();
  const { title } = useParams();
  const navigate = useNavigate();

  // fallback if state lost
  const skill = state?.skill || {
    title: decodeURIComponent(title),
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  };

  // 🔥 Rich content for each skill
  const skillContent = {
    "Web Development": {
      overview:
        "Web Development involves building responsive and interactive websites using technologies like HTML, CSS, JavaScript, React, and backend frameworks. It is one of the most in-demand skills globally.",
      benefits:
        "High-paying jobs, freelancing opportunities, ability to build startups, remote work flexibility.",
      useCases:
        "Building websites, SaaS products, e-commerce platforms, blogs, and enterprise applications.",
      outcomes:
        "You will be able to build full-stack applications, deploy them, and work as a professional developer.",
    },

    "Graphic Design": {
      overview:
        "Graphic Design is the art of creating visual content using tools like Photoshop, Illustrator, and Figma.",
      benefits:
        "Creative career, freelancing, branding opportunities, high demand in marketing.",
      useCases:
        "Logos, posters, UI/UX, advertisements, social media creatives.",
      outcomes: "You will create visually appealing and professional designs.",
    },

    "Data Science": {
      overview:
        "Data Science involves analyzing and interpreting data using Python, statistics, and machine learning.",
      benefits:
        "High salary, strong demand, decision-making roles in companies.",
      useCases: "AI systems, business analytics, prediction models.",
      outcomes:
        "You will work with real-world datasets and build intelligent models.",
    },

    "Video Editing": {
      overview:
        "Video Editing focuses on creating professional videos using tools like Premiere Pro and After Effects.",
      benefits: "High demand in content creation, freelancing opportunities.",
      useCases: "YouTube, reels, films, advertisements.",
      outcomes: "You will create high-quality video content.",
    },

    "Mobile Apps": {
      overview:
        "Mobile App Development involves building Android/iOS apps using Flutter or React Native.",
      benefits: "Startup opportunities, high demand, monetization options.",
      useCases: "Business apps, social apps, productivity tools.",
      outcomes: "You will publish apps on Play Store/App Store.",
    },

    Photography: {
      overview:
        "Photography is the art of capturing moments using professional techniques and editing tools.",
      benefits: "Creative career, freelancing, travel opportunities.",
      useCases: "Events, product shoots, travel blogs.",
      outcomes: "You will take and edit professional photos.",
    },
  };

  const content = skillContent[skill.title] || {
    overview: `${skill.title} is an important modern skill.`,
    benefits: "Career growth and opportunities.",
    useCases: "Used in many industries.",
    outcomes: "Gain practical experience.",
  };

  // ✅ Skill-based mentors
  const mentorsData = {
    "Web Development": [
      {
        name: "Rahul Sharma",
        exp: "5+ years React Developer",
        img: "https://i.pravatar.cc/150?img=11",
      },
      {
        name: "Amit Verma",
        exp: "Full Stack Engineer",
        img: "https://i.pravatar.cc/150?img=13",
      },
    ],

    "Graphic Design": [
      {
        name: "Sneh Patel",
        exp: "UI/UX Designer (4 yrs)",
        img: "https://i.pravatar.cc/150?img=12",
      },
      {
        name: "Nehal Shah",
        exp: "Brand Designer",
        img: "https://i.pravatar.cc/150?img=14",
      },
    ],

    "Data Science": [
      {
        name: "Karan Mehta",
        exp: "Data Scientist (Python, ML)",
        img: "https://i.pravatar.cc/150?img=15",
      },
      {
        name: "Priya Desai",
        exp: "AI Engineer",
        img: "https://i.pravatar.cc/150?img=16",
      },
    ],

    "Video Editing": [
      {
        name: "Rohit Singh",
        exp: "Video Editor (YouTube, Ads)",
        img: "https://i.pravatar.cc/150?img=17",
      },
      {
        name: "Ankit Joshi",
        exp: "Film Editor",
        img: "https://i.pravatar.cc/150?img=18",
      },
    ],

    "Mobile Apps": [
      {
        name: "Neha Shah",
        exp: "Flutter Developer",
        img: "https://i.pravatar.cc/150?img=19",
      },
      {
        name: "Deepika Yadav",
        exp: "React Native Expert",
        img: "https://i.pravatar.cc/150?img=20",
      },
    ],

    Photography: [
      {
        name: "Amita Patel",
        exp: "Professional Photographer",
        img: "https://i.pravatar.cc/150?img=21",
      },
      {
        name: "Meera Shah",
        exp: "Fashion Photographer",
        img: "https://i.pravatar.cc/150?img=22",
      },
    ],
  };

  // ✅ Get mentors based on selected skill
  const mentors = mentorsData[skill.title] || [];

  return (
    <div className="pt-20 px-6 max-w-6xl mx-auto">
      {/* 🔙 Back Button */}
      <button
        onClick={() => {
          navigate("/");
          setTimeout(() => {
            document
              .getElementById("popular-skills")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}
        className="mb-6 text-indigo-600 font-semibold hover:underline"
      >
        ← Back to Skills
      </button>

      {/* 🔹 HERO IMAGE (UPDATED UI) */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[420px] rounded-3xl overflow-hidden shadow-xl group">
        <img
          src={skill.image}
          alt={skill.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

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

      {/* <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white shadow-md rounded-xl p-4">
          <p className="text-lg font-bold text-primary">120+</p>
          <p className="text-sm text-gray-500">Learners</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <p className="text-lg font-bold text-primary">4.8 ⭐</p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <p className="text-lg font-bold text-primary">Beginner</p>
          <p className="text-sm text-gray-500">Level</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <p className="text-lg font-bold text-primary">Free</p>
          <p className="text-sm text-gray-500">Access</p>
        </div>
      </div> */}

      {/* 🔹 CONTENT CARDS */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-blue-700">Overview</h2>
          <p className="text-gray-700">{content.overview}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-green-700">Benefits</h2>
          <p className="text-gray-700">{content.benefits}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-purple-700">Use Cases</h2>
          <p className="text-gray-700">{content.useCases}</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 shadow-md">
          <h2 className="font-bold text-lg mb-2 text-orange-700">
            Learning Outcomes
          </h2>
          <p className="text-gray-700">{content.outcomes}</p>
        </div>
      </div>

      {/* 🔹 MENTORS */}
      <div className="mt-14">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Available Mentors
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mentors.map((mentor, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <img
                src={mentor.img}
                alt={mentor.name}
                className="w-20 h-20 rounded-full mx-auto border-4 border-indigo-100"
              />
              <h3 className="text-lg font-semibold text-center mt-4">
                {mentor.name}
              </h3>
              <p className="text-sm text-gray-500 text-center">{mentor.exp}</p>

              <button
                onClick={() =>
                  navigate(`/mentor/${mentor.id}`, {
                    state: { mentor, skill },
                  })
                }
                className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-xl"
              >
                Select Mentor
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
