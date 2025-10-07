# Deployment Guide

## Uploading to GitHub

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Veepn VPN Server"
```

### 2. Add Remote Repository

```bash
git remote add origin https://github.com/egzakutacno/veepn.git
```

### 3. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## VPS Deployment

### Quick Deployment (Recommended)

1. **Clone the repository on your VPS**:
   ```bash
   git clone https://github.com/egzakutacno/veepn.git
   cd veepn
   ```

2. **Run the installation script**:
   ```bash
   sudo chmod +x install.sh
   sudo ./install.sh
   ```

3. **Start the server**:
   ```bash
   sudo systemctl start veepn
   ```

4. **View the QR code**:
   ```bash
   sudo journalctl -u veepn -f
   ```

### Manual Deployment

If you prefer manual installation:

1. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
   sudo apt install -y nodejs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   sudo node server.js
   ```

## Post-Deployment

After successful deployment:

1. The QR code will be displayed in the terminal
2. Scan the QR code with V2rayN or any VLESS client
3. The server will automatically configure Xray with optimal settings
4. Your VPN server will be ready to use

## Troubleshooting

### Common Issues

1. **Permission denied**: Make sure to run with `sudo`
2. **Port already in use**: Check if port 443 is available
3. **Xray installation failed**: Run the Xray installation manually
4. **QR code not displaying**: Check the logs for errors

### Useful Commands

```bash
# Check service status
sudo systemctl status veepn

# View logs
sudo journalctl -u veepn -f

# Restart service
sudo systemctl restart veepn

# Stop service
sudo systemctl stop veepn
```

## Security Notes

- The server runs with root privileges to manage Xray
- Reality keys are generated uniquely for each deployment
- Firewall rules are automatically configured
- Default port is 443 (HTTPS) for better compatibility
