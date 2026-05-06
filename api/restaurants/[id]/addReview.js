const supabase = require('../../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { id } = req.query;
    const { name, review, rating } = req.body;
    const { data, error } = await supabase
      .from('reviews')
      .insert({ restaurant_id: id, name, review, rating })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ status: 'success', data: { review: data } });
  }

  res.status(405).end();
};
