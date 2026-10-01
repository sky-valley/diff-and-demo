# Diff & Demo

Pages for the Diff & Demo meetup.

- `index.html`: Inspiration, a collage of embedded tweets showing creative technology
- `ideas.html`: Ideas, prompts for people who are stuck on what to build, plus "Formats to steal" (participation formats with visuals). Images live in `images/`
- `memes.html`: Memes, viral posts and formats to remix

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Tweet embeds may not load when the file is opened directly from disk.

To add a post, paste its URL into the `TWEETS` list in `index.html` or the `MEMES` list in `memes.html`. X posts are embedded, image URLs show as images, and other links show as link cards.
