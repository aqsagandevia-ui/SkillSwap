import { useState } from "react";

const allSkills = [
  {
    id: 1,
    title: "Web Development",
    wants: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80",
    users: 120,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Graphic Design",
    wants: "SEO Marketing",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    users: 85,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Video Editing",
    wants: "Content Writing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80",
    users: 65,
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Data Science",
    wants: "Web Development",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    users: 95,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 5,
    title: "Mobile Apps",
    wants: "Backend Dev",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
    users: 78,
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    title: "Photography",
    wants: "Photoshop",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80",
    users: 52,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 7,
    title: "Digital Marketing",
    wants: "Graphic Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    users: 110,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 8,
    title: "Python Programming",
    wants: "Machine Learning",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80",
    users: 88,
    color: "from-green-600 to-teal-500"
  },
  {
    id: 9,
    title: "English Language",
    wants: "Spanish",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    users: 145,
    color: "from-red-500 to-pink-500"
  }
];

export default function BrowseSkills() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = allSkills.filter(skill =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.wants.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Skills
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find people who want to learn what you know, and teach what you want to learn
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No skills found</h3>
            <p className="mt-2 text-gray-500">Try searching for a different skill</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 card-hover"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                  <img
                    src={skill.image}
                    alt={skill.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {skill.users} users
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <span className="text-secondary">↔</span> Wants: {skill.wants}
                  </p>
                  <button className="mt-4 w-full bg-gradient-to-r from-primary to-indigo-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:shadow-primary/30">
                    Request Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
