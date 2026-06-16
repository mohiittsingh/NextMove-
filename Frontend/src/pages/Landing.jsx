import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const services = [
  {
    title: "Bus",
    text: "Compare reliable bus options for everyday city movement.",
    image: "/assets/bus.png",
  },
  {
    title: "Auto",
    text: "Find quick auto options for short urban hops.",
    image: "/assets/auto.png",
  },
  {
    title: "Train",
    text: "Plan faster cross-city routes with train-aware choices.",
    image: "/assets/train.png",
  },
  {
    title: "Book Tickets",
    text: "Coming soon",
    icon: "BT",
  },
  {
    title: "Smart Routes",
    text: "Coming soon",
    icon: "SR",
  },
  {
    title: "Live Tracking",
    text: "Coming soon",
    icon: "LT",
  },
];

const sectionMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.58, ease: "easeOut" },
};

function OptionalImage({ src, alt, className, loading = "lazy" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="grid min-h-[260px] place-items-center rounded-[32px] bg-[#fff8df] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-lg font-black text-black">Happy rides, fewer delays.</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function ServiceIcon({ service }) {
  if (service.image) {
    return (
      <img
        src={service.image}
        alt=""
        loading="lazy"
        className="h-12 w-12 object-contain"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return <span className="text-sm font-black text-black">{service.icon}</span>;
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-[#111111]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />

      <section className="relative bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
            <p className="inline-flex rounded-full bg-[#FFC107]/18 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#a87500]">
              Smart Urban Mobility
            </p>
            <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-normal text-black sm:text-6xl lg:text-7xl">
              NextMove &ndash; One Stop Solution
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-black/62">
              Compare autos, buses, and trains in one fluid ride-planning flow built for fast urban decisions.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="mt-8 h-14 rounded-full bg-black px-8 text-base font-black text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition hover:bg-[#242424]"
            >
              Get Started
            </motion.button>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 34, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.72, ease: "easeOut" }}
          >
            <div className="absolute -left-3 top-8 h-36 w-36 rounded-full bg-[#FFC107]/28 blur-3xl" />
            <img
              src="/assets/Nextmove_bus_train_auto.png"
              alt="Bus, train, and auto transport options"
              loading="eager"
              className="relative w-full rounded-[32px] bg-[#fff8df] object-cover shadow-[0_28px_80px_rgba(0,0,0,0.16)]"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </motion.div>
        </div>
      </section>

      <motion.section {...sectionMotion} className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d99a00]">Move your way</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-black">Our Services</h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-black/56">
            Pick the transport mode that fits your time, budget, and route.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              whileHover={{ y: -8, boxShadow: "0 22px 56px rgba(0,0,0,0.10)" }}
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FFC107]/22">
                <ServiceIcon service={service} />
              </div>
              <h3 className="mt-6 text-xl font-black text-black">{service.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-black/56">{service.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
            {/* TODO: Add this image in /public/assets/ */}
            <OptionalImage
              src="/assets/happy_nextmove.png"
              alt="Happy NextMove traveler"
              className="w-full rounded-[32px] bg-[#fff8df] object-cover shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d99a00]">Better everyday travel</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal text-black sm:text-5xl">
              Travel Smarter, Stress Less
            </h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-black/62">
              Skip waiting, avoid delays, and make better travel decisions with NextMove.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="mt-8 h-14 rounded-full bg-[#FFC107] px-8 text-base font-black text-black shadow-[0_18px_42px_rgba(255,193,7,0.25)] transition hover:bg-[#f4b400]"
            >
              Start Planning Your Ride
            </motion.button>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
