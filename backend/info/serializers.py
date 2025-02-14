from rest_framework import serializers
from .models import Info
from .models import Resume


class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Info
        fields = ["id", "profile_photo",
                  "greeting", "bio", "github", "linkedIn"]


class ResumeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Resume model, handling how resume data is
    converted to/from JSON in the API.
    """
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            'id',
            'title',
            'file_url',
            'file_name',
            'is_active',
            'created_at',
            'updated_at',
            'version'
        ]
        read_only_fields = ['file_url', 'file_name',
                            'created_at', 'updated_at', 'version']

    def get_file_url(self, obj):
        """
        Generates a URL for accessing the resume file.
        """
        request = self.context.get('request')
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_file_name(self, obj):
        """
        Returns the original filename of the resume.
        """
        return obj.file.name.split('/')[-1] if obj.file else None
