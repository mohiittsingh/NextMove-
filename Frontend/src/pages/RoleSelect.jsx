import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const roles = [
  { id: "user", title: "User", text: "Plan trips and compare city transport." },
  { id: "driver", title: "Driver", text: "Manage rides and future driver tools." },
  { id: "admin", title: "Admin", text: "Access future operations controls." },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId) => {
    if (roleId === "driver") {
      navigate("/driver/auth");
      return;
    }

    if (roleId === "admin") {
      navigate("/admin/auth");
      return;
    }

    navigate(`/auth?role=${roleId}`);
  };

  return (
    <motion.main
      className="grid min-h-screen place-items-center bg-[#f7f7f5] px-5 py-10 text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="w-full max-w-4xl rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#d99a00]">Welcome to NextMove</p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">Choose your role</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-black/56">
            Select how you want to continue. This is mock auth for now.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -8, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRoleSelect(role.id)}
              className="rounded-3xl border border-black/6 bg-[#fffaf0] p-6 text-left shadow-[0_14px_34px_rgba(0,0,0,0.06)] transition hover:border-[#FFC107]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#FFC107] text-lg font-black text-black">
                {role.title.charAt(0)}
              </div>
              <h2 className="mt-5 text-2xl font-black">{role.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-black/56">{role.text}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}
