// Renders a list of URLs into #collage. Tweets (x.com / twitter.com) are embedded,
// image URLs are shown as images, and anything else becomes a link card.
function renderCollage(urls, { listName = "the list" } = {}) {
  const collage = document.getElementById("collage");
  const theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const tilts = [-1.5, 1, -0.5, 1.5, -1, 0.5];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const link = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>`;

  function tweetId(url) {
    const m = String(url).match(/(?:x|twitter)\.com\/[^/]+\/status(?:es)?\/(\d+)/);
    return m ? m[1] : null;
  }
  const isImage = (url) => /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(url);

  if (!urls.length) {
    collage.innerHTML = `<div class="empty">Nothing here yet — add URLs to ${esc(listName)}.</div>`;
    return;
  }

  const tweets = [];
  urls.forEach((url, i) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    // Alternate small tilts so it feels pinned-up rather than gridded
    tile.style.setProperty("--tilt", tilts[i % tilts.length] + "deg");
    collage.appendChild(tile);

    const id = tweetId(url);
    if (id) {
      tile.innerHTML = `<div class="placeholder">Loading ${link(url, url)}</div>`;
      tweets.push({ tile, url, id });
    } else if (isImage(url)) {
      tile.innerHTML = `<a href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="" loading="lazy" /></a>`;
    } else {
      tile.innerHTML = `<div class="placeholder">${link(url, url)}</div>`;
    }
  });

  if (!tweets.length) return;

  window.addEventListener("load", () => {
    if (!window.twttr?.widgets) {
      tweets.forEach(({ tile, url }) => {
        tile.querySelector(".placeholder").innerHTML = `Couldn't load the X embed script. ${link(url, "Open post")}`;
      });
      return;
    }
    tweets.forEach(({ tile, url, id }) => {
      const host = document.createElement("div");
      tile.appendChild(host);
      twttr.widgets
        .createTweet(id, host, { theme, dnt: true, conversation: "none", align: "center" })
        .then((el) => {
          if (el) tile.querySelector(".placeholder").remove();
          else tile.querySelector(".placeholder").innerHTML = `Post unavailable (deleted or private). ${link(url, "Open link")}`;
        });
    });
  });
}
