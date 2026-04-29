const { Parser } = require('json2csv');

exports.exportToCSV = (data) => {
  const fields = ['title', 'content', 'author', 'category', 'createdAt'];
  const parser = new Parser({ fields });

  return parser.parse(data);
};