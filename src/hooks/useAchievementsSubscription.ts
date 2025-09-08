import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { initEcho } from '../utils/initEcho';
import { IAchievement } from '../types/data';

interface EventPayload {
  achievement: IAchievement;
  total_points: number;
  current_badge: string | null;
}

declare global {
  interface Window {
    Echo?: any;
  }
}

export function useAchievementsSubscription(userId: string | undefined, queryClient: QueryClient) {
  useEffect(() => {
    if (!userId) return;
    initEcho();
    let subscribed = false;
    function subscribe() {
      if (!window.Echo) {
        setTimeout(subscribe, 500);
        return;
      }
      try {
          window.Echo.channel(`users.${userId}.achievements`)
            .listen('AchievementUnlocked', (event: any) => {
                console.log("Locked", event)
              queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] });
            });
            window.Echo.channel(`users.${userId}.badges`)
            .listen('BadgeUnlocked', (event: any) => {
                console.log("Badgeeeee", event)
                // handle badge unlock (event.badge, event.unlocked_at, etc.)
            });
        subscribed = true;
      } catch (e) {
        console.warn('Subscription failed', e);
      }
    }
    subscribe();
    return () => {
      if (subscribed && window.Echo) {
        try { window.Echo.leave(`users.${userId}.achievements`); } catch { /* noop */ }
      }
    };
  }, [userId, queryClient]);
}
