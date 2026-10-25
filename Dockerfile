FROM docker.n8n.io/n8nio/n8n:2.42.3

# Railway must route its public domain to this internal port.
ENV N8N_PORT=5678
EXPOSE 5678
