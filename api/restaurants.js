const supabase = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`*, reviews(rating)`)
      .order('id');
    if (error) return res.status(500).json({ error: error.message });
    const restaurants = data.map(r => ({
      ...r,
      count: r.reviews?.length || 0,
      average_rating: r.reviews?.length
        ? Math.round((r.reviews.reduce((a, b) => a + b.rating, 0) / r.reviews.length) * 10) / 10
        : null,
    }));
    return res.json({ status: 'success', results: restaurants.length, data: { restaurants } });
  }

  if (req.method === 'POST') {
    const { name, location, price_range } = req.body;
    const { data, error } = await supabase
      .from('restaurants')
      .insert({ name, location, price_range })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ status: 'success', data: { restaurant: data } });
  }

  res.status(405).end();
};
