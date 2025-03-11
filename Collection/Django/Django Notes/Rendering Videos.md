
python -m pip install django-embed-video==1.4.9

INSTALLED_APPS = [
    # ...
    'embed_video',
]


in chosen render
{% load embed_video_tags %}
{% video item.url "small" %}
