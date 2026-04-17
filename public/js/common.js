
function getRatingText(score) {
  console.log(score);
  let scoreText = "";
  let stars = Math.floor(score / 2);
  let halfStar = score % 2;
  let emptyStars = 5 - stars - halfStar;
  for (let i = 0; i < stars; ++i) {
    scoreText += "★";
  }
  if (halfStar) {
    scoreText += "⯪";
  }
  for (let i = 0; i < emptyStars; ++i) {
    scoreText += "☆";
  }
  return scoreText;
}

function getRatingFromProduct(product) {
  let rating = 0;
  if ("rating" in product) {
    rating = product.rating;
  }

  return getRatingText(rating);
}
