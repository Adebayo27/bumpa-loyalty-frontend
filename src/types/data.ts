export interface IPurchasePayload {
    user_id: number;
    amount: number;
    currency: string;
    payload: {
        product_id: number;
        quantity: number;
        category: number;
    };
    status: string;
}


// Types
export interface IAchievement {
    id: number;
    key: string;
    name: string;
    description: string;
    rules: {
        type: string;
        target: number;
    };
    points: number;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        user_id: number;
        achievement_id: number;
        progress: number;
        unlocked_at: string | null;
        meta: any;
        created_at: string;
        updated_at: string;
    };
}

export interface IBadge {
    id: number;
    name: string;
    criteria: {
        achievements_count: number;
    };
    rank: number;
    icon: string;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        user_id: number;
        badge_id: number;
        id: number;
        unlocked_at: string | null;
        created_at: string;
        updated_at: string;
    };
}


export interface IAdminUserRow {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    achievements: IAchievement[];
    badges: IBadge[];
}

export interface IPaginated<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
