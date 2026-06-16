import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "user";
  const [isCreating, setIsCreating] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = username.trim() && password.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (canSubmit) {
      navigate("/user/home");
    }
  };

  return (
    <motion.main
      className="relative grid min-h-screen overflow-hidden bg-[#080808] px-5 py-10 text-white lg:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,193,7,0.26),transparent_28%),linear-gradient(135deg,#050505,#171717_52%,#fff7dd_52%,#ffffff)]" />

      <motion.section
        className="relative z-10 hidden items-center px-10 lg:flex"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="max-w-lg">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#FFC107]">NextMove Auth</p>
          <h1 className="mt-5 text-6xl font-black leading-[0.98] tracking-normal">Move through the city faster.</h1>
          <p className="mt-5 text-base font-semibold leading-7 text-white/62">
            Sign in as {role} and continue into the mock urban mobility workspace.
          </p>
        </div>
      </motion.section>

      <section className="relative z-10 grid place-items-center lg:place-items-center">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-[30px] border border-white/18 bg-white/16 p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-8"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-white/58 transition hover:text-white"
          >
            Back
          </button>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.16em] text-[#FFC107]">
            {role} access
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-normal">{isCreating ? "Create account" : "Login"}</h2>

          <label className="relative mt-8 block">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Name / Username"
              className="w-full bg-gray-100 text-black placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <label className="relative mt-4 block">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-gray-100 text-black placeholder-gray-500 px-4 py-3 pr-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700 transition hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>

          <motion.button
            type="submit"
            disabled={!canSubmit}
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 h-14 w-full rounded-2xl bg-[#FFC107] text-base font-black text-black shadow-[0_18px_42px_rgba(255,193,7,0.22)] transition hover:bg-[#f4b400] disabled:cursor-not-allowed disabled:bg-white/24 disabled:text-white/42 disabled:shadow-none"
          >
            Continue
          </motion.button>

          <p className="text-sm text-gray-700 mt-3 text-center">
            {isCreating ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => setIsCreating((value) => !value)}
              className="text-yellow-500 font-semibold cursor-pointer ml-1"
            >
              {isCreating ? "Login" : "Create one"}
            </button>
          </p>
        </motion.form>
      </section>
    </motion.main>
  );
}
