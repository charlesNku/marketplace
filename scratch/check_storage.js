const supabase = require('../backend/config/supabaseClient'); // Fix path

async function checkStorage() {
    try {
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) {
            console.error('Error listing buckets:', listError);
            return;
        }
        console.log('Existing Buckets:', buckets);

        const bucketName = 'products';
        const exists = buckets.some(b => b.name === bucketName);

        if (!exists) {
            console.log(`Bucket "${bucketName}" does not exist. Creating it...`);
            const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
            });
            if (createError) {
                console.error('Error creating bucket:', createError);
            } else {
                console.log(`Bucket "${bucketName}" created successfully.`);
            }
        } else {
            console.log(`Bucket "${bucketName}" already exists.`);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkStorage();
