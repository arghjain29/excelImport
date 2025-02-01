import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div className="App min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 to-purple-800 text-white">
      {/* Title with Neon Glow Effect */}
      <h1 className="text-4xl font-extrabold mb-8 text-white drop-shadow-lg text-center sm:text-5xl md:text-6xl">
        Excel Data Importer
      </h1>

      {/* Glassmorphic Upload Container */}
      <div className="bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 rounded-xl p-6 w-full max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-4xl">
        <FileUpload />
      </div>

      {/* Toast Notifications with Stylish Theme */}
      <ToastContainer theme="dark" autoClose={5000} position="top-right" />
    </div>
  );
}

export default App;


