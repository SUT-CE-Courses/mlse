---
layout: default
title: Slides
permalink: /slides/
redirect_from:
  - /lectures/
---
<div class="page-container container">
  <header class="page-header">
    <h1 class="page-title">Slides</h1>
  </header>

  <ol class="lecture-list" aria-label="Slides">
    {% for slide in site.data.slides %}
      {% assign n = slide.order | prepend: "0" | slice: -2, 2 %}
      <li class="lecture-item">
        <span class="lecture-num" aria-hidden="true">{{ n }}</span>
        <div class="lecture-main">
          <h2 class="lecture-title">{{ slide.title }}</h2>
        </div>
        <ul class="lecture-files">
          <li>
            <a class="lecture-btn" href="{{ slide.file | relative_url }}" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
              Slides
              <span class="sr-only"> for {{ slide.title }}</span>
            </a>
          </li>
        </ul>
      </li>
    {% endfor %}
  </ol>
</div>
