const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
