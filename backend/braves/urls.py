from django.urls import path
from .views import PitcherView, BatterView, BattedBallView, FilteredBattedBallView

urlpatterns = [
    path('pitchers/', PitcherView.as_view(), name='pitchers'),
    path('batters/', BatterView.as_view(), name='batters'),
    path('battedballs/', BattedBallView.as_view(), name='battedballs'),
    path('filteredbattedballs/', FilteredBattedBallView.as_view(), name='filteredbattedballs'),
]


