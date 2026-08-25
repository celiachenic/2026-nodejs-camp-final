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
    return next(new Error("技能取得失敗"));
  }
};

const postSkill = async (req, res, next) => {
  try {
    const skillRepo = appDataSource.getRepository(skillSchema);
    //400：沒給 name、name 不是字串、或 name 是空字串／全空白
    const { name } = req.body;
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
    }
    const nameData = name.trim();
    //409：name 與既有技能重複
    if (await skillRepo.findOneBy({ name: nameData })) {
      return res.status(409).json({
        status: "failed",
        message: "資料重複",
      });
    }

    const newSkill = await skillRepo.save({
      name: nameData,
    });
    return res.status(200).json({
      status: "success",
      data: {
        id: newSkill.id,
        name: newSkill.name,
        createdAt: newSkill.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new Error("技能新增失敗"));
  }
};

module.exports = {
  getSkill,
  postSkill,
};
