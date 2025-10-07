# Veepn Server

An automated VPN server that sets up Xray with VLESS Reality/TCP protocol and displays QR codes in the terminal for easy client configuration.

## Features

- 🚀 **Automatic Xray Installation**: Installs and configures Xray automatically
- 🔐 **VLESS Reality/TCP**: Uses the latest VLESS protocol with Reality transport
- 📱 **QR Code Generation**: Displays QR codes directly in terminal for easy client import
- 🛡️ **Secure Configuration**: Generates unique UUIDs and Reality keys for each deployment
- 🎯 **V2rayN Compatible**: QR codes work perfectly with V2rayN and other VLESS clients
- 🖥️ **Terminal Interface**: No web interface needed - everything shows in terminal

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/egzakutacno/veepn.git
cd veepn
```

### 2. Run Installation Script

```bash
sudo chmod +x install.sh
sudo ./install.sh
```

### 3. Start the Server

```bash
sudo systemctl start veepn
```

### 4. View the QR Code

```bash
sudo journalctl -u veepn -f
```

The QR code and VLESS URL will be displayed in the terminal. Scan the QR code with V2rayN or any VLESS client.

## Manual Installation

If you prefer manual installation:

### Prerequisites

- Ubuntu/Debian VPS
- Root access
- Node.js 18+ (will be installed automatically)

### Installation Steps

1. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
   sudo apt install -y nodejs
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Server**:
   ```bash
   sudo node server.js
   ```

## Configuration

The server automatically:
- Detects your public IP address
- Generates a unique UUID for VLESS
- Creates Reality key pairs
- Configures Xray with optimal settings
- Displays QR codes in terminal

### Default Settings

- **Port**: 443 (HTTPS)
- **Protocol**: VLESS
- **Transport**: TCP with Reality
- **Server Name**: www.microsoft.com
- **Encryption**: None (VLESS standard)

## Usage

### Starting the Service

```bash
sudo systemctl start veepn
```

### Stopping the Service

```bash
sudo systemctl stop veepn
```

### Checking Status

```bash
sudo systemctl status veepn
```

### Viewing Logs

```bash
sudo journalctl -u veepn -f
```

### Restarting the Service

```bash
sudo systemctl restart veepn
```

## Client Configuration

### V2rayN

1. Open V2rayN
2. Click "Servers" → "Import from clipboard or QR code"
3. Scan the QR code displayed in terminal
4. The server will be automatically imported and configured

### Other VLESS Clients

Copy the VLESS URL displayed in the terminal and import it manually into your preferred VLESS client.

## Troubleshooting

### Common Issues

1. **Permission Denied**:
   ```bash
   sudo chmod +x install.sh
   sudo ./install.sh
   ```

2. **Port Already in Use**:
   - Check if another service is using port 443
   - Modify the port in `server.js` if needed

3. **Xray Installation Failed**:
   ```bash
   sudo bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
   ```

4. **Firewall Issues**:
   ```bash
   sudo ufw allow 443/tcp
   sudo ufw allow 80/tcp
   ```

### Checking Logs

```bash
# System logs
sudo journalctl -u veepn -f

# Xray logs
sudo journalctl -u xray -f

# Application logs
sudo tail -f /var/log/veepn.log
```

## Security Notes

- The server runs with root privileges to manage Xray service
- Reality keys are generated uniquely for each deployment
- Default server name is set to www.microsoft.com for better compatibility
- Firewall rules are automatically configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the logs for error messages

---

**Note**: This tool is for educational purposes. Please ensure compliance with your local laws and regulations.
