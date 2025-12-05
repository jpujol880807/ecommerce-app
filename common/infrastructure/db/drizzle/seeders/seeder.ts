import 'reflect-metadata';

import {categoriesSeeder} from './seed-categories';
import {productsSeeder} from './seed-products';
import {categoryImagesSeeder} from './seed-category-images';

async function runSeeders() {
    console.log('Starting database seeders...');
    // await categoriesSeeder();
    // await productsSeeder();
    await categoryImagesSeeder();
    console.log('Database seeding completed.');
}

// Execute the seeders
runSeeders().catch((error) => {
    console.error('Error during database seeding:', error);
    process.exit(1);
});
