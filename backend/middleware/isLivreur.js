module.exports = (req, res, next) => {
  if (req.user.role !== 'livreur') return res.status(403).json({ error: 'Livreur uniquement' });
  next();
};