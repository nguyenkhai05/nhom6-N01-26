import { DataSource } from 'typeorm';
import { Category } from './category.entity.js';

export const categoryProviders = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: ['DATABASE_CONNECTION'],
  },
];