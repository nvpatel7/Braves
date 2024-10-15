export interface Batter {
    id: number;
    name: string;
    error?: string;
}

export interface Pitcher {
    id: number;
    name: string;
    error?: string;
}

export interface BattedBall {
    batter_name: string;
    pitcher_name: string;
    game_date: string;
    launch_angle: number;
    exit_speed: number;
    exit_direction: number;
    hit_distance: number;
    hang_time: number;
    hit_spin_rate: number;
    play_outcome: string;
    video_link: string;
    error?: string;
}