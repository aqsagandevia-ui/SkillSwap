import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("swaps");

  const mySwaps = [
    {
      skill: "Web Development",
      with: "Graphic Design",
      status: "Pending",
      date: "2 hours ago",
    },
    {
      skill: "React",
      with: "Node.js",
      status: "Accepted",
      date: "1 day ago",
    },
  ];

  const incomingRequests = [
    {
      user: "Ali Khan",
      avatar: "https://i.pravatar.cc/40?img=11",
      wants: "React",
      offers: "UI/UX Design",
    },
    {
      user: "Sara Malik",
      avatar: "https://i.pravatar.cc/40?img=5",
      wants: "JavaScript",
      offers: "Content Writing",
    },
    {
      user: "Ahmed Raza",
      avatar: "https://i.pravatar.cc/40?img=12",
      wants: "Python",
      offers: "Data Analysis",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-6">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h2>
        <p className="text-gray-500 mt-1">
          Manage your skill swaps and requests
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Swaps", value: "2", icon: "🔄", color: "from-blue-500 to-blue-600" },
          { label: "Pending Requests", value: "5", icon: "📩", color: "from-yellow-500 to-orange-500" },
          { label: "Completed Swaps", value: "8", icon: "✅", color: "from-green-500 to-emerald-500" },
          { label: "Skills Listed", value: "4", icon: "💡", color: "from-purple-500 to-pink-500" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 card-hover border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl`}>
                {item.icon}
              </div>
              <span className="text-3xl font-bold text-gray-900">{item.value}</span>
            </div>
            <p className="text-gray-500 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("swaps")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "swaps"
              ? "bg-white text-primary shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Swaps
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            activeTab === "requests"
              ? "bg-white text-primary shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Incoming Requests
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
        </button>
      </div>

      {/* MY SWAPS */}
      {activeTab === "swaps" && (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            My Swap Requests
          </h3>

          {mySwaps.length > 0 ? (
            <div className="space-y-4">
              {mySwaps.map((swap, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {swap.skill} ↔ {swap.with}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {swap.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                      swap.status
                    )}`}
                  >
                    {swap.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <p className="text-gray-500">No swap requests yet</p>
            </div>
          )}
        </div>
      )}

      {/* INCOMING REQUESTS */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 animate-fade-in">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-secondary rounded-full"></span>
            Incoming Requests
          </h3>

          <div className="space-y-4">
            {incomingRequests.map((req, i) => (
              <div
                key={i}
                className="flex flex-col lg:flex-row justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={req.avatar}
                    alt={req.user}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {req.user}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Wants <span className="text-primary font-medium">{req.wants}</span>
                      {" "}• Offers{" "}
                      <span className="text-secondary font-medium">{req.offers}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 lg:items-center">
                  <button className="flex-1 lg:flex-none px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                  </button>
                  <button className="flex-1 lg:flex-none px-5 py-2.5 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
