function PollResultCard({ question, results }) {
  const totalVotes = Object.values(results).reduce((acc, count) => acc + count, 0);

  if (!question || !question.options) return null; // Prevents render crash

  return (
    <div className="flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full p-6 rounded-xl">
        {/* Header */}
        <div className="flex justify-start items-center mb-4">
          <h3 className="text-lg font-semibold text-grayish-dark mr-6">Question</h3>
          <div className="flex items-center gap-2">
            <span className="text-grayish-dark text-sm">⏱</span>
            <span className="text-red-600 font-semibold text-sm">00:00</span>
          </div>
        </div>

        {/* Question Title */}
        <div className="bg-gradient-to-r from-grayish-dark to-grayish p-3 rounded-t-lg text-white font-semibold">
          {question.question}
        </div>

        {/* Results */}
        <div className="border border-primary-light pt-4 pb-2">
          {question.options.map((opt, index) => {
            const voteCount = results[opt] || 0;
            const percentage = totalVotes ? ((voteCount / totalVotes) * 100).toFixed(0) : 0;
            const barPercent = parseInt(percentage);

            const circleInside = barPercent >= 10;
            const textInside = barPercent >= 50;
            const percentInside = barPercent >= 85;

            return (
              <div
                key={opt}
                className="relative ml-4 mr-8 my-3 bg-grayish-light border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Result bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-primary-light transition-all"
                  style={{ width: `${barPercent}%` }}
                ></div>

                {/* Content overlay */}
                <div className="relative flex items-center gap-3 px-4 py-3 z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition
                    ${circleInside ? 'bg-white text-primary-dark' : 'bg-gray-400 text-white'}`}
                  >
                    {index + 1}
                  </div>
                  <span className={`font-medium flex-1 transition 
                    ${textInside ? 'text-white' : 'text-grayish-dark'}`}>
                    {opt}
                  </span>
                  <span className={`text-sm font-semibold transition 
                    ${percentInside ? 'text-white' : 'text-grayish-dark'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PollResultCard;
