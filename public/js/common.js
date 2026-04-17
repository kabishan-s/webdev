
function getRatingStarHtml(starIcon, value, htmlClass, onclick=null) {
    let text = "";

    if (htmlClass !== "" || onclick !== null) {
        text += `<span class="${htmlClass}"`;
        if (onclick !== null) {
            text += ` onclick="${onclick}(${value})"`;
        }
        text += ">";
    }

    text += starIcon;

    if (htmlClass !== "" || onclick !== null) {
        text += "</span>";
    }

    return text;
}

function getRatingText(score, htmlClass, onclick=null) {
  score = Math.round(score);
  let scoreText = "";
  let stars = Math.floor(score / 2);
  let halfStar = score % 2;
  let emptyStars = 5 - stars - halfStar;
  for (let i = 0; i < stars; ++i) {
    scoreText += getRatingStarHtml("★", (i + 1) * 2, htmlClass, onclick);
  }
  if (halfStar) {
    scoreText += getRatingStarHtml("⯪", stars * 2 + 2, htmlClass, onclick);
  }
  for (let i = 0; i < emptyStars; ++i) {
    scoreText += getRatingStarHtml("☆", (stars + halfStar + i + 1) * 2, htmlClass, onclick);
  }
  return scoreText;
}

function getRatingFromProduct(product, showCount, htmlClass="", onclick=null) {
  let rating = 0;
  let count = 0;
  if ("rating" in product) {
    rating = product.rating;
    count = product.ratingCount;
  }

  return getRatingText(rating, htmlClass, onclick) + (showCount ? ` (${count})` : "");
}
