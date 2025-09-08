import React from "react";
import { render, screen } from "@testing-library/react";
import { AchievementCard } from "../components/AchievementCard";

const baseAchievement = {
  id: 1,
  key: "spender_1000",
  name: "Spend 1000",
  description: "Spend a total of $1000",
  rules: {
    type: "total_spend",
    target: 1000,
  },
  points: 10,
  created_at: null,
  updated_at: null,
  pivot: {
    user_id: 1,
    achievement_id: 1,
    progress: 1000,
    unlocked_at: "2025-09-08 21:27:06",
    meta: null,
    created_at: "2025-09-08T21:27:06.000000Z",
    updated_at: "2025-09-08T21:27:06.000000Z",
  },
};

describe("AchievementCard", () => {
  test("renders title and progress", () => {
    render(<AchievementCard achievement={baseAchievement} />);
    expect(screen.getByText(/Spend 1000/)).toBeInTheDocument();
    expect(screen.getByText(/1000\/1000 progress/)).toBeInTheDocument();
  });

  test("shows unlocked label when unlockedAt present", () => {
    render(
      <AchievementCard
        achievement={{
          ...baseAchievement,
          pivot: {
            ...baseAchievement.pivot,
            unlocked_at: new Date().toISOString(),
          },
        }}
      />
    );
    // Specifically target the standalone Unlocked badge span
    const spans = screen.getAllByText(/Unlocked/);
    expect(spans.some((el) => el.tagName.toLowerCase() === "span")).toBe(true);
  });
});
