#!/bin/bash
set -e

echo "Starting support services..."

# Start etcd first
docker-compose up -d etcd
echo "Waiting for etcd to be healthy..."
timeout 30s bash -c 'until docker exec tsx-etcd etcdctl endpoint health; do sleep 2; done'

# Start MinIO
docker-compose up -d minio
echo "Waiting for MinIO to be healthy..."
sleep 10

# Start Milvus with proper order
echo "Starting Milvus components..."
docker-compose up -d milvus
echo "Waiting for Milvus to initialize..."
sleep 15

# Start remaining services
echo "Starting remaining services..."
docker-compose up -d