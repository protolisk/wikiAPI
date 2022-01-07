//jshint esversion:8
//---boiler plate---//
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'));

app.set('view engine', 'ejs');

//---mongoose---//
mongoose.connect('mongodb://localhost:27017/wikiDB');

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model('Article', articlesSchema);
//---end of mongoose---//
//--- end of boiler plate ---/

//---GET---//changed it to app.route//
app
  .route('/articles')
  //---get all articles---//
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  //---post a new article---//
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send('Successfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })
  //---delete all articles---//
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send('Successfully deleted all articles!');
      } else {
        res.send(err);
      }
    });
  });

//---GET a specific article---//
app
  .route('/articles/:articleTitle')

  //req.params.articleTitle = "REST";

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send('No articles matching that title was found.' + err);
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send('Successfully updated one document.');
        } else {
          res.send('Failed to update document.');
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send('Successfully updated article - Patched.');
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send('Deleted Article.');
      } else {
        res.send(err);
      }
    });
  });

//---end of GET a specific article---//
//---open port---//
app.listen(3000, function () {
  console.log('Server is running on port 3000');
});
//---end of open port---//
