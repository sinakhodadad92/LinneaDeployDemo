from django.db import models

class Post (models.Model):
    description = models.TextField()
    answer = models.TextField(default='NO ANSWER!')
    git_version = models.TextField(default='')

    def __str__(self):
        return self.description

    class Meta:
        verbose_name = "Result"
        verbose_name_plural = "Results"

class SResult (models.Model):
    description = models.TextField()
    result = models.TextField(default='NO ANSWER!')
    git_version = models.TextField(default='LATEST!')

    def __str__(self):
        return self.description

    class Meta:
        verbose_name = "Successfull Result"
        verbose_name_plural = "Successfull Results"

class FResult (models.Model):
    description = models.TextField()
    result = models.TextField(default='NO ANSWER!')
    reason = models.TextField(default='NO REASON!')
    git_version = models.TextField(default='LATEST!')

    def __str__(self):
        return self.description

    class Meta:
        verbose_name = "Failure Result"
        verbose_name_plural = "Failure Results"