const Property = require("../models/Property");

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      owner: req.user.id,
      isApproved: true,
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET ALL APPROVED PROPERTIES
exports.getProperties = async (req, res) => {
  try {
    const { location, gender } = req.query;

    const filter = {
      isApproved: true,
    };

    if (location) {
      filter.$or = [
        { "address.area": { $regex: location, $options: "i" } },
        { "address.district": { $regex: location, $options: "i" } },
        { "address.state": { $regex: location, $options: "i" } },
        { "address.pincode": { $regex: location, $options: "i" } },
      ];
    }

    if (gender) {
      filter.genderPreference = {
        $in: [gender, "any"],
      };
    }

    const properties = await Property.find(filter)
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
