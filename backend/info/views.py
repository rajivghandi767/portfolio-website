from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Bio, GitHub, LinkedIn
from .serializers import BioSerializer, GitHubSerializer, LinkedInSerializer


class BioViewSet(viewsets.ModelViewSet):
    queryset = Bio.objects.all()
    serializer_class = BioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class GitHubViewSet(viewsets.ModelViewSet):
    queryset = GitHub.objects.all()
    serializer_class = GitHubSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class LinkedInViewSet(viewsets.ModelViewSet):
    queryset = LinkedIn.objects.all()
    serializer_class = LinkedInSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
