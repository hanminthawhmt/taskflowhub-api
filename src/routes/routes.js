const authRoutes = require('../modules/auth/route');
const projectRoutes = require('../modules/project/route');
const router = require('express').Router();

router.use('/auth', authRoutes);
router.use('/companies', projectRoutes);

module.exports = router;