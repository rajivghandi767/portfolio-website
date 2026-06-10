from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Project

class ProjectAPITests(APITestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title="Test Project",
            description="Test Description",
            repo="https://github.com/test/project",
            deployed_url="https://testproject.com",
            order=1
        )
        self.list_url = reverse('projects-list')

    def test_get_projects_list(self):
        """Test retrieving list of projects."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify pagination-free response format
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Test Project")

    def test_get_project_detail(self):
        """Test retrieving a single project detail."""
        detail_url = reverse('projects-detail', kwargs={'pk': self.project.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test Project")
        self.assertEqual(response.data['description'], "Test Description")
