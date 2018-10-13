let mongoose = require('mongoose');
mongoose.connect(
    'mongodb://laranjinha:laranjinha1@ds131313.mlab.com:31313/taskme',
    {useNewUrlParser: true}
);

module.exports = mongoose;
