FROM python:latest

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBFFERED 1

WORKDIR /backend

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4040

CMD ["gunicorn", "portfolio_website.wsgi:application", "--bind", "0.0.0.0:4040"]