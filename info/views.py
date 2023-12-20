from rest_framework import viewsets
from .models import Bio, GitHub, LinkedIn
from .serializers import BioSerializer, GitHubSerializer, LinkedInSerializer


class BioViewSet(viewsets.ModelViewSet):
    queryset = Bio.objects.all()
    serializer_class = BioSerializer


class GitHubViewSet(viewsets.ModelViewSet):
    queryset = GitHub.objects.all()
    serializer_class = GitHubSerializer


class LinkedInViewSet(viewsets.ModelViewSet):
    queryset = LinkedIn.objects.all()
    serializer_class = LinkedInSerializer
