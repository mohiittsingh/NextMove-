import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

const formItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.14 + index * 0.08,
      duration: 0.38,
      ease: "easeOut",
    },
  }),
};

export default function AdminAuth() {
  const navigate = useNavigate();
  const login = useAdminStore((state) => state.login);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const canLogin = adminId.trim() && password.trim();

  const handleLogin = (event) => {
    event.preventDefault();

    if (!canLogin) {
      setError("Enter both Admin ID and password to continue.");
      return;
    }

    setError("");
    login({ adminId: adminId.trim() });
    navigate("/admin/dashboard");
  };

  return (
    <motion.main
      className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#020617] px-5 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-cyan-400/12 blur-3xl"
        animate={{ x: [0, 36, 0], y: [0, 22, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-8rem] right-[-5rem] h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl"
        animate={{ x: [0, -28, 0], y: [0, -18, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/8 blur-3xl"
        animate={{ opacity: [0.45, 0.7, 0.45], scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg sm:p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-x-10 top-[-2.5rem] h-24 rounded-full bg-yellow-400/18 blur-3xl" />

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="relative text-sm font-bold text-white/56 transition hover:text-white"
        >
          Back
        </button>

        <div className="relative mt-7">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-300">Admin Access</p>
          <h1 className="mt-3 text-4xl font-black">Admin Panel</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/68">
            Manage routes, analytics, and system performance.
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <motion.div variants={formItemVariants} initial="hidden" animate="visible" custom={0}>
            <input
              value={adminId}
              onChange={(event) => {
                setAdminId(event.target.value);
                if (error) setError("");
              }}
              placeholder="Admin ID"
              className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </motion.div>
          <motion.div variants={formItemVariants} initial="hidden" animate="visible" custom={1}>
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError("");
              }}
              type="password"
              placeholder="Password"
              className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </motion.div>
        </div>

        {error && (
          <motion.p
            className="mt-4 text-sm font-semibold text-red-300"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 h-13 w-full rounded-lg bg-yellow-400 text-base font-semibold text-black transition hover:bg-yellow-300"
        >
          Login
        </motion.button>
      </motion.form>
    </motion.main>
  );
}
