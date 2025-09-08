import React, { useState, useEffect } from "react";
import { useAdminLogin, useAdminUsersAchievements } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const { isAuthenticated, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useAdminUsersAchievements({ page, filter });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterInput, setFilterInput] = useState('');

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Debounce filter input
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter(filterInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [filterInput]);

  const handleCSVExport = () => {
    if (!data) return;
    const header = ["Name", "Email", "Achievements Count", "Current Badge"];
    const rows = data.data.map((r) => [
      r.name,
      r.email,
      String(r.achievements.length),
      String(r.badges.length) || "",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => '"' + v.replace(/"/g, '""') + '"').join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_achievements.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated || role !== "admin") {
    return null;
  }

  const totalPages = data?.last_page || 1;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin - Users Achievements</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Logout
          </button>
          <input
            value={filterInput}
            onChange={e => setFilterInput(e.target.value)}
            placeholder="Filter by name/email"
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleCSVExport}
            className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-500 disabled:opacity-50"
            disabled={!data?.data.length}
          >
            Export CSV
          </button>
        </div>
      </header>
      {isLoading && <p>Loading...</p>}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-md">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-50 to-emerald-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Achievements</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Badges</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((row, idx) => (
              <React.Fragment key={row.id}>
                <tr
                  className={`border-t cursor-pointer transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50`}
                  onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.email}</td>
                  <td className="px-4 py-3 text-indigo-700 font-semibold">{row.achievements?.length ?? 0}</td>
                  <td className="px-4 py-3 text-emerald-700">{row.badges?.map(b => b.name).join(', ') || '—'}</td>
                </tr>
                {expandedId === row.id && (
                  <tr className="bg-emerald-50 transition-all duration-300">
                    <td colSpan={4} className="px-4 py-6 rounded-b-lg">
                      {/* Badges Section */}
                      {row.badges && row.badges.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold mb-2">Badges</h2>
                          <div className="flex gap-4 flex-wrap">
                            {row.badges.map(badge => (
                              <div key={badge.id} className="flex items-center gap-2 bg-white border rounded px-3 py-2 shadow-sm">
                                <img src={badge.icon} alt={badge.name} className="w-8 h-8 object-contain" />
                                <div>
                                  <div className="font-medium text-sm">{badge.name}</div>
                                  <div className="text-xs text-gray-500">Unlocked: {badge.pivot.unlocked_at ? badge.pivot.unlocked_at : '—'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Achievements Section */}
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Achievements</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {row.achievements && row.achievements.length > 0 ? (
                            row.achievements.map(a => (
                              <div key={a.id} className={`relative rounded-lg border p-4 bg-white shadow-sm overflow-hidden ${a.pivot.unlocked_at ? 'border-emerald-400' : 'border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-sm">{a.name}</h3>
                                    <p className="text-xs text-gray-500">{a.description}</p>
                                  </div>
                                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{a.points} pts</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded">
                                  <div
                                    className="h-2 bg-emerald-500 rounded"
                                    style={{ width: `${Math.min(1, a.pivot.progress / a.rules.target) * 100}%` }}
                                  />
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                                  <span>{a.pivot.progress}/{a.rules.target} progress</span>
                                  {a.pivot.unlocked_at && <span className="text-emerald-600 font-medium">Unlocked</span>}
                                </div>
                              </div>
                            ))
                          ) : <div className="text-xs text-gray-500">No achievements</div>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {(!data || data.data.length === 0) && !isLoading && (
              <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No results</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-xs">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 text-sm border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
