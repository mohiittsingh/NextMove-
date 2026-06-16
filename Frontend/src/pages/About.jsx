import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";

export default function About() {
  return (
    <motion.main
      className="min-h-screen bg-[#f7f7f5] text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-4xl place-items-center px-5 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d99a00]">About Us</p>
          <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-5xl">About NextMove</h1>
          <p className="mt-5 text-lg font-semibold leading-8 text-black/62">
            NextMove is a smart transport solution designed to simplify urban mobility.
          </p>
        </motion.div>
      </section>
    </motion.main>
  );
}
