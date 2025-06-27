export interface BettingMarket {
	id: number;
	name: string;
	type: 'single' | 'over_under' | 'multiple_over_under';
	description?: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface BettingOption {
	id: number;
	market_id: number;
	option_key: string;
	label: string;
	description?: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface BettingMarketInsert {
	name: string;
	type: 'single' | 'over_under' | 'multiple_over_under';
	description?: string;
	is_active?: boolean;
}

export interface BettingOptionInsert {
	market_id: number;
	option_key: string;
	label: string;
	description?: string;
	is_active?: boolean;
}

export interface BettingMarketUpdate {
	name?: string;
	type?: 'single' | 'over_under' | 'multiple_over_under';
	description?: string;
	is_active?: boolean;
}

export interface BettingOptionUpdate {
	option_key?: string;
	label?: string;
	description?: string;
	is_active?: boolean;
}

export interface BettingMarketForFront {
	id: number;
	name: string;
	type: 'single' | 'over_under' | 'multiple_over_under';
	description?: string;
	is_active: boolean;
	options: BettingOptionForFront[];
}

export interface BettingOptionForFront {
	id: number;
	option_key: string;
	label: string;
	description?: string;
	is_active: boolean;
}

export interface BettingMarketBasicInfo {
	id: number;
	name: string;
	type: 'single' | 'over_under' | 'multiple_over_under';
	is_active: boolean;
} 