/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { UserAccount, UserAccountBasicInfo, UserAccountForFront, UserAccountInsert } from '../types';

class UserDatabase extends Database {

	async create(data: UserAccountInsert) {
		const mysqlBind = createBindParams(data);

		return await this.query(`INSERT INTO user SET ${mysqlBind};`, Object.values(data));
	}

	async fetchForFront(id: number): Promise<UserAccountForFront | null> {
		const rows: any = await this.query(`
			SELECT
				id,
				wallet_address,
				register_date
			FROM user
			WHERE id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccountForFront : null;
	}

	async fetch(id: number): Promise<UserAccount | null> {
		const rows: any = await this.query('SELECT * FROM user WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccount : null;
	}

	async fetchAll(): Promise<Array<UserAccountBasicInfo>> {
		const rows: any = await this.query('SELECT id, wallet_address FROM user;', []);

		return rows[0];
	}


	async fetchByWalletAddress(wallet_address: string): Promise<UserAccountBasicInfo | null> {
		const rows: any = await this.query('SELECT id, wallet_address FROM user WHERE wallet_address = ?;', [wallet_address]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccountBasicInfo : null;
	}


	async update(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE user SET ${mysqlBind}, update_date = now() WHERE id = ?;`, [...Object.values(data), id]);
	}

	async delete(id: number) {
		return await this.query('DELETE FROM user WHERE id = ?;', [id]);
	}
}

export default UserDatabase;
