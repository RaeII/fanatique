import { getErrorMessage } from '@/helpers/response_collection';
import UserDatabase from '@/database/User.database';
import { assertUsernameCharacters } from '@/helpers/util';
import { UserAccount, UserAccountBasicInfo, UserAccountForFront, UserAccountInsert, UserAccountUpdatePayload, UserAccountUpdate } from '../types';

class UserService {
	private database: UserDatabase;

	constructor() {
		this.database = new UserDatabase();
	}

	async create(data: UserAccountInsert): Promise<number> {
		if (!data.wallet_address) throw Error(getErrorMessage('missingField', 'Endereço da carteira'));
		

		const insertData: UserAccountInsert = {
			wallet_address: data.wallet_address
		};

		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async fetch(id: number): Promise<UserAccount | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id de usuario'));

		return await this.database.fetch(id);
	}

	async fetchAll(): Promise<Array<UserAccountBasicInfo>> {
		return await this.database.fetchAll();
	}

	async fetchForFront(id: number): Promise<UserAccountForFront | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id de usuario'));

		return await this.database.fetchForFront(id);
	}

	async fetchByWalletAddress(wallet_address: string): Promise<UserAccountBasicInfo | null> {
		if (!wallet_address) throw Error(getErrorMessage('missingField', 'Endereço da carteira'));

		return await this.database.fetchByWalletAddress(wallet_address);
	}

	async update(data: UserAccountUpdatePayload, id: number) {
		const toUpdate: UserAccountUpdate = {};
		
		if (data?.wallet_address) {
			const userByWallet = await this.database.fetchByWalletAddress(data.wallet_address);

			if (userByWallet) throw Error(getErrorMessage('userAlreadyExist'));
			toUpdate.wallet_address = data.wallet_address;
		}

		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.update(toUpdate, id);
	}

	async remove(id: number): Promise<void> {
		await this.database.delete(id);
	}
}

export default UserService;
