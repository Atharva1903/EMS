const User = require("../models/User");

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
