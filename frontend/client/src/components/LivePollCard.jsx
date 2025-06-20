import { MessageCircle, Eye } from 'lucide-react';

function LivePollCard({ question, results, onNextQuestion }) {
  const totalVotes = Object.values(results).reduce((acc, count) => acc + count, 0);

  return (
    <div className="h-screen flex flex-col bg-white px-4 py-8">
      {/* Top right Poll History button */}
      <div className="flex justify-end px-6 mb-4">
        <button className="flex items-center gap-2 bg-primary-light text-white px-8 py-2 rounded-full font-medium hover:bg-primary-dark transition">
          <Eye className="w-4 h-4" />
          View Poll history
        </button>
      </div>

      {/* Centered Card */}
      <div className="flex justify-center items-center flex-1">
        <div className="max-w-2xl w-full p-6 rounded-xl">
          {/* Header */}
          <h3 className="text-lg font-semibold text-grayish-dark mb-2">Question</h3>

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

          {/* Ask Next Button */}
          <div className="mt-6 text-right">
            <button
              onClick={onNextQuestion}
              className="bg-gradient-to-r from-primary-light to-primary text-white py-2 px-10 rounded-full font-semibold hover:from-primary-dark hover:to-primary transition"
            >
              + Ask a new question
            </button>
          </div>
        </div>
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

export default LivePollCard;
