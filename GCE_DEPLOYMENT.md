# Hosting BudgetNest on a Google Compute Engine VM

This deployment runs the React frontend, Laravel API, and MySQL in Docker
containers. Caddy is the only service exposed to the internet; it routes API
requests internally and obtains HTTPS certificates automatically when a
domain name points to the VM.

The existing `docker-compose.yml` is intended for local development. Use
`docker-compose.gce.yml` for a public VM. It does not publish the database or
application container ports and does not run database seeders.

## 1. Create the VM

In Google Cloud Console:

1. Select or create a Google Cloud project and enable the Compute Engine API.
2. Reserve a static external IPv4 address, then create an Ubuntu 24.04 LTS VM
   in your preferred region. An E2 small VM is a reasonable starting point for
   a low-traffic test; increase memory/CPU if needed.
3. Assign the reserved IP to the VM. Enable the HTTP and HTTPS firewall
   options, or create ingress firewall rules for TCP ports 80 and 443.
4. Keep SSH access restricted to your IP or use Identity-Aware Proxy (IAP).
   Do not open port 3306 or the app's internal container ports.

If you have a domain, create an A record for it pointing to the VM's static
external IP. Wait for DNS to resolve before requesting HTTPS; Caddy handles
certificate issuance and renewal.

## 2. Install Docker and get the project

Connect to the VM, then install Docker and Compose:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Reconnect to the VM so the Docker group membership applies, then verify:

```bash
docker --version
docker compose version
```

Push the application version you intend to deploy to your Git remote, then
clone it on the VM:

```bash
sudo mkdir -p /opt/budgetnest
sudo chown "$USER":"$USER" /opt/budgetnest
git clone --branch backend --single-branch https://github.com/23DP2ACuba/BudgetNest.git /opt/budgetnest
cd /opt/budgetnest
```

If the repository is private, authenticate Git using your normal secure
workflow; do not put a personal access token in the clone URL or deployment
files.

## 3. Configure production values

Create the VM-only environment file:

```bash
cp .env.production.example .env.production
nano .env.production
```

Generate three independent random values on the VM:

```bash
openssl rand -base64 32
openssl rand -hex 32
openssl rand -hex 32
```

Use the first output after `base64:` for `APP_KEY`; use the second and third
outputs for `DB_PASSWORD` and `DB_ROOT_PASSWORD`. Do not reuse passwords or
commit `.env.production`.

For a domain, set the corresponding values, for example:

```dotenv
SITE_ADDRESS=budgetnest.example.com
APP_URL=https://budgetnest.example.com
```

For an initial IP-only test, keep `SITE_ADDRESS=:80` and set
`APP_URL=http://YOUR_VM_EXTERNAL_IP`. This is HTTP-only: do not use it to send
real passwords or financial data. Configure DNS and HTTPS before real use.

## 4. Build and start the application

From `/opt/budgetnest`:

```bash
docker compose --env-file .env.production -f docker-compose.gce.yml up --build -d
docker compose --env-file .env.production -f docker-compose.gce.yml ps
docker compose --env-file .env.production -f docker-compose.gce.yml exec backend php artisan migrate --force
```

Do not run `db:seed` in production. The development seeders create accounts
with known sample passwords. The application does not need seeded accounts
for users to register.

Open the site at the URL in `APP_URL`. Check logs if a container does not
start:

```bash
docker compose --env-file .env.production -f docker-compose.gce.yml logs --tail=100
```

## 5. Updating the deployment

Back up the database before applying updates. Then pull the release and
rebuild containers:

```bash
cd /opt/budgetnest
git pull
docker compose --env-file .env.production -f docker-compose.gce.yml up --build -d
docker compose --env-file .env.production -f docker-compose.gce.yml exec backend php artisan migrate --force
```

Keep the `.env.production` file and Docker volumes when updating. Removing the
`db_data` volume deletes the database.

## Operational notes

- The MySQL container is only reachable on a private Docker network and its
  data is stored in the `db_data` volume. Set up regular database backups and
  test restoring one; a VM disk snapshot alone is not a substitute for a
  database backup.
- Uploaded files and Laravel storage are persisted in the `backend_storage`
  volume. Include those files in your backup plan if the app stores uploads.
- `APP_DEBUG` is disabled and the production Compose setup never runs seeders.
- Users can permanently delete their accounts from Profile Settings after
  confirming their password. Deletion removes budgets they own, transactions
  they created (including those in shared budgets), and their memberships in
  other budgets. The last admin account cannot be deleted.
- The frontend is built with `/api` as its API URL and falls back to the SPA
  entry point for client-side routes.
