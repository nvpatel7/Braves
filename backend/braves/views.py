#imports for rest_framework, views, and models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Pitcher, Batter, BattedBall
from .serializers import PitcherSerializer, BatterSerializer, BattedBallSerializer


class PitcherView(APIView):
    @csrf_exempt
    def get(self, request):
        serializer = PitcherSerializer(Pitcher.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @csrf_exempt
    def post(self, request):
        data = request.data
        serializer = PitcherSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BatterView(APIView):
    @csrf_exempt
    def get(self, request):
        serializer = BatterSerializer(Batter.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @csrf_exempt
    def post(self, request):
        data = request.data
        serializer = BatterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BattedBallView(APIView):
    @csrf_exempt
    def get(self, request):
        serializer = BattedBallSerializer(BattedBall.objects.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @csrf_exempt
    def post(self, request):
        data = request.data
        serializer = BattedBallSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class FilteredBattedBallView(APIView):
    @csrf_exempt
    def get(self, request):
        # Get the query parameters from the URL (e.g., ?batter=Francisco+Lindor&pitcher=John+Doe)
        pitcher_name = request.query_params.get('pitcher', None)  # Defaults to None if not provided
        batter_name = request.query_params.get('batter', None)    # Defaults to None if not provided

        #verify that the query parameters are available in the database
        if pitcher_name:
            if not Pitcher.objects.filter(name=pitcher_name).exists():
                return Response({'error': 'Pitcher not found'}, status=status.HTTP_404_NOT_FOUND)
        if batter_name:
            if not Batter.objects.filter(name=batter_name).exists():
                return Response({'error': 'Batter not found'}, status=status.HTTP_404_NOT_FOUND)

        # Start with all BattedBall objects
        queryset = BattedBall.objects.all()

        # Filter by pitcher if provided
        if pitcher_name:
            queryset = queryset.filter(pitcher__name=pitcher_name)

        # Filter by batter if provided
        if batter_name:
            queryset = queryset.filter(batter__name=batter_name)

        # Serialize the filtered queryset
        serializer = BattedBallSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
