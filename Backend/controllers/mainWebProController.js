const Auth = require("../models/Auth");

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Auth.find().select(
      "name joinedDate  adminId linkedinProfile githubProfile  profilePhoto domain.name domain.role -_id bio"
    );

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No profiles found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProfiles,
};
