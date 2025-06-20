function KickedOutPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <span className="mb-6 bg-gradient-to-r from-primary-light to-primary text-white px-3 py-1 rounded-full">
        ✨ Intervue Poll
      </span>

      <h1 className="text-3xl sm:text-4xl font-semibold text-grayish-dark mb-2">
        You’ve been <span className="text-black">Kicked out !</span>
      </h1>

      <p className="text-grayish max-w-lg">
        Looks like the teacher had removed you from the poll system. Please try again sometime.
      </p>
    </div>
  );
}

export default KickedOutPage;