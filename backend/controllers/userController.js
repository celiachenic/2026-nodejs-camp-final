const appDataSource = require("../db/dataSource");
const userSchema = require("../db/entities/User");
const createError = require("../utils/createError");
const emailValidator = require("../utils/emailValidator");
const passwordValidator = require("../utils/passwordValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//註冊
const signUp = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    //name、email、password 任一缺漏或為空字串
    if (
      email == null ||
      email.trim() === "" ||
      name == null ||
      name.trim() === "" ||
      password == null ||
      password.trim() === ""
    ) {
      return next(createError(400, "欄位未填寫正確"));
    }
    const emailData = email.trim().toLowerCase();
    const nameData = name.trim();
    const passwordData = password.trim();
    //檢查 email 格式
    if (!emailValidator(emailData)) {
      return next(createError(400, "email 格式不符"));
    }
    //檢查密碼格式
    if (!passwordValidator(passwordData)) {
      return next(
        createError(
          400,
          "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
        ),
      );
    }

    const userRepo = appDataSource.getRepository(userSchema);
    //檢查email是否重複
    if (await userRepo.findOneBy({ email: emailData })) {
      return next(createError(409, "Email 已被使用"));
    }

    const hashedPassword = await bcrypt.hash(passwordData, 10);

    const newUser = await userRepo.save({
      name: nameData,
      email: emailData,
      hashed_password: hashedPassword,
      role: "USER",
    });

    return res.status(201).json({
      status: "success",
      data: { user: { id: newUser.id, name: newUser.name } },
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "註冊失敗"));
  }
};

//登入
const login = async (req, res, next) => {
  try {
    const emailData = req.body?.email?.trim()?.toLowerCase();
    const passwordData = req.body?.password?.trim();
    //先檢查欄位與密碼規則
    if (!emailValidator(emailData) || !passwordValidator(passwordData)) {
      return next(createError(400, "輸入格式錯誤"));
    }
    const userRepo = appDataSource.getRepository(userSchema);
    const user = await userRepo.findOneBy({ email: emailData });
    //帳號不存在
    if (!user) {
      return next(createError(400, "使用者不存在或密碼輸入錯誤"));
    }
    //密碼錯誤
    const isMatch = await bcrypt.compare(passwordData, user.hashed_password);
    if (!isMatch) {
      return next(createError(400, "使用者不存在或密碼輸入錯誤"));
    }
    //登入成功後建立 payload，搭配 SECRET 產生 token
    const payload = {
      id: user.id,
      role: user.role,
    };

    const SECRET = process.env.JWT_SECRET;
    const expiresDay = process.env.JWT_EXPIRES_DAY;
    const token = jwt.sign(payload, SECRET, { expiresIn: expiresDay });

    return res.status(201).json({
      status: "success",
      data: {
        token,
        user: {
          name: user.name,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "登入失敗"));
  }
};

//取得個人資料
// 需要經過 authMiddlware，即可從 req.user 取得 user 資料
const getProfile = async (req, res, next) => {
  try {
    const user = req.user; //經過驗證後取得的 user entity
    return res.status(200).json({
      status: "success",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "取得個人檔案失敗"));
  }
};

//更新目前登入者的暱稱（name）
// 需要經過 authMiddlware，即可從 req.user 取得 user 資料
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const nameInput = req.body.name;
    if (typeof nameInput !== "string" || nameInput.trim() === "") {
      return next(createError(400, "欄位未填寫正確"));
    }
    //設計資料庫時有在 user entity 中限制 name 長度不大於 50
    if (nameInput.trim().length > 50) {
      return next(createError(400, "長度需小於 50 字"));
    }
    const nameData = nameInput.trim();
    if (user.name === nameData) {
      return next(createError(400, "使用者名稱未變更"));
    }
    const userRepo = appDataSource.getRepository(userSchema);
    const result = await userRepo.update({ id: user.id }, { name: nameData });
    if (result.affected !== 1) {
      return next(createError(400, "更新使用者資料失敗"));
    }
    return res.status(200).json({
      status: "success",
      data: {
        user: {
          name: nameData,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "更改暱稱失敗"));
  }
};

//更新密碼
const updatePassword = async (req, res, next) => {
  try {
    const { password, new_password, confirm_new_password } = req.body;
    //三個欄位任一缺漏或為空字串 → 400「欄位未填寫正確」
    if (
      typeof password !== "string" ||
      password.trim() === "" ||
      typeof new_password !== "string" ||
      new_password.trim() === "" ||
      typeof confirm_new_password !== "string" ||
      confirm_new_password.trim() === ""
    ) {
      return next(createError(400, "欄位未填寫正確"));
    }

    const passwordData = password.trim();
    const new_passwordData = new_password.trim();
    const confirm_new_passwordData = confirm_new_password.trim();
    // 三個欄位「全部」都要通過密碼規則
    if (
      !passwordValidator(passwordData) ||
      !passwordValidator(new_passwordData) ||
      !passwordValidator(confirm_new_passwordData)
    ) {
      return next(
        createError(
          400,
          "密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字",
        ),
      );
    }
    //新舊密碼不能相同
    if (passwordData === new_passwordData) {
      return next(createError(400, "新密碼不能與舊密碼相同"));
    }
    //新密碼和驗證新密碼需相同
    if (new_passwordData !== confirm_new_passwordData) {
      return next(createError(400, "新密碼與驗證新密碼不一致"));
    }
    // 確認輸入的舊密碼是否正確
    const user = req.user;
    const isMatch = await bcrypt.compare(passwordData, user.hashed_password);
    if (!isMatch) {
      return next(createError(400, "密碼輸入錯誤"));
    }
    const newHashedPassword = await bcrypt.hash(new_passwordData, 10);
    const userRepo = appDataSource.getRepository(userSchema);
    const result = await userRepo.update(
      { id: user.id },
      {
        hashed_password: newHashedPassword,
      },
    );

    if (result.affected !== 1) {
      return next(createError(500, "修改密碼失敗"));
    }
    return res.status(200).json({
      status: "success",
      data: null,
    });
    // 成功 200，data 是 null（沒有任何資料要回）。
  } catch (error) {
    console.error(error);
    return next(createError(500, "修改密碼失敗"));
  }
};
module.exports = { signUp, login, getProfile, updateProfile, updatePassword };
