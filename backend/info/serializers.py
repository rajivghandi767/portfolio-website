from rest_framework import serializers
from .models import Info
from .models import Resume


class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Info
        fields = ["id", "profile_photo",
                  "greeting", "bio", "github", "linkedIn"]


class ResumeSerializer(serializers.ModelSerializer):
    view_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ['id', 'view_url', 'download_url', 'uploaded_at']

    def get_view_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_download_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url) + '?download=true'
        return None
