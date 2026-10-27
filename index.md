---
layout: default
title: Home
permalink: /
---
{% comment %}
  HOME page. Nothing to edit here. Sections and where their content lives:
    Header facts   _data/course_plan.yml (teaching_days), _config.yml (meeting_time, location)
    Updates        _data/announcements.yml
    Staff          _data/people.yml
    Course Plan    _data/course_plan.yml
    Assessment     _data/grading.yml
    Academic Honesty  the honor code link near the bottom of this file
{% endcomment %}
{% assign plan = site.data.course_plan %}
{% assign term_year = site.term | split: " " | last %}
<div class="page-container container home-sections">
  <!-- 1. Masthead: what this course is, in one look -->
  <section class="home-masthead" aria-labelledby="course-title">
    <h1 id="course-title" class="masthead-title">{{ site.course_name }}</h1>
    <dl class="masthead-facts">
      {% if plan.teaching_days %}<div><dt>Meets</dt><dd>{{ plan.teaching_days }}</dd></div>{% endif %}
      {% if site.meeting_time %}<div><dt>Time</dt><dd>{{ site.meeting_time }}</dd></div>{% endif %}
      {% if site.location %}<div><dt>Room</dt><dd>{{ site.location }}</dd></div>{% endif %}
    </dl>
    <p class="masthead-cta"><a href="https://quera.org/course/add_to_course/course/29353/" target="_blank" rel="noopener noreferrer" class="masthead-external">Join the course on <span class="masthead-brand">Quera</span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg><span class="sr-only"> (opens in a new tab)</span></a><a href="{{ '/lectures/' | relative_url }}" class="masthead-external masthead-secondary">Lectures</a></p>
    <a class="masthead-scroll" href="#{% if site.data.announcements and site.data.announcements.size > 0 %}updates{% else %}course-plan{% endif %}" aria-label="Scroll to the course content"><span class="masthead-scroll-label">Scroll</span><span class="masthead-scroll-track" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span></a>
  </section>

  <div class="home-content">
  <!-- Phone and tablet only: a sticky strip to jump between sections. Desktop uses the sticky headings. -->
  <nav class="section-index" aria-label="Sections on this page">
    {% if site.data.announcements and site.data.announcements.size > 0 %}<a href="#updates">Updates</a>{% endif %}
    <a href="#staff">Staff</a>
    <a href="#course-plan">Plan</a>
    <a href="#assessment">Assessment</a>
    <a href="#ai-policy">Honesty</a>
  </nav>

  <!-- Updates (Self-hiding when empty) -->
  {% if site.data.announcements and site.data.announcements.size > 0 %}
    <section class="announcements-section" id="updates" aria-labelledby="updates-heading">
      <h2 id="updates-heading" class="section-heading">Updates</h2>
      <div class="section-body">
      <ul class="announcements-list">
        {% for note in site.data.announcements %}
          <li class="announcement-item">
            <time class="announcement-date" datetime="{{ note.date }}">{% include jalali_date.html date=note.date format="weekday_day_month" %}{% assign note_parts = note.date | split: "-" %}{% if note_parts[0] != term_year and term_year != "" and term_year != "1405" %} {{ note_parts[0] }}{% endif %}</time>
            <div class="announcement-text">
              <h3 class="announcement-title">{% if note.url %}<a href="{{ note.url | relative_url }}">{{ note.title }}</a>{% else %}{{ note.title }}{% endif %}</h3>
              {% if note.content %}
                <div class="announcement-body"><p>{{ note.content }}</p></div>
              {% endif %}
            </div>
          </li>
        {% endfor %}
      </ul>
      </div>
    </section>
  {% endif %}

  {% include staff.html %}

  {% include course_plan.html %}

  <section class="home-overview" id="assessment" aria-labelledby="assessment-heading">
    <h2 id="assessment-heading" class="section-heading">Assessment</h2>
    <div class="section-body">
    <dl class="home-assessment">
      {% for component in site.data.grading %}
        <div style="--w: {{ component.weight }}">
          <dt>{{ component.title }}</dt>
          <dd>{{ component.weight }}%</dd>
        </div>
      {% endfor %}
    </dl>
    </div>
  </section>

  <section class="home-overview ai-policy" id="ai-policy" aria-labelledby="ai-policy-heading">
    <h2 id="ai-policy-heading" class="section-heading">Academic Honesty</h2>
    <div class="section-body">
      <p class="policy-lead"><a href="https://ac.sharif.edu/rules/ai-ethics" target="_blank" rel="noopener noreferrer">Sharif University of Technology - CE Department Honor Code<span class="sr-only"> (opens in a new tab)</span></a></p>
    </div>
  </section>
  </div>
</div>
