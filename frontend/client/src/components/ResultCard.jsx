import { MessageCircle } from 'lucide-react';

function ResultCard({ question, results }) {
  const totalVotes = Object.values(results).reduce((acc, count) => acc + count, 0);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full p-6 rounded-xl">

        {/* Header */}
        <div className="flex justify-start items-center mb-4">
          <h3 className="text-lg font-semibold text-grayish-dark mr-6">Question 1</h3>
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

            // Determine styles based on bar coverage
            const circleInside = barPercent >= 10;
            const textInside = barPercent >= 50;
            const percentInside = barPercent >= 90;

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
                    ${circleInside ? 'bg-white text-primary-dark' : 'bg-gray-400 text-white'}
                  `}>
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

        {/* Footer Message */}
        <p className="mt-6 text-center text-grayish-dark font-semibold">
          Wait for the teacher to ask a new question..
        </p>
      </div>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-10 right-8 p-3 bg-primary-light text-white rounded-full shadow-lg hover:bg-primary transition disabled:opacity-75 cursor-pointer"
        aria-label="Open Chat"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
}

export default ResultCard;
