FROM python:3-slim

RUN apt-get update \
    && apt-get install -y git \
    && python -m pip install --upgrade pip

WORKDIR /srv/api

ARG schema_branch=develop
RUN git clone -b $schema_branch https://github.com/Calvinxc1/NEA-Schema.git \
    && python -m pip install --no-cache-dir ./NEA-Schema \
    && rm -rf ./NEA-Schema

COPY ./requirements.txt ./
RUN pip install -r requirements.txt \
    && rm requirements.txt

COPY ./spec.json ./
COPY ./config/ ./config/
COPY ./nea_MarketDataApi ./nea_MarketDataApi/

VOLUME /srv/app/config.py

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "nea_MarketDataApi:app"]
