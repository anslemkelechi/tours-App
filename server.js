const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((con) => {
    console.log('DB Connection Successful');
  });

//*********USING AYSNC TO CONNECT DATABASE**********//
// const connect = async () => {
//   const t = mongoose.connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: true,
//   });
//   await t;
//   if (t) console.log('DB Started');
// };
// connect();

//START SERVER
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
