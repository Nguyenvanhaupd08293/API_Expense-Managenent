const exp = require("express");
const bodyParser = require('body-parser');
const configViewEngine = require('./config/viewEngine');
const db = require('./config/dtbs');
const app = exp();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

require('dotenv').config();
const sequelize = require('./config/sql'); // Đường dẫn đúng tới tệp cấu hình sequelize

// Đồng bộ hóa mô hình với cơ sở dữ liệu
sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});
app.use(exp.json());
// Cấu hình sử dụng template Engine
configViewEngine(app);
// Sử dụng body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ 'message': 'API NodeJS Assignment' });
});
const spendingRouter = require('./router/spending');
const accountRouter = require('./router/account');
const incomeRouter = require('./router/income');
const categorySpend = require('./router/categorySpend')
const categoryIncome = require('./router/categoryIncome')
const paymentmethodRouter = require('./router/payment_method');
app.use('/', spendingRouter);
app.use('/', accountRouter);
app.use('/', incomeRouter);
app.use('/', categorySpend);
app.use('/', categoryIncome);
app.use('/', paymentmethodRouter);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});