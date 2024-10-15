import os
import django

# Set the environment variable to point to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
django.setup()


import pandas as pd
import numpy as np

from braves.models import Batter, BattedBall, Pitcher

#delete all data from the database and reindex the primary keys
Batter.objects.all().delete()


df = pd.read_excel('Batted Ball Data.xlsx', sheet_name='Data')

df['BATTER'] = df['BATTER'].str.split(', ').str[::-1].str.join(' ')
df['PITCHER'] = df['PITCHER'].str.split(', ').str[::-1].str.join(' ')

# Create Batter objects
batters = df['BATTER'].unique()
batter_id = df['BATTER_ID'].unique()

for i in range(len(batters)):
    batter = Batter(id=batter_id[i], name=batters[i])
    batter.save()

pitchers = df['PITCHER'].unique()
pitcher_id = df['PITCHER_ID'].unique()

for i in range(len(pitchers)):
    batter = Pitcher(id=pitcher_id[i], name=pitchers[i])
    batter.save()
    
# Create BattedBall objects
for i in range(len(df)):
    batter = Batter.objects.get(id=df['BATTER_ID'][i])
    pitcher = Pitcher.objects.get(id=df['PITCHER_ID'][i])
    batted_ball = BattedBall(
        pitcher=pitcher,
        batter=batter,
        game_date=df['GAME_DATE'][i],
        launch_angle=df['LAUNCH_ANGLE'][i],
        exit_speed=df['EXIT_SPEED'][i],
        exit_direction=df['EXIT_DIRECTION'][i],
        hit_distance=df['HIT_DISTANCE'][i],
        hang_time=df['HANG_TIME'][i],
        hit_spin_rate=df['HIT_SPIN_RATE'][i],
        play_outcome=df['PLAY_OUTCOME'][i],
        video_link=df['VIDEO_LINK'][i]
    )
    batted_ball.save()
