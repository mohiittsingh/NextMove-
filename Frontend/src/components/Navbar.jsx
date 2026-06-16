import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Safety", to: "/safety" },
  { label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/92 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          {/* TODO: Add this image in /public/assets/ */}
          <img
            src="/assets/logo.png"
            alt="NextMove"
            className="h-10 w-10 rounded-xl object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <span className="text-xl font-black tracking-normal text-[#111111]">NextMove</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-bold transition hover:text-[#d99a00] ${
                  isActive ? "text-[#d99a00]" : "text-black/62"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="h-11 rounded-full bg-[#FFC107] px-5 text-sm font-black text-black shadow-[0_12px_28px_rgba(255,193,7,0.28)] transition hover:bg-[#f4b400]"
        >
          Sign In / Sign Up
        </motion.button>
      </nav>

      <div className="flex gap-2 overflow-x-auto px-5 pb-4 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                isActive ? "bg-black text-white" : "bg-black/5 text-black/62"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
