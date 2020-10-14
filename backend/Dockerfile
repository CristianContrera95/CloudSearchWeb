FROM python:3.8-alpine
MAINTAINER CRISTIAN_CONTRERA <cristiancontrera95@gmail.com>

WORKDIR /app

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY src/ .
RUN pip install gunicorn

EXPOSE 443

CMD ["gunicorn", "--bind=0.0.0.0:443", "-w", "4", "run:app"]
