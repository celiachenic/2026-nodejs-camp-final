const appDataSource = require("../db/dataSource");
const skillSchema = require("../db/entities/Skill");
const createError = require("../utils/createError");
const isUUid = require("../utils/isUuid");

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
    return next(createError(500, "技能取得失敗"));
  }
};

const postSkill = async (req, res, next) => {
  try {
    const skillRepo = appDataSource.getRepository(skillSchema);
    //400：沒給 name、name 不是字串、或 name 是空字串／全空白
    const { name } = req.body;
    if (typeof name !== "string" || name.trim() === "") {
      return next(createError(400, "欄位未填寫正確"));
    }
    const nameData = name.trim();
    //409：name 與既有技能重複
    if (await skillRepo.findOneBy({ name: nameData })) {
      return next(createError(409, "資料重複"));
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
    return next(createError(500, "技能新增失敗"));
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    if (!isUUid(skillId)) {
      return next(createError(400, "格式錯誤"));
    }
    const skillRepo = appDataSource.getRepository(skillSchema);
    const result = await skillRepo.delete({ id: skillId });
    if (result.affected !== 1) {
      return next(createError(400, "ID錯誤"));
    }
    return res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "技能刪除失敗"));
  }
};

module.exports = {
  getSkill,
  postSkill,
  deleteSkill,
};
