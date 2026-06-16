import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { getRouteHealth } from "../utils/adminMock";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminInfo = useAdminStore((state) => state.adminInfo);
  const routes = useAdminStore((state) => state.routes);
  const selectRoute = useAdminStore((state) => state.selectRoute);
  const logout = useAdminStore((state) => state.logout);

  useEffect(() => {
    if (!adminInfo) {
      navigate("/admin/auth", { replace: true });
    }
  }, [adminInfo, navigate]);

  if (!adminInfo) {
    return null;
  }

  return (
    <motion.main
      className="min-h-screen bg-[#0f172a] px-5 py-8 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/8 bg-[#172033] px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.26)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-400">NextMove Admin</p>
            <h1 className="mt-2 text-3xl font-black">Routes Overview</h1>
            <p className="mt-2 text-sm font-semibold text-white/60">Monitor every route and open analytics where attention is needed.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#0f172a] px-4 py-3 text-right">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Admin</p>
              <p className="mt-1 text-sm font-black">{adminInfo.adminId}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/admin/auth");
              }}
              className="rounded-xl bg-white/8 px-4 py-3 text-sm font-black text-white transition hover:bg-white/12"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route, index) => {
            const health = getRouteHealth(route.delay);

            return (
              <motion.button
                key={route.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  selectRoute(route.id);
                  navigate(`/admin/route/${route.id}`);
                }}
                className="rounded-[24px] border border-white/8 bg-[#172033] p-5 text-left shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:border-white/14"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Route</p>
                    <h2 className="mt-2 text-2xl font-black">{route.name}</h2>
                    <p className="mt-2 text-sm font-semibold text-white/58">{route.label}</p>
                  </div>
                  <span
                    className="mt-1 inline-flex h-3.5 w-3.5 flex-none rounded-full"
                    style={{ backgroundColor: health.color }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#0f172a] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/42">Status</p>
                    <p className="mt-2 text-sm font-black" style={{ color: health.color }}>
                      {health.label}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0f172a] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/42">Delay</p>
                    <p className="mt-2 text-sm font-black">{route.delay} min</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </motion.main>
  );
}
