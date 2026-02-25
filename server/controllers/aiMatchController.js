const User = require("../models/User");
const stringSimilarity = require("string-similarity");

exports.getAiMatches = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);

    const learnSkills = me.skills
      .filter(s => s.type === "learn")
      .map(s => s.name.toLowerCase());

    const allTeachers = await User.find({
      _id: { $ne: me._id },
      "skills.type": "teach"
    }).select("name skills trustScore");

    const matches = [];

    allTeachers.forEach(teacher => {
      teacher.skills.forEach(skill => {
        if (skill.type === "teach") {
          learnSkills.forEach(lskill => {
            const similarity = stringSimilarity.compareTwoStrings(lskill, skill.name.toLowerCase());
            if (similarity > 0.5) { // threshold
              matches.push({ teacher, skill: skill.name, similarity });
            }
          });
        }
      });
    });

    // sort by similarity + trustScore
    matches.sort((a, b) => b.similarity - a.similarity || b.teacher.trustScore - a.teacher.trustScore);

    res.json(matches);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
