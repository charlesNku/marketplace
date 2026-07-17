// Script to add parent_message_id to messages table in Supabase Postgres
// Usage: node add_parent_message_column.js <db_password>
const { Client } = require('pg');
const dbPassword = process.argv[2];
if (!dbPassword) {
    console.log('Usage: node add_parent_message_column.js <your_supabase_db_password>');
    console.log('Find your DB password at: https://supabase.com/dashboard/project/cjobmtwtssmdcvpyxruv/settings/database');
    process.exit(1);
}

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

        const query = 'ALTER TABLE messages ADD COLUMN IF NOT EXISTS parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL;';
        console.log(`Running: ${query}`);
        await client.query(query);
        console.log('✅ Done\n');
        console.log('🎉 Column parent_message_id successfully added to messages table!');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

main();
