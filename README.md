# Machine Learning Systems Engineering (MLSE 2026)

Course website for Sharif University of Technology, built with Jekyll and hosted on GitHub Pages.

## Where things live

| To change | Edit |
|---|---|
| Course name, term, room, time, site URL | `_config.yml` |
| Staff (name, role, email, photo, office hours) | `_data/people.yml` |
| Updates shown on the home page | `_data/announcements.yml` (remove the entries to hide the section) |
| Navigation links | `_data/nav.yml` |
| Lecture topics | `_lectures/NN.md` |
| Session dates, homework release/due dates, exam dates | `_data/course_plan.yml` |
| Homework and project cards (title, topic) | `_data/coursework.yml` |
| Exam cards (title, time, coverage) | `_exams/*.md` |
| Grade split | `_data/grading.yml` |
| Reading list | `sources.md` |
| Slides | `assets/slides/lecNN.pdf` |
| Staff photos | `assets/images/` |
| Styles and scripts | `_sass/`, `assets/js/main.js` |

## Common tasks

**Add or edit a lecture.** Each lecture is a Markdown file with front matter:

```yaml
---
title: "Data Engineering"
order: 4
sessions: 1
description: "ETL/ELT pipelines, data quality, and validation."
---
```

Then list its dates in `_data/course_plan.yml` under `topics`, using the same `topic_order`.

**Publish slides.** Save the PDF as `assets/slides/lecNN.pdf`, where `NN` is the lecture number (for example `lec04.pdf`). The Slides button on the Lectures page links to it automatically. A lecture without a file shows a disabled button.

**Change a deadline or exam date.** Edit the date in `_data/course_plan.yml`. Homework and exam cards read their dates from there.

**Add or change a homework or project card.** Edit `_data/coursework.yml` (title, kind, tag, topic) and give it a release and due date under `coursework` in `_data/course_plan.yml`, matched by `slug`. Cards are shown on the Homework & Exams page only; they have no pages of their own.

**Post an update.** Add an entry to `_data/announcements.yml` with `date`, `title` and optionally `content` and `url`.

## Run it locally

Requires Ruby and Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Open http://127.0.0.1:4000/MLSE2026/. Changes to files rebuild automatically; restart the server after editing `_config.yml`.

With Docker instead:

```bash
docker run --rm -v "$PWD":/srv/jekyll -p 4000:4000 jekyll/jekyll:3.8 jekyll serve
```

## Deploy

Pushing to `main` publishes the site through GitHub Pages (Settings, Pages, Deploy from branch, `main`, `/ (root)`). The live address is `https://erfanyeganegi.github.io/MLSE2026/`. If you rename the repository, update `url` and `baseurl` in `_config.yml` to match.
