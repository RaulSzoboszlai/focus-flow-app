import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            FocusFlow
          </span>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            className={({
              isActive,
            }) => `flex items-center gap-3 px-3 py-2.5 font-medium text-sm rounded-xl transition-colors
            ${isActive ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
              />
            </svg>
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({
              isActive,
            }) => `flex items-center gap-3 px-3 py-2.5 font-medium text-sm rounded-xl transition-colors
            ${isActive ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
              />
            </svg>
            Tasks
          </NavLink>
        </nav>
      </div>

      <div className="relative">
        <div className="mb-4 p-4 bg-indigo-50/60 rounded-xl border border-indigo-100/50">
          <p className="text-xs text-indigo-700 font-medium leading-relaxed">
            ✨ You've got this! Small steps lead to big results.
          </p>
        </div>

        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition border border-transparent hover:border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
              {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-slate-800 truncate">
                {user?.displayName}
              </h4>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {showProfileMenu && (
          <div className="absolute bottom-16 left-0 w-full bg-white border border-slate-100 rounded-xl shadow-lg p-2 z-50">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition text-left cursor-pointer"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
