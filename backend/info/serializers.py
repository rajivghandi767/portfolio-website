import logging
from rest_framework import serializers
from django.urls import reverse
from .models import Info, Resume

logger = logging.getLogger(__name__)


class InfoSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Info
        fields = [
            "id", "site_header", "professional_title", "profile_photo_url",
            "greeting", "bio", "github", "linkedin",
            "created_at", "updated_at"
        ]
        read_only_fields = ('created_at', 'updated_at')

    def get_profile_photo_url(self, obj):
        if obj.profile_photo and hasattr(obj.profile_photo, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None


class ResumeSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(
        source='file.name', read_only=True)
    file_size_display = serializers.CharField(
        source='file_size_display', read_only=True)

    view_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    status_url = serializers.SerializerMethodField()
    file_accessible = serializers.BooleanField(
        source='is_file_accessible', read_only=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'filename', 'file_size_display', 'uploaded_at', 'updated_at', 'is_active',
            'view_url', 'download_url', 'status_url', 'file_accessible', 'file'
        ]
        read_only_fields = ('uploaded_at', 'updated_at',
                            'filename', 'file_size_display', 'file_accessible')
        extra_kwargs = {'file': {'write_only': True}}

    def get_view_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(reverse('resume-view'))
        return reverse('resume-view')

    def get_download_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(reverse('resume-download'))
        return reverse('resume-download')

    def get_status_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(reverse('resume-status'))
        return reverse('resume-status')


class ResumeListSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(
        source='file.name', read_only=True)
    file_size_display = serializers.CharField(
        source='file_size_display', read_only=True)

    class Meta:
        model = Resume
        fields = ['id', 'filename', 'file_size_display',
                  'uploaded_at', 'is_active']
