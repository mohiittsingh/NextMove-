import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminStore } from "../store/useAdminStore";
import { getRouteHealth } from "../utils/adminMock";

const chartAxisStyle = { fill: "#94a3b8", fontSize: 12 };
const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#fff",
};
const activityColors = ["#38bdf8", "#f59e0b"];
const donutColors = ["#34d399", "#f97316"];

export default function RouteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const adminInfo = useAdminStore((state) => state.adminInfo);
  const routes = useAdminStore((state) => state.routes);
  const selectedRoute = useAdminStore((state) => state.selectedRoute);
  const aiSummary = useAdminStore((state) => state.aiSummary);
  const isLoadingInsight = useAdminStore((state) => state.isLoadingInsight);
  const selectRoute = useAdminStore((state) => state.selectRoute);
  const generateInsight = useAdminStore((state) => state.generateInsight);

  useEffect(() => {
    if (!adminInfo) {
      navigate("/admin/auth", { replace: true });
      return;
    }

    if (!selectedRoute || selectedRoute.id !== id) {
      selectRoute(id);
    }
  }, [adminInfo, id, navigate, selectRoute, selectedRoute]);

  const route = selectedRoute || routes.find((item) => item.id === id);

  if (!adminInfo) {
    return null;
  }

  if (!route) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0f172a] px-5 text-white">
        <div className="rounded-2xl bg-[#172033] px-5 py-4 text-sm font-bold">Route not found.</div>
      </main>
    );
  }

  const health = getRouteHealth(route.delay);
  const peakCrowdStop = route.insights?.peakCrowdStop;
  const highestDropStop = route.insights?.highestDropStop;
  const peakDelayPoint = route.insights?.peakDelayPoint;
  const averageDelay = route.insights?.averageDelay ?? route.delay;
  const passengerFlowData = [
    { name: "Boarding", value: route.insights?.totalBoarding || 0 },
    { name: "Drop", value: route.insights?.totalDrop || 0 },
  ];
  const stopActivityData = route.routeData?.stops || [];
  const peakCrowdValue = Math.max(...stopActivityData.map((stop) => stop.crowd));
  const textInsights = [
    peakCrowdStop ? `${peakCrowdStop.name} has highest crowd congestion with ${peakCrowdStop.crowd} boardings.` : null,
    highestDropStop ? `${highestDropStop.name} has the highest drop-off volume with ${highestDropStop.drop} passengers.` : null,
    peakDelayPoint ? `Peak delays occur at ${peakDelayPoint.time}, reaching ${peakDelayPoint.delay} minutes.` : null,
  ].filter(Boolean);

  return (
    <motion.main
      className="min-h-screen bg-[#0f172a] px-5 py-8 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[28px] border border-white/8 bg-[#172033] px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.26)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="text-sm font-bold text-white/58 transition hover:text-white"
            >
              Back to routes
            </button>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-emerald-400">Route Details</p>
            <h1 className="mt-2 text-3xl font-black">{route.name}</h1>
            <p className="mt-2 text-sm font-semibold text-white/58">{route.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#0f172a] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Status</p>
              <p className="mt-2 text-sm font-black" style={{ color: health.color }}>
                {health.label}
              </p>
            </div>
            <div className="rounded-2xl bg-[#0f172a] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Trips</p>
              <p className="mt-2 text-sm font-black">{route.completedTrips}</p>
            </div>
            <div className="rounded-2xl bg-[#0f172a] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">On Time</p>
              <p className="mt-2 text-sm font-black">{route.onTimeRate}%</p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Max Crowd Stop</p>
            <h2 className="mt-2 text-xl font-black">Peak Crowd</h2>
            <p className="mt-3 text-sm font-semibold text-white/74">
              {peakCrowdStop ? `${peakCrowdStop.name} (${peakCrowdStop.crowd})` : "No data"}
            </p>
          </section>

          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Max Drop Stop</p>
            <h2 className="mt-2 text-xl font-black">Highest Drop</h2>
            <p className="mt-3 text-sm font-semibold text-white/74">{highestDropStop?.name || "No data"}</p>
          </section>

          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Average Delay</p>
            <h2 className="mt-2 text-xl font-black">Avg Delay</h2>
            <p className="mt-3 text-sm font-semibold text-white/74">{averageDelay.toFixed(1)} min</p>
          </section>

          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Route Health</p>
            <h2 className="mt-2 text-xl font-black">Current State</h2>
            <p className="mt-3 text-sm font-black" style={{ color: health.color }}>
              {health.label}
            </p>
          </section>
        </div>

        <div className="mt-7 grid gap-4 xl:grid-cols-2">
          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Delay Trend</p>
                <h2 className="mt-2 text-2xl font-black">Route delay over time</h2>
              </div>
              <div className="rounded-xl bg-[#0f172a] px-3 py-2 text-sm font-black">{averageDelay.toFixed(1)} min avg</div>
            </div>
            <div className="mt-5 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={route.delayTrend}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="delay" stroke={health.color} strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Crowd Per Stop</p>
            <h2 className="mt-2 text-2xl font-black">Stop crowd demand</h2>
            <div className="mt-5 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stopActivityData}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="crowd" radius={[8, 8, 0, 0]}>
                    {stopActivityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.crowd === peakCrowdValue ? "#f59e0b" : "#38bdf8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-7 grid gap-4 xl:grid-cols-2">
          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Passenger Flow</p>
            <h2 className="mt-2 text-2xl font-black">Boarding vs drop</h2>
            <div className="mt-5 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passengerFlowData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {passengerFlowData.map((entry, index) => (
                      <Cell key={entry.name} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Stop Activity</p>
            <h2 className="mt-2 text-2xl font-black">Boarding and drop per stop</h2>
            <div className="mt-5 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stopActivityData}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="crowd" fill={activityColors[0]} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="drop" fill={activityColors[1]} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="mt-7 rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Insight Panel</p>
          <h2 className="mt-2 text-2xl font-black">Operational observations</h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {textInsights.map((insight) => (
              <div key={insight} className="rounded-2xl bg-[#0f172a] p-4 text-sm font-semibold leading-6 text-white/72">
                {insight}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 rounded-[24px] border border-white/8 bg-[#172033] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">AI Insight</p>
              <h2 className="mt-2 text-2xl font-black">Operational summary</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/58">
                Generate a mock insight for route performance, crowd pressure, and immediate operations response.
              </p>
            </div>
            <button
              type="button"
              onClick={generateInsight}
              disabled={isLoadingInsight}
              className="h-12 rounded-xl bg-emerald-500 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/30"
            >
              {isLoadingInsight ? "Generating..." : "Generate AI Insight"}
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-[#0f172a] p-4">
            {isLoadingInsight ? (
              <div className="flex items-center gap-3 text-sm font-semibold text-white/60">
                <span className="admin-spinner" />
                Generating route insight...
              </div>
            ) : aiSummary ? (
              <div>
                <p className="text-sm font-black text-amber-300">AI Insight</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/72">{aiSummary}</p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-white/48">No insight generated yet.</p>
            )}
          </div>

          <div className="mt-5 rounded-2xl bg-white/4 px-4 py-3 text-sm font-semibold text-white/52">
            TODO: Replace `aiService` with a backend API, add Gemini integration in Node.js, and wire real authentication.
          </div>
        </section>
      </section>
    </motion.main>
  );
}
