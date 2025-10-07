const QRCode = require('qrcode-terminal');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');

// Store server configuration
let serverConfig = null;
let realityKeyPair = null;

// Generate random UUID for VLESS
const generateUUID = () => uuidv4();

// Generate short ID for VLESS
const generateShortId = () => crypto.randomBytes(8).toString('hex');

// Get public IP address
const getPublicIP = () => {
    return new Promise((resolve, reject) => {
        exec('curl -s ifconfig.me', (error, stdout, stderr) => {
            if (error) {
                // Fallback method
                exec('curl -s icanhazip.com', (error2, stdout2, stderr2) => {
                    if (error2) {
                        reject(error2);
                    } else {
                        resolve(stdout2.trim());
                    }
                });
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

// Install Xray
const installXray = () => {
    return new Promise((resolve, reject) => {
        const installScript = `
            #!/bin/bash
            # Install Xray
            bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
            
            # Start and enable Xray service
            systemctl start xray
            systemctl enable xray
            
            echo "Xray installation completed"
        `;
        
        exec(installScript, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Generate Xray configuration
const generateXrayConfig = (uuid, shortId, publicIP, port = 443) => {
    realityKeyPair = generateRealityKeyPair();
    
    const config = {
        "log": {
            "loglevel": "warning"
        },
        "inbounds": [
            {
                "port": port,
                "protocol": "vless",
                "settings": {
                    "clients": [
                        {
                            "id": uuid,
                            "flow": ""
                        }
                    ],
                    "decryption": "none"
                },
                "streamSettings": {
                    "network": "tcp",
                    "security": "reality",
                    "realitySettings": {
                        "show": false,
                        "dest": "www.microsoft.com:443",
                        "xver": 0,
                        "serverNames": [
                            "www.microsoft.com"
                        ],
                        "privateKey": realityKeyPair.privateKey,
                        "shortIds": [
                            shortId
                        ]
                    }
                }
            }
        ],
        "outbounds": [
            {
                "protocol": "freedom",
                "settings": {}
            }
        ]
    };
    
    return config;
};

// Generate Reality key pair
const generateRealityKeyPair = () => {
    // Generate 32 random bytes for Reality private key
    const privateKeyBytes = crypto.randomBytes(32);
    
    // Create X25519 key pair from the private key
    const keyPair = crypto.generateKeyPairSync('x25519', {
        privateKey: privateKeyBytes
    });
    
    // Export keys in the correct format for Reality
    const privateKey = privateKeyBytes.toString('base64');
    const publicKey = keyPair.publicKey.export({ type: 'raw', format: 'der' }).toString('base64');
    
    return { privateKey, publicKey };
};

// Generate VLESS URL
const generateVLESSURL = (uuid, publicIP, port, shortId) => {
    if (!realityKeyPair) {
        throw new Error('Reality key pair not generated');
    }
    
    const vlessUrl = `vless://${uuid}@${publicIP}:${port}?encryption=none&security=reality&sni=www.microsoft.com&pbk=${realityKeyPair.publicKey}&sid=${shortId}&spx=%2F&type=tcp&headerType=none&fp=chrome&flow=&seed=#Veepn-Server`;
    return vlessUrl;
};

// Display QR code in terminal
const displayQRCode = (text) => {
    console.log('\n' + '='.repeat(60));
    console.log('📱 VLESS Reality Configuration QR Code:');
    console.log('='.repeat(60));
    QRCode.generate(text, { small: true }, function (qrcode) {
        console.log(qrcode);
    });
    console.log('\n📋 VLESS URL for manual import:');
    console.log(text);
    console.log('\n' + '='.repeat(60));
    console.log('✅ Scan the QR code above with V2rayN or any VLESS client');
    console.log('💡 You can also copy the URL above for manual import');
    console.log('='.repeat(60) + '\n');
};

// Initialize server
const initializeServer = async () => {
    try {
        console.log('Initializing Veepn Server...');
        
        // Check if running as root
        if (process.getuid() !== 0) {
            console.log('Warning: Running without root privileges. Some features may not work.');
        }
        
        // Install Xray
        console.log('Installing Xray...');
        await installXray();
        
        // Get public IP
        console.log('Getting public IP address...');
        const publicIP = await getPublicIP();
        console.log('Public IP:', publicIP);
        
        // Generate server configuration
        const uuid = generateUUID();
        const shortId = generateShortId();
        const port = 443;
        
        serverConfig = {
            uuid,
            shortId,
            publicIP,
            port,
            serverName: 'www.microsoft.com'
        };
        
        // Generate Xray config
        const xrayConfig = generateXrayConfig(uuid, shortId, publicIP, port);
        
        // Write config to file
        fs.writeFileSync('/usr/local/etc/xray/config.json', JSON.stringify(xrayConfig, null, 2));
        
        // Restart Xray service
        exec('systemctl restart xray', (error) => {
            if (error) {
                console.error('Failed to restart Xray:', error);
            } else {
                console.log('Xray service restarted successfully');
            }
        });
        
        console.log('Server initialized successfully!');
        
        // Display QR code and configuration
        const vlessUrl = generateVLESSURL(
            serverConfig.uuid,
            serverConfig.publicIP,
            serverConfig.port,
            serverConfig.shortId
        );
        
        displayQRCode(vlessUrl);
        
        console.log('🚀 Veepn Server is running!');
        console.log('📊 Server Status: Active');
        console.log('🌐 Public IP:', serverConfig.publicIP);
        console.log('🔌 Port:', serverConfig.port);
        console.log('🔑 Protocol: VLESS Reality/TCP');
        console.log('\n💡 Press Ctrl+C to stop the server\n');
        
        return serverConfig;
        
    } catch (error) {
        console.error('Failed to initialize server:', error);
        throw error;
    }
};

// Start server
const startServer = async () => {
    try {
        await initializeServer();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down Veepn Server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nShutting down Veepn Server...');
    process.exit(0);
});

startServer();
