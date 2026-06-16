import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const canContinue = identity.trim() && password.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (canContinue) {
      navigate("/user/home");
    }
  };

  return (
    <motion.main
      className="relative grid min-h-screen overflow-hidden bg-[#050505] px-5 py-8 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="absolute inset-0 login-map-grid opacity-70"
        animate={{ backgroundPosition: ["0px 0px", "32px 24px"] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.13),transparent_32%),linear-gradient(135deg,rgba(8,8,8,0.84),rgba(23,23,23,0.68)_48%,rgba(0,0,0,0.95))]" />

      <section className="relative z-10 grid min-h-[calc(100vh-4rem)] w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_440px]">
        <motion.div
          className="hidden max-w-xl pl-8 lg:block"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">NextMove</p>
          <h1 className="mt-5 text-6xl font-black leading-[0.95] tracking-normal">One Stop Solution</h1>
          <p className="mt-5 max-w-md text-base font-medium leading-7 text-white/68">
            Book faster, compare smarter, and start every trip with a cleaner sign-in experience.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md rounded-[28px] border border-white/16 bg-white/12 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.52)] backdrop-blur-2xl sm:p-8"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.52, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-8 text-sm font-semibold text-white/58 transition hover:text-white"
          >
            Back
          </button>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/58">Welcome back</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal">Get moving</h2>
          <p className="mt-3 text-sm leading-6 text-white/62">Use your email or phone number and password to continue.</p>

          <motion.label
            className="group relative mt-8 block"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.18 }}
          >
            <input
              id="identity"
              value={identity}
              onChange={(event) => setIdentity(event.target.value)}
              placeholder="Email or phone"
              autoComplete="username"
              className="w-full bg-gray-100 text-black placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </motion.label>

          <motion.label
            className="group relative mt-4 block"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.18 }}
          >
            <input
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-gray-100 text-black placeholder-gray-500 px-4 py-3 pr-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-black text-gray-700 transition hover:bg-black/5 hover:text-black"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </motion.label>

          <motion.button
            type="submit"
            whileHover={{ scale: canContinue ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            disabled={!canContinue}
            className="mt-6 h-14 w-full rounded-2xl bg-white text-base font-black text-black shadow-[0_18px_42px_rgba(255,255,255,0.16)] transition duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/34 disabled:text-white/44 disabled:shadow-none"
          >
            Continue
          </motion.button>

          <p className="mt-5 text-center text-xs font-semibold leading-5 text-white/42">
            Protected sign-in for smoother bookings and live route updates.
          </p>
        </motion.form>
      </section>
    </motion.main>
  );
}
