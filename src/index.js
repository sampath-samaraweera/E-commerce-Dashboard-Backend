const app = require('./app');
require('dotenv').config();

const PORT=process.env.PORT

app.get('/', (req, res) => {
    res.send('This is TechStore Backend');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});