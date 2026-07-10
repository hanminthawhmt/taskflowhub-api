const authRoutes = require('../modules/auth/route');
const router = require('express').Router();

router.use('/auth', authRoutes);

module.exports = router;