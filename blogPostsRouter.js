const express = require("express");
const router = express.Router();

const { BlogPosts } = require("./models");

function sampleText() {
  return (
    "this is " + "some sample text " + "to test " + "the app"
  );
}

BlogPosts.create("This is sample blog post #1", sampleText(), "Sample Author");
BlogPosts.create("This is sample blog post #2", sampleText(), "Sample Author");

router.get("/", (req, res) => {
  res.json(BlogPosts.get());
});

router.put("/:id", (req, res) => {
  const requiredFields = ["title", "content", "author"];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

router.delete("/:id", (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;