export default function CompatibilityCard({
  score
}) {

  let color = "bg-red-500";

  if (score >= 80) {
    color = "bg-green-500";
  } else if (score >= 50) {
    color = "bg-yellow-500";
  }

  return (
    <div className="bg-white/20 p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">

      <h3 className="text-xl font-bold mb-3">
        Roommate Compatibility
      </h3>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">

        <div
          className={`${color} h-4 rounded-full transition-all`}
          style={{
            width: `${score}%`
          }}
        />

      </div>

      <p className="font-semibold text-lg">
        {score}% Match
      </p>

    </div>
  );
}