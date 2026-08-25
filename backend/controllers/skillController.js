const appDataSource = require("../db/dataSource");
const skillSchema = require("../db/entities/Skill");

const getSkill = async (req, res, next) => {
  try {
    const skillRepo = appDataSource.getRepository(skillSchema);
    const skills = await skillRepo.find();
    const skillArray = [];
    for (const skill of skills) {
      skillArray.push({ id: skill.id, name: skill.name });
    }
    return res.status(200).json({
      status: "success",
      data: skillArray,
    });
  } catch (error) {
    console.error(error);
    return next(new Error("skill 取得失敗"));
  }
};

module.exports = {
  getSkill,
};
