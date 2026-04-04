FROM python:3.12-alpine

RUN pip install uv

RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app

COPY pyproject.toml uv.lock* /app/
RUN uv sync
COPY . .

RUN mkdir -p /app/storage && chown -R appuser:appuser /app/storage

USER appuser

EXPOSE 8000
ENTRYPOINT ["uv", "run", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]