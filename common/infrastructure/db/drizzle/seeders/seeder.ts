import 'reflect-metadata';

import {categoriesSeeder} from './seed-categories';
import {productsSeeder} from './seed-products';

async function runSeeders() {
    console.log('Starting database seeders...');
    await categoriesSeeder();
    console.log('Database seeding completed.');
    console.log('Starting database seeders...');
    await productsSeeder();
    console.log('Database seeding completed.');
}

// Execute the seeders
runSeeders().catch((error) => {
    console.error('Error during database seeding:', error);
    process.exit(1);
});
