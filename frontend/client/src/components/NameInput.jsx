function NameInput({ inputName, setInputName, handleSubmit }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <span className="mb-6 bg-gradient-to-r from-primary-light to-primary text-white px-3 py-1 rounded-full">
        ✨ Intervue Poll
      </span>

      <h1 className="text-3xl sm:text-4xl mb-4 text-center">
        Let’s <span className="text-grayish-dark font-bold">Get Started</span>
      </h1>

      <p className="text-center text-grayish max-w-lg mb-8">
        If you’re a student, you’ll be able to <strong className="text-grayish-dark font-semibold">submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates.
      </p>

      <div className="w-full flex flex-col justify-center max-w-sm">
        <label className="block text-grayish-dark font-semibold mb-2" htmlFor="name">
          Enter your Name
        </label>
        <input
          id="name"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-grayish-light focus:outline-none focus:ring-2 focus:ring-primary-dark"
          placeholder="Your Name"
        />

        <div className="w-full flex justify-center items-center mt-4 max-w-md">
          <button
            onClick={handleSubmit}
            disabled={!inputName.trim()}
            className="mt-6 w-[234px] cursor-pointer bg-gradient-to-r from-primary-light to-primary text-white py-3 rounded-full font-semibold hover:from-primary-dark hover:to-primary transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default NameInput;
