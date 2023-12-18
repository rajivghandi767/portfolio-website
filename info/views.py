from rest_framework import generics
from .models import Bio, LinkedIn, TwitterX
from .serializers import BioSerializer, LinkedInSerializer, TwitterXSerializer


class BioListApiView(generics.ListCreateAPIView):
    queryset = Bio.objects.all()
    serializer_class = BioSerializer


class LinkedInListApiView(generics.ListCreateAPIView):
    queryset = LinkedIn.objects.all()
    serializer_class = LinkedInSerializer


class TwitterXListApiView(generics.ListCreateAPIView):
    queryset = TwitterX.objects.all()
    serializer_class = TwitterXSerializer
