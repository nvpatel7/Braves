# Generated by Django 5.1.2 on 2024-10-14 04:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("braves", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="battedball",
            name="hang_time",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="battedball",
            name="hit_spin_rate",
            field=models.FloatField(null=True),
        ),
    ]