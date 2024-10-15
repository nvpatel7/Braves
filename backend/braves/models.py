from django.db import models

# Create your models here.
class Pitcher(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Batter(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class BattedBall(models.Model):
    pitcher = models.ForeignKey(Pitcher, on_delete=models.CASCADE)
    batter = models.ForeignKey(Batter, on_delete=models.CASCADE)
    game_date = models.DateField()
    launch_angle = models.FloatField()
    exit_speed = models.FloatField()
    exit_direction = models.FloatField()
    hit_distance = models.FloatField()
    hang_time = models.FloatField(null=True)
    hit_spin_rate = models.FloatField(null=True)
    play_outcome = models.CharField(max_length=100)
    video_link = models.URLField()