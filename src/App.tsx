function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F6F4F1]">
      <div className="text-center max-w-3xl mx-auto px-6 py-8">
        
        <h1 className="text-black font-bold mb-6 text-4xl sm:text-5xl">
          Math Test for Kids
        </h1>

        <p className="text-black text-lg mb-8">
          Welcome! This is a fun math test for kids.  
          Try to solve the questions and see how many answers you get right.
        </p>

        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Start Test
        </button>

      </div>
    </main>
  );
}

export default App;