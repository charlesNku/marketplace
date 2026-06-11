const supabase = require('../backend/config/supabaseClient');

async function listProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log('--- Product List ---');
        data.forEach(p => {
            console.log(`ID: ${p.id} | Title: ${p.title} | Image: ${p.image}`);
        });
        console.log('--------------------');
    }
}

listProducts();
