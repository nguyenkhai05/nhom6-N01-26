import { Module } from '@nestjs/common';
import { BundleController } from './bundle.controller.js';
import { BundleService } from './bundle.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { DataSource } from 'typeorm';
import { Bundle } from './entities/bundle.entity.js';
import { BundleItem } from './entities/bundle-item.entity.js';
import { Course } from '../course/course.entity.js';
import { Enrollment } from '../enrollment/enrollment.entity.js';
import { Wallet } from '../commerce/entities/wallet.entity.js';
import { WalletLedger } from '../commerce/entities/wallet-ledger.entity.js';
import { Order } from '../commerce/entities/order.entity.js';

@Module({
  imports: [DatabaseModule],
  controllers: [BundleController],
  providers: [
    BundleService,
    {
      provide: 'BUNDLE_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Bundle),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BUNDLE_ITEM_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(BundleItem),
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
      provide: 'ORDER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [BundleService],
})
export class BundleModule {}
