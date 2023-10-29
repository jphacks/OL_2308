FROM python:3.6

WORKDIR /usr/src/app/backend
ENV FLASK_APP=api
ENV FLASK_ENV=development

COPY /requirements.txt ./

RUN pip install --upgrade pip
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .