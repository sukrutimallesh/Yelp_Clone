const supabase = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  if (req.method === 'GET') {
    const [{ data: restaurant }, { data: reviews }] = await Promise.all([
      supabase.from('restaurants').select(`*, reviews(rating)`).eq('id', id).single(),
      supabase.from('reviews').select('*').eq('restaurant_id', id),
    ]);
    const r = restaurant;
    const enriched = {
      ...r,
      count: r?.reviews?.length || 0,
      average_rating: r?.reviews?.length
        ? Math.round((r.reviews.reduce((a, b) => a + b.rating, 0) / r.reviews.length) * 10) / 10
        : null,
    };
    return res.json({ status: 'success', data: { restaurant: enriched, reviews: reviews || [] } });
  }

  if (req.method === 'PUT') {
    const { name, location, price_range } = req.body;
    const { data, error } = await supabase
      .from('restaurants')
      .update({ name, location, price_range })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: 'success', data: { restaurant: data } });
  }

  if (req.method === 'DELETE') {
    await supabase.from('restaurants').delete().eq('id', id);
    return res.status(204).end();
  }

  res.status(405).end();
};
