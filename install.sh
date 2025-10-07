#!/bin/bash

# Veepn Server Installation Script
# This script installs Node.js, dependencies, and sets up the VPN server

set -e

echo "🚀 Starting Veepn Server Installation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}" 
   exit 1
fi

# Update system packages
echo -e "${BLUE}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${BLUE}📦 Installing required packages...${NC}"
apt install -y curl wget git build-essential

# Install Node.js 18.x
echo -e "${BLUE}📦 Installing Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify Node.js installation
echo -e "${BLUE}✅ Verifying Node.js installation...${NC}"
node --version
npm --version

# Setup the application in current directory
echo -e "${BLUE}📁 Setting up application in current directory...${NC}"

# Check if package.json exists in current directory
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ Application files found in current directory${NC}"
    APP_DIR=$(pwd)
else
    echo -e "${RED}❌ Application files not found. Please ensure package.json exists in current directory.${NC}"
    echo -e "${YELLOW}💡 Make sure you're running this script from the veepn directory${NC}"
    exit 1
fi

# Install Node.js dependencies
echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
npm install --production

# Make server.js executable
chmod +x server.js

# Create systemd service
echo -e "${BLUE}🔧 Creating systemd service...${NC}"
cat > /etc/systemd/system/veepn.service << EOF
[Unit]
Description=Veepn VPN Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
systemctl daemon-reload
systemctl enable veepn

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo -e "${BLUE}🔥 Configuring firewall...${NC}"
    ufw --force enable
    ufw allow ssh
    ufw allow 443/tcp
    ufw allow 80/tcp
fi

echo -e "${GREEN}✅ Installation completed successfully!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "   1. Run: ${BLUE}systemctl start veepn${NC}"
echo -e "   2. Check status: ${BLUE}systemctl status veepn${NC}"
echo -e "   3. View logs: ${BLUE}journalctl -u veepn -f${NC}"
echo ""
echo -e "${GREEN}🎉 Veepn Server is ready to use!${NC}"
