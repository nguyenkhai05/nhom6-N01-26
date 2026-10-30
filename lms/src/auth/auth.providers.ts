import { DataSource } from 'typeorm';
import { User } from '../user/user.entity.js';
import { Role } from '../role/role.entity.js';
import { Wallet } from '../commerce/entities/wallet.entity.js';
import { WalletLedger } from '../commerce/entities/wallet-ledger.entity.js';

export const authProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'WALLET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Wallet),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'WALLET_LEDGER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(WalletLedger),
    inject: ['DATA_SOURCE'],
  },
];
