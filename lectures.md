---
layout: default
title: Lectures
permalink: /lectures/
---
{% comment %}
  LECTURES page. Nothing to edit here: rows come from _lectures/ and dates from
  _data/course_plan.yml. The Slides button links to assets/slides/lecNN.pdf (NN = lecture
  number, e.g. lec04.pdf). Add the PDF to publish; the button then downloads it.
{% endcomment %}
{% assign plan = site.data.course_plan %}
{% assign lectures = site.lectures | sort: "order" %}
<div class="page-container container">
  <header class="page-header">
    <h1 class="page-title">Lectures</h1>
  </header>

  <ol class="lecture-list" aria-label="Lectures">
    {% for lecture in lectures %}
      {% assign n = lecture.order | prepend: "0" | slice: -2, 2 %}
      {% assign entry = plan.topics | where: "topic_order", lecture.order | first %}
      <li class="lecture-item">
        <span class="lecture-num" aria-hidden="true">{{ n }}</span>
        <div class="lecture-main">
          <h2 class="lecture-title">{{ lecture.title }}</h2>
          {% if entry.dates.first %}<p class="lecture-date"><time datetime="{{ entry.dates.first }}">{{ entry.dates.first | date: "%a %-d %b" }}</time>{% if entry.dates.size > 1 %} · {{ entry.dates.size }} sessions{% endif %}</p>{% endif %}
        </div>
        <ul class="lecture-files">
          <li><a class="lecture-btn" href="{{ '/assets/slides/lec' | append: n | append: '.pdf' | relative_url }}" download><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>Slides<span class="sr-only"> for {{ lecture.title }}</span></a></li>
          <li><button type="button" class="lecture-btn" aria-disabled="true" title="Available after the session"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5z"/></svg>Recording<span class="sr-only"> for {{ lecture.title }}, available after the session</span></button></li>
        </ul>
      </li>
    {% endfor %}
  </ol>
</div>
