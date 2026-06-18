from django.core.management.base import BaseCommand
from info.models import Info
from projects.models import Project, Tag
from blog.models import Post, Category
from wallet.models import Card


class Command(BaseCommand):
    help = "Seeds the database with dummy data for all new portfolio sections"

    def handle(self, *args, **kwargs):

        self.stdout.write(self.style.NOTICE("Seeding Info..."))
        if not Info.objects.exists():
            Info.objects.create(
                site_header="Rajiv Wallace",
                professional_title="Full Stack Engineer",
                greeting="Hello! I'm Rajiv.",
                bio="A software engineer passionate about building scalable and performant web applications using Django and React.",
                github="https://github.com/rajivghandi767",
                linkedin="https://linkedin.com/in/rajivwallace",
                email="dev@rajivwallace.com",
                substack="https://rajiv.substack.com",
            )
        else:
            info = Info.objects.first()
            updated = False
            if not info.email:
                info.email = "dev@rajivwallace.com"
                updated = True
            if not info.substack:
                info.substack = "https://rajiv.substack.com"
                updated = True
            if updated:
                info.save()

        self.stdout.write(self.style.NOTICE("Seeding Project Tags and Projects..."))
        tag_names = ["Frontend", "Backend", "Full Stack", "Machine Learning"]
        tags = []
        for tag_name in tag_names:
            tag, _ = Tag.objects.update_or_create(name=tag_name)
            tags.append(tag)

        projects = [
            {
                "title": "Portfolio v2",
                "description": "My personal portfolio website built with React and Django.",
                "technology": "React, Django, Tailwind",
                "repo": "https://github.com/rajivghandi767/portfolio-website",
                "deployed_url": "https://rajivwallace.com",
                "order": 1,
            },
            {
                "title": "Country Trivia API",
                "description": "A RESTful API serving geographic trivia data.",
                "technology": "Django, PostgreSQL",
                "repo": "https://github.com/rajivghandi767/country-trivia",
                "deployed_url": "https://trivia.rajivwallace.com",
                "order": 2,
            },
            {
                "title": "Prop & Ferry",
                "description": "A fast and efficient booking engine for island hopping.",
                "technology": "Next.js, Node.js",
                "repo": "https://github.com/rajivghandi767/prop-ferry",
                "deployed_url": "https://prop-ferry.rajivwallace.com",
                "order": 3,
            },
            {
                "title": "Machine Learning Model Server",
                "description": "An API server wrapping computer vision models.",
                "technology": "Python, FastAPI",
                "repo": "https://github.com/rajivghandi767/ml-server",
                "deployed_url": "",
                "order": 4,
            },
            {
                "title": "Chat App",
                "description": "A real-time chat application with web sockets.",
                "technology": "React, Socket.io",
                "repo": "https://github.com/rajivghandi767/chat-app",
                "deployed_url": "",
                "order": 5,
            },
            {
                "title": "Data Visualization Dashboard",
                "description": "An interactive dashboard for complex datasets.",
                "technology": "Vue.js, D3.js",
                "repo": "https://github.com/rajivghandi767/data-dashboard",
                "deployed_url": "",
                "order": 6,
            },
        ]

        for idx, proj_data in enumerate(projects):
            project, created = Project.objects.update_or_create(
                title=proj_data["title"], defaults=proj_data
            )
            if created:
                if idx == 0:
                    project.tags.add(tags[0], tags[1], tags[2])
                else:
                    project.tags.add(tags[1])

        self.stdout.write(self.style.NOTICE("Seeding Blog Categories and Posts..."))
        cat_dev, _ = Category.objects.update_or_create(name="Development")
        cat_life, _ = Category.objects.update_or_create(name="Life")
        cat_tech, _ = Category.objects.update_or_create(name="Tech")

        posts = [
            {
                "title": "My Journey into Tech",
                "body": "<p>This is a story about how I started coding.</p>",
                "order": 1,
            },
            {
                "title": "React vs Angular",
                "body": "<p>A deep dive into frontend frameworks.</p>",
                "order": 2,
            },
            {
                "title": "Building a REST API with Django",
                "body": "<p>Learn how to build a scalable API.</p>",
                "order": 3,
            },
            {
                "title": "Why I Love TypeScript",
                "body": "<p>Static typing brings sanity to JavaScript.</p>",
                "order": 4,
            },
        ]

        for idx, post_data in enumerate(posts):
            post, created = Post.objects.update_or_create(
                title=post_data["title"], defaults=post_data
            )
            if created:
                if idx == 0:
                    post.categories.add(cat_dev, cat_life)
                else:
                    post.categories.add(cat_dev)

        self.stdout.write(self.style.NOTICE("Seeding Wallet Cards..."))
        cards = [
            {
                "card_name": "Chase Sapphire Preferred",
                "description": "Great starter travel card with excellent transfer partners.",
                "annual_fee": "$95",
                "referral_link": "https://chase.com/refer",
                "order": 1,
            },
            {
                "card_name": "Amex Gold",
                "description": "The best card for dining and groceries.",
                "annual_fee": "$250",
                "referral_link": "https://americanexpress.com/refer",
                "order": 2,
            },
            {
                "card_name": "Capital One Venture X",
                "description": "Premium travel card with lounge access.",
                "annual_fee": "$395",
                "referral_link": "https://capitalone.com/refer",
                "order": 3,
            },
            {
                "card_name": "Bilt Mastercard",
                "description": "Earn points on rent with no fees.",
                "annual_fee": "$0",
                "referral_link": "https://bilt.com/refer",
                "order": 4,
            },
            {
                "card_name": "Chase Freedom Flex",
                "description": "5% rotating categories for cash back.",
                "annual_fee": "$0",
                "referral_link": "https://chase.com/refer",
                "order": 5,
            },
            {
                "card_name": "Amex Platinum",
                "description": "The ultimate luxury travel card.",
                "annual_fee": "$695",
                "referral_link": "https://americanexpress.com/refer",
                "order": 6,
            },
        ]
        for card_data in cards:
            Card.objects.update_or_create(
                card_name=card_data["card_name"], defaults=card_data
            )

        self.stdout.write(self.style.SUCCESS("All dummy data seeded successfully!"))
