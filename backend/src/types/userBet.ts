export interface BettingUser {
	id: number;
	user_id: number;
	match_id: number;
	bet_amount: number;
	potential_payout: number;
	total_odds: number;
	bet_type: 'single' | 'multiple';
	status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	result_payout: number;
	placed_at: Date;
	settled_at: Date | null;
	transaction_hash: string | null;
	notes: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface BettingUserDetail {
	id: number;
	bet_id: number;
	option_id: number;
	odd_value: number;
	is_winner: boolean | null;
	created_at: Date;
}

export interface BettingUserHistory {
	id: number;
	bet_id: number;
	old_status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded' | null;
	new_status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	changed_by: number | null;
	reason: string | null;
	created_at: Date;
}

export interface BettingUserInsert {
	user_id: number;
	match_id: number;
	bet_amount: number;
	potential_payout: number;
	total_odds: number;
	bet_type: 'single' | 'multiple';
	status?: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	transaction_hash?: string;
	notes?: string;
	details: BettingUserDetailInsert[];
}

export interface BettingUserDetailInsert {
	option_id: number;
	odd_value: number;
}

export interface BettingUserUpdate {
	status?: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	result_payout?: number;
	settled_at?: Date;
	transaction_hash?: string;
	notes?: string;
}

export interface BettingUserForFront {
	id: number;
	user_id: number;
	match_id: number;
	bet_amount: number;
	potential_payout: number;
	total_odds: number;
	bet_type: 'single' | 'multiple';
	status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	result_payout: number;
	placed_at: Date;
	settled_at: Date | null;
	transaction_hash: string | null;
	notes: string | null;
	match: {
		id: number;
		home_club_name: string;
		away_club_name: string;
		match_date: Date;
		stadium_name: string;
	} | null;
	details: BettingUserDetailForFront[];
}

export interface BettingUserDetailForFront {
	id: number;
	option_id: number;
	odd_value: number;
	is_winner: boolean | null;
	option: {
		id: number;
		option_key: string;
		label: string;
		market_name: string;
	} | null;
}

export interface BettingUserBasicInfo {
	id: number;
	user_id: number;
	match_id: number;
	bet_amount: number;
	potential_payout: number;
	total_odds: number;
	bet_type: 'single' | 'multiple';
	status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	placed_at: Date;
}

export interface BettingUserHistoryInsert {
	bet_id: number;
	old_status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded' | null;
	new_status: 'pending' | 'won' | 'lost' | 'cancelled' | 'refunded';
	changed_by?: number;
	reason?: string;
}

export interface UserBetStats {
	total_bets: number;
	total_amount: number;
	total_winnings: number;
	pending_bets: number;
	won_bets: number;
	lost_bets: number;
	win_rate: number;
} 