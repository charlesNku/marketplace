// Fix RLS script - connects directly to Supabase Postgres and disables RLS
// Usage: node fix_rls_pg.js <db_password>
const dbPassword = process.argv[2];
if (!dbPassword) {
    console.log('Usage: node fix_rls_pg.js <your_supabase_db_password>');
    console.log('Find your DB password at: https://supabase.com/dashboard/project/cjobmtwtssmdcvpyxruv/settings/database');
    process.exit(1);
}

const { Client } = require('pg');

// Supabase direct connection - project ref: cjobmtwtssmdcvpyxruv
const client = new Client({
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.cjobmtwtssmdcvpyxruv',
    password: dbPassword,
    ssl: { rejectUnauthorized: false }
});

async function main() {
    try {
        console.log('Connecting to Supabase Postgres...');
        await client.connect();
        console.log('Connected!\n');

        const queries = [
            'ALTER TABLE conversations DISABLE ROW LEVEL SECURITY',
            'ALTER TABLE messages DISABLE ROW LEVEL SECURITY',
            'ALTER TABLE notifications DISABLE ROW LEVEL SECURITY',
        ];

        for (const q of queries) {
            console.log(`Running: ${q}`);
            await client.query(q);
            console.log('✅ Done\n');
        }

        console.log('🎉 All RLS policies disabled! Chat should work now.');
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('password')) {
            console.log('\nDouble-check your DB password from:');
            console.log('https://supabase.com/dashboard/project/cjobmtwtssmdcvpyxruv/settings/database');
        }
    } finally {
        await client.end();
    }
}

main();
