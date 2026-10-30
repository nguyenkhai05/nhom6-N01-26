import { DataSource } from 'typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { Voucher } from './entities/voucher.entity.js';
import { Wallet } from './entities/wallet.entity.js';
import { WalletLedger } from './entities/wallet-ledger.entity.js';
import { TopupRequest } from './entities/topup-request.entity.js';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { RefundRequest } from './entities/refund-request.entity.js';
import { Course } from '../course/course.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';

export const commerceProviders = [
  {
    provide: 'CART_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VOUCHER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Voucher),
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
  {
    provide: 'TOPUP_REQUEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TopupRequest),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ORDER_ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderItem),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REFUND_REQUEST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RefundRequest),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'COURSE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Course),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ENROLLMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Enrollment),
    inject: ['DATA_SOURCE'],
  },
];
