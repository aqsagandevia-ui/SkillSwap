import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // New skill form state (skills to teach)
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skillName: "",
    category: "technology",
    description: "",
    experienceLevel: "intermediate"
  });

  // Skills to learn form state
  const [showLearnForm, setShowLearnForm] = useState(false);
  const [newLearnSkill, setNewLearnSkill] = useState({
    skillName: "",
    category: "technology",
    description: "",
    experienceLevel: "beginner"
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    title: ""
  });

  useEffect(() => {
    fetchUserData();
    fetchSkills();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
      setSkillsToLearn(data.skillsToLearn || []);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        title: data.title || ""
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load profile");
      setIsLoading(false);
    }
  };

  const fetchSkills = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/skills/my-skills", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    setIsSaving(true);

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
    setIsSaving(false);
  };

  const handleAddSkill = async () => {
    if (!newSkill.skillName.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });

      if (!response.ok) {
        throw new Error("Failed to add skill");
      }

      const data = await response.json();
      setSkills([...skills, data.skill]);
      setNewSkill({
        skillName: "",
        category: "technology",
        description: "",
        experienceLevel: "intermediate"
      });
      setShowSkillForm(false);
    } catch (err) {
      console.error("Error adding skill:", err);
      setError("Failed to add skill");
    }
  };

  const handleRemoveSkill = async (skillId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to remove skill");
      }

      setSkills(skills.filter(s => s._id !== skillId));
    } catch (err) {
      console.error("Error removing skill:", err);
      setError("Failed to remove skill");
    }
  };

  // Handle adding skill to learn
  const handleAddSkillToLearn = async () => {
    if (!newLearnSkill.skillName.trim()) return;

    const token = localStorage.getItem("token");
    const updatedSkillsToLearn = [...skillsToLearn, { ...newLearnSkill, _id: Date.now().toString() }];

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ skillsToLearn: updatedSkillsToLearn })
      });

      if (!response.ok) {
        throw new Error("Failed to add skill to learn");
      }

      const data = await response.json();
      setSkillsToLearn(data.user.skillsToLearn || []);
      setNewLearnSkill({
        skillName: "",
        category: "technology",
        description: "",
        experienceLevel: "beginner"
      });
      setShowLearnForm(false);
    } catch (err) {
      console.error("Error adding skill to learn:", err);
      setError("Failed to add skill to learn");
    }
  };

  // Handle removing skill to learn
  const handleRemoveSkillToLearn = async (skillId) => {
    const token = localStorage.getItem("token");
    const updatedSkillsToLearn = skillsToLearn.filter(s => s._id !== skillId);

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ skillsToLearn: updatedSkillsToLearn })
      });

      if (!response.ok) {
        throw new Error("Failed to remove skill to learn");
      }

      const data = await response.json();
      setSkillsToLearn(data.user.skillsToLearn || []);
    } catch (err) {
      console.error("Error removing skill to learn:", err);
      setError("Failed to remove skill to learn");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be less than 3MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const response = await fetch("/api/users/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ photo: base64Image })
        });

        if (!response.ok) {
          throw new Error("Failed to update profile photo");
        }

        const data = await response.json();
        setUser(data.user);
        setIsUploading(false);
      };

      reader.onerror = () => {
        setError("Failed to read image file");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("Failed to upload photo. Please try again.");
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => { setError(""); fetchUserData(); fetchSkills(); }}
            className="mt-4 text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-6">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg shadow-primary/5 p-8 mb-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative group">
            {user?.photo ? (
              <img
                src={user.photo}
                className="h-40 w-40 rounded-3xl object-cover border-4 border-white shadow-lg"
                alt="user"
              />
            ) : (
              <div className="h-40 w-40 rounded-3xl border-4 border-white shadow-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-5xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {isUploading ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="text-white text-center">
                  <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium">Change Photo</span>
                </div>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Frontend Developer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {user?.name || "User"}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </span>
                </div>
                
                <p className="text-gray-500 font-medium mb-2">
                  {user?.title || "Skill Enthusiast"}
                </p>
                
                <p className="text-gray-600 max-w-xl mb-4">
                  {user?.bio || "Looking to exchange skills and grow together."}
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-primary">{skills.length}</div>
                <div className="text-sm text-gray-500">Skills</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-purple-600">{user?.trustScore || 0}</div>
                <div className="text-sm text-gray-500">Trust Score</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(!isEditing)}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
              </button>

              {isEditing && (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      bio: user?.bio || "",
                      title: user?.title || ""
                    });
                  }}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* My Skills Section (Skills I can teach) */}
      <div className="bg-white rounded-3xl shadow-lg shadow-primary/5 p-6 border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            My Skills
          </h3>
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showSkillForm && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Add New Skill (I can teach)</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill({...newSkill, skillName: e.target.value})}
                  placeholder="e.g., JavaScript, Photography"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="technology">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="language">Language</option>
                  <option value="music">Music</option>
                  <option value="art">Art</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  value={newSkill.experienceLevel}
                  onChange={(e) => setNewSkill({...newSkill, experienceLevel: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="Brief description of your skill"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.skillName.trim()}
                className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
              >
                Save Skill
              </button>
              <button
                onClick={() => setShowSkillForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Skills List */}
        {skills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-gradient-to-br from-primary/5 to-indigo-50 rounded-2xl p-4 border border-primary/20 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{skill.skillName}</h4>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                      {skill.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Level:</span> {skill.experienceLevel}
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-500">{skill.description}</p>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  Updated: {new Date(skill.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-gray-500">No skills added yet. Add your first skill!</p>
          </div>
        )}
      </div>

      {/* Skills I Want to Learn Section */}
      <div className="bg-white rounded-3xl shadow-lg shadow-purple-500/5 p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
            Skills I Want to Learn
          </h3>
          <button
            onClick={() => setShowLearnForm(!showLearnForm)}
            className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill to Learn
          </button>
        </div>

        {/* Add Skill to Learn Form */}
        {showLearnForm && (
          <div className="bg-purple-50 rounded-2xl p-6 mb-6 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-4">Add Skill I Want to Learn</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newLearnSkill.skillName}
                  onChange={(e) => setNewLearnSkill({...newLearnSkill, skillName: e.target.value})}
                  placeholder="e.g., Python, Guitar, French"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newLearnSkill.category}
                  onChange={(e) => setNewLearnSkill({...newLearnSkill, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                >
                  <option value="technology">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="language">Language</option>
                  <option value="music">Music</option>
                  <option value="art">Art</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desired Level</label>
                <select
                  value={newLearnSkill.experienceLevel}
                  onChange={(e) => setNewLearnSkill({...newLearnSkill, experienceLevel: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newLearnSkill.description}
                  onChange={(e) => setNewLearnSkill({...newLearnSkill, description: e.target.value})}
                  placeholder="What do you want to learn?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddSkillToLearn}
                disabled={!newLearnSkill.skillName.trim()}
                className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 font-medium"
              >
                Save Skill
              </button>
              <button
                onClick={() => setShowLearnForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Skills to Learn List */}
        {skillsToLearn.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsToLearn.map((skill) => (
              <div
                key={skill._id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{skill.skillName}</h4>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full capitalize">
                      {skill.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveSkillToLearn(skill._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Desired Level:</span> {skill.experienceLevel}
                </div>
                {skill.description && (
                  <p className="text-sm text-gray-500">{skill.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500">No skills to learn yet. Add skills you want to learn!</p>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

