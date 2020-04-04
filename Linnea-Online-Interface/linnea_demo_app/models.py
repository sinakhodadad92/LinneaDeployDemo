from django.db import models

class Post (models.Model):
    description = models.TextField()
    answer = models.TextField(default='NO ANSWER!')
    git_version = models.TextField(default='a1d3275554d67a5b4c7267e3279bbb40841326d7')

    def __str__(self):
        return self.description

    class Meta:
        verbose_name = "Result"
        verbose_name_plural = "Results"
