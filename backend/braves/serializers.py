#import serializers
from rest_framework import serializers
from .models import Pitcher, Batter, BattedBall

# Define serializers for Pitcher, Batter, and BattedBall
class PitcherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pitcher
        fields = ['id', 'name']

class BatterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batter
        fields = ['id', 'name']

class BattedBallSerializer(serializers.ModelSerializer):
    # Custom fields to include the names of batter and pitcher
    batter_name = serializers.CharField(source='batter.name', read_only=True)
    pitcher_name = serializers.CharField(source='pitcher.name', read_only=True)

    class Meta:
        model = BattedBall
        fields = ['id', 'batter_name', 'pitcher_name', 'game_date', 'launch_angle', 'exit_speed', 'exit_direction', 'hit_distance', 'hang_time', 'hit_spin_rate', 'play_outcome', 'video_link']