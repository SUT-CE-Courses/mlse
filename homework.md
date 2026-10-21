---
layout: default
title: Homework & Exams
permalink: /homework/
---
{% comment %}
  HOMEWORK & EXAMS page. Nothing to edit here: cards come from _data/coursework.yml,
  _exams/*.md and _data/course_plan.yml; the bar from _data/grading.yml. The Research Report
  card text is at the bottom of this file:
    <h3 class="work-name">...</h3> is the description, work-status the date line.
{% endcomment %}
<div class="page-container container">
  <header class="page-header"><h1 class="page-title">Homework &amp; Exams</h1></header>
  {% assign plan = site.data.course_plan %}
  <ul class="work-mix" aria-label="How the grade is split">
    {% for g in site.data.grading %}
      <li style="--w: {{ g.weight }}"><span class="bar"></span><span class="cap"><span>{{ g.title }}</span><b>{{ g.weight }}%</b></span></li>
    {% endfor %}
  </ul>
  <section aria-labelledby="coursework-heading">
    <h2 id="coursework-heading" class="section-heading">Homework &amp; Projects · 40%</h2>
    {% assign coursework = site.data.coursework | sort: "order" %}
    <ul class="work-grid" aria-label="Coursework">
      {% for item in coursework %}
        <li class="work-card" id="{{ item.slug }}" data-num="{{ item.tag | default: item.order }}">
          <span class="work-kind">{{ item.kind }}</span>
          <h3 class="work-name">{{ item.title }}</h3>
          {% assign pe = plan.coursework | where: "slug", item.slug | first %}
          {% if item.topic %}<p class="work-topic">{{ item.topic }}</p>{% endif %}
          {% if pe.due %}<span class="work-status is-set">Due <time datetime="{{ pe.due }}">{{ pe.due | date: "%a %-d %b" }}</time></span>{% else %}<span class="work-status">Topic and deadline to be announced</span>{% endif %}
        </li>
      {% endfor %}
    </ul>
  </section>
  <section class="exams-block" aria-labelledby="exams-heading">
    <h2 id="exams-heading" class="section-heading">Exams · 40%</h2>
    <ul class="work-grid" aria-label="Exams">
      {% assign sorted_exams = site.exams | sort: "order" %}
      {% for exam in sorted_exams %}
        {% assign entry = plan.exams | where: "slug", exam.slug | first %}
        <li class="work-card" data-num="{% if exam.order == 1 %}MT{% else %}FN{% endif %}">
          <span class="work-kind">Exam</span>
          <h3 class="work-name">{{ exam.title }}</h3>
          {% if exam.description %}<p class="work-topic">{{ exam.description }}</p>{% endif %}
          {% if entry.date %}<span class="work-status is-set"><time datetime="{{ entry.date }}">{{ entry.date | date: "%a %-d %b" }}</time></span>{% else %}<span class="work-status">Date to be announced</span>{% endif %}
        </li>
      {% endfor %}
    </ul>
  </section>
  <section class="research-report" aria-labelledby="research-heading">
    <h2 id="research-heading" class="section-heading">Research Report · 20%</h2>
    <ul class="work-grid" style="grid-template-columns:minmax(0,1fr)">
      <li class="work-card is-open" data-num="R">
        <span class="work-kind">Report</span>
        <h3 class="work-name">A DEEP DIVE</h3>
        <span class="work-status">To be announced</span>
      </li>
    </ul>
  </section>
</div>
