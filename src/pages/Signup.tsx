import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

const Signup: React.FC<SignupProps> = ({ setUserEmail }) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim()) {
      setUserEmail(email);
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      alert("Please enter a valid email.");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white z-10 relative">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Sign Up</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter any email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>

 {/* Right: Image - Acts as Background in Mobile */}
 <div className="md:w-1/2 h-full absolute md:relative inset-0 bg-black">
        <img
          src="/background-pattern.png"
          alt="Company Background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Signup;
