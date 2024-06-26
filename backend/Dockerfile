FROM python:latest

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBFFERED 1

WORKDIR /backend

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "manage.py" , "runserver", "0.0.0.0:8000"]