const { PORT } = require('./config/env');
const express = require('express');
const app = express();

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
});