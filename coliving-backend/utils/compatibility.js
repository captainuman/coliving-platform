const calculateCompatibility = (
  currentUser,
  roommate
) => {
  const fields = [
    "smoking",
    "sleep",
    "cleanliness",
    "food"
  ];

  let score = 0;
  const pointsPerField = 100 / fields.length;

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  fields.forEach((field) => {
    if (
      normalize(currentUser?.[field]) ===
      normalize(roommate?.[field])
    ) {
      score += pointsPerField;
    }
  });

  return Math.round(score);
};

module.exports = calculateCompatibility;