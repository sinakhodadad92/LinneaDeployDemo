# Generated by Django 2.1.15 on 2020-04-03 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('answer', models.TextField(default='NO ANSWER!')),
                ('git_version', models.TextField(default='a1d3275554d67a5b4c7267e3279bbb40841326d7')),
            ],
            options={
                'verbose_name': 'Result',
                'verbose_name_plural': 'Results',
            },
        ),
    ]
