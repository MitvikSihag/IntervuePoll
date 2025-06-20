import { MessageCircle } from 'lucide-react';


function QuestionCard({ question, selectedOption, setSelectedOption, timer, submitAnswer }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-2xl w-full p-6 rounded-xl">

        <div className="flex justify-start items-center mb-4">
          <h3 className="text-lg font-semibold text-grayish-dark mr-6">Question 1</h3>
          <div className="flex items-center gap-2">
            <span className="text-grayish-dark text-sm">⏱</span>
            <span className="text-red-600 font-semibold text-sm">
                {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-grayish-dark to-grayish p-3 rounded-t-lg text-white font-semibold">
          {question.question}
        </div>

        <div className="border border-primary-light pt-4 pb-2">
          {question.options.map((opt, index) => {
            const isSelected = selectedOption === opt;

            return (
                <label
                    key={opt}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-lg ml-4 mr-8 my-3 cursor-pointer transition
                        ${isSelected ? 'border-primary-dark bg-primary-light/10' : 'border-gray-200 bg-grayish-light hover:border-primary-light'}
                    `}
                >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                  ${isSelected ? 'bg-primary-dark text-white' : 'bg-gray-400 text-white'}
                `}>
                  {index + 1}
                </div>
                <input
                  type="radio"
                  name="poll"
                  value={opt}
                  checked={isSelected}
                  onChange={() => setSelectedOption(opt)}
                  className="hidden"
                />
                <span className="text-grayish-dark font-medium">{opt}</span>
              </label>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={submitAnswer}
            disabled={!selectedOption}
            className="w-[200px] bg-gradient-to-r from-primary-light to-primary text-white py-2.5 rounded-full font-semibold hover:from-primary-dark hover:to-primary transition disabled:opacity-75 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
        <button
        className="fixed bottom-10 right-8 p-3 bg-primary-light text-white rounded-full shadow-lg hover:bg-primary transition disabled:opacity-75 cursor-pointer"
        aria-label="Open Chat"
        >
        <MessageCircle className="w-8 h-8" />
        </button>
    </div>
  );
}

export default QuestionCard;
