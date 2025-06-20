function WaitingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
      <span className="mb-8 bg-gradient-to-r from-primary-light to-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
        ✨ Intervue Poll
      </span>

      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-dark border-t-transparent mb-6"></div>

      <p className="text-xl font-bold text-grayish-dark text-center">
        Wait for the teacher to ask questions..
      </p>
    </div>
  );
}

export default WaitingScreen;
