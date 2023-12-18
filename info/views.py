from rest_framework import generics
from .models import Bio, GitHub, LinkedIn, TwitterX
from .serializers import BioSerializer, GitHubSerializer, LinkedInSerializer, TwitterXSerializer


class BioListApiView(generics.ListCreateAPIView):
    queryset = Bio.objects.all()
    serializer_class = BioSerializer


class GitHubListApiView(generics.ListCreateAPIView):
    queryset = GitHub.objects.all()
    serializer_class = GitHubSerializer


class LinkedInListApiView(generics.ListCreateAPIView):
    queryset = LinkedIn.objects.all()
    serializer_class = LinkedInSerializer


class TwitterXListApiView(generics.ListCreateAPIView):
    queryset = TwitterX.objects.all()
    serializer_class = TwitterXSerializer
