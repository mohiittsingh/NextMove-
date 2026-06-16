import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";

export default function Contact() {
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
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d99a00]">Contact Us</p>
          <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-5xl">We are here to help</h1>
          <div className="mt-7 rounded-3xl bg-white p-6 text-left shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <p className="text-base font-bold text-black/70">Email: support@nextmove.example</p>
            <p className="mt-3 text-base font-bold text-black/70">Phone: +91 00000 00000</p>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
}
