import React from "react";
import { useUserAchievements, useSimulatePurchase } from "../api/client";
import AchievementCard from "../components/AchievementCard";
import { useQueryClient } from "@tanstack/react-query";
import { useAchievementsSubscription } from "../hooks/useAchievementsSubscription";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const qc = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const { data, isLoading, error } = useUserAchievements(userId || "");
  useAchievementsSubscription(userId || "", qc);
  const simulatePurchase = useSimulatePurchase();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const purchasePayload = {
    user_id: userId || 1,
    amount: Math.floor(Math.random() * 10000) + 1000,
    currency: "NGN",
    payload: {
      product_id: Math.floor(Math.random() * 100) + 1,
      quantity: Math.floor(Math.random() * 5) + 1,
      category: Math.floor(Math.random() * 10) + 1,
    },
    status: "completed",
  };
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Customer Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Logout
          </button>
          <button
            onClick={() =>
              simulatePurchase.mutate(purchasePayload)
            }
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-50"
            disabled={simulatePurchase.isPending}
          >
            {simulatePurchase.isPending ? "Processing..." : "Simulate Purchase"}
          </button>
        </div>
      </header>
      {isLoading && <p>Loading achievements...</p>}
      {error && (
        <p className="text-red-600 text-sm">Failed to load achievements.</p>
      )}
      {/* Badges Section */}
      {data?.badges && data.badges.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Badges</h2>
          <div className="flex gap-4 flex-wrap">
            {data.badges.map(badge => (
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
      {/* Empty State */}
      {data && (!data.achievements?.length && !data.badges?.length) && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">🎉</div>
          <div className="text-lg font-semibold mb-2">No achievements or badges yet</div>
          <div className="text-sm text-gray-500">Start making purchases and completing actions to unlock achievements and earn badges!</div>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {data?.achievements?.map((a) => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
