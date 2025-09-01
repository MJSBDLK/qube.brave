# Current Tech Stack - qube.brave

**Updated:** September 2025  
**Status:** Production Ready & Deployed

## Architecture Overview

```
Internet/LAN → nginx (reverse proxy) → Docker Container → Next.js App
                ↓
         Dell OptiPlex 7070 Ubuntu Server 24.04 LTS
```

## Core Technology Stack

### **Frontend Application**
- **Framework**: Next.js 15.5.0 (App Router)
- **Language**: JavaScript (Vanilla JS over TypeScript for development speed)
- **Styling**: Tailwind CSS (hybrid approach - component classes + utilities)
- **Build Target**: Static + SSR hybrid

### **Backend Infrastructure** 
- **Server OS**: Ubuntu Server 24.04 LTS
- **Web Server**: nginx (reverse proxy + SSL termination)
- **Container Runtime**: Docker + Docker Compose
- **Process Management**: Docker containers (replaced PM2 for isolation)
- **Database**: PostgreSQL (installed, ready for use)

### **Development Stack**
- **Runtime**: Node.js 22.x LTS
- **Package Manager**: npm
- **Version Control**: Git (connected to GitHub)
- **Editor**: VS Code Remote-SSH

## Deployment Architecture

### **Container Strategy**
- **Base Image**: `node:22-alpine`
- **Build Process**: Host-based build (bypasses Alpine npm issues)
- **Container Role**: Production runtime only
- **Security**: Runs as non-root user within isolated container

### **Traffic Flow**
1. **External Request** → nginx (port 80/443)
2. **nginx** → Docker container (port 3000)
3. **Container** → Next.js application
4. **Response** flows back through same path

### **Network Configuration**
- **Internal**: Static IP 192.168.1.100
- **Container**: Isolated Docker network
- **Firewall**: UFW enabled (SSH, HTTP, HTTPS only)
- **Authentication**: SSH key-based access

## File Structure

```
/var/www/qube.brave/
├── app/                    # Next.js application source
│   ├── globals.css         # Global styles
│   ├── layout.js          # Root layout
│   ├── page.jsx           # Home page
│   └── ramps/             # Gradient ramps tool
│       ├── page.jsx
│       ├── components/    # React components
│       ├── hooks/         # Custom hooks
│       └── utils/         # Utility functions
├── components/             # Shared components
├── lib/                   # Library code (Prisma, etc.)
├── public/                # Static assets
├── .next/                 # Built application (generated)
├── node_modules/          # Dependencies (host-installed)
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Container orchestration
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind configuration
└── next.config.mjs        # Next.js configuration
```

## Development Workflow

### **Daily Development**
1. **Connect**: VS Code Remote-SSH to server
2. **Edit**: Direct file editing on server via remote session
3. **Test**: Local development server (`npm run dev`)
4. **Build**: Host build process (`npm run build`)
5. **Deploy**: Container rebuild (`sudo docker compose up --build -d`)

### **Version Control**
- **Repository**: GitHub integration active
- **Branch**: main branch tracking
- **Workflow**: Edit → Commit → Push for backup

### **Container Management**
```bash
# Start/restart application
sudo docker compose up --build -d

# View logs
sudo docker compose logs -f

# Stop application
sudo docker compose down

# Check status
sudo docker compose ps
```

## Key Design Decisions

### **Architecture Choices**
- **Docker over PM2**: Chosen for security isolation (qube user has sudo)
- **Host build strategy**: Bypasses Alpine Linux npm compatibility issues
- **nginx proxy**: Industry standard reverse proxy + future SSL termination
- **Static IP**: Consistent addressing for port forwarding setup

### **Development Philosophy**
- **Tight margins/padding**: Compact UI design preference
- **Code organization**: Region folding for IDE efficiency
- **960x960 target**: Half-screen optimization with 4K responsive scaling

## Security Considerations

### **Container Isolation**
- Application runs in isolated Docker environment
- Container has no access to host filesystem beyond mounted volumes
- Even if app compromised, attacker trapped in container

### **Network Security**
- UFW firewall restricts access to essential ports only
- SSH key authentication (no password access)
- nginx handles external traffic (container not directly exposed)

### **User Permissions**
- Host user (qube) has necessary sudo for Docker management
- Application runs as non-root user within container

## Current Status

### **Functional Features**
- Next.js app successfully deployed and accessible
- Docker containerization complete
- nginx reverse proxy operational
- Local network access confirmed (http://192.168.1.100)

### **Ready for Implementation**
- SSL certificate setup (Let's Encrypt)
- Domain configuration (pending Web3 domain strategy)
- Database integration (PostgreSQL ready)
- Additional tool deployment

### **Performance Characteristics**
- Build time: ~4.4s (optimized production build)
- Container startup: ~332ms (ready state)
- Bundle size: 102kB shared JS, individual pages 1.43-14.2kB

## Future Considerations

### **Domain Strategy**
- Current domain: qube.brave (Web3/.brave TLD)
- May require traditional DNS domain for broader accessibility
- Gateway services needed for Web3 domain resolution

### **Scaling Options**
- Docker Compose ready for additional services
- PostgreSQL configured for data persistence
- nginx ready for SSL and advanced routing

### **Monitoring & Maintenance**
- Container logs via Docker Compose
- nginx access/error logs available
- Automatic container restart on failure
