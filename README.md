# TSX Visualization Systems

A modern, React-based visualization system built with TypeScript, featuring interactive charts, 3D visualizations, and real-time data processing capabilities.

## 🚀 Features

- **Interactive Data Visualization**: Built with Plotly.js and Recharts for dynamic data visualization
- **3D Rendering**: Three.js integration for advanced 3D visualizations
- **Modern UI Components**: Radix UI primitives for accessible, composable components
- **Type Safety**: Full TypeScript support with strict type checking
- **Containerization**: Docker support with GPU acceleration capabilities
- **Monitoring**: Grafana and Prometheus integration for system monitoring
- **Vector Database**: Milvus integration for efficient vector similarity search

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Visualization Libraries**: 
  - Plotly.js
  - Recharts
  - Three.js
- **UI Components**: Radix UI
- **Testing**: Jest
- **Database**: Milvus
- **Containerization**: Docker
- **Monitoring**: Grafana & Prometheus

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose (for containerized deployment)
- NVIDIA GPU & drivers (for GPU acceleration features)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd tsx-visualization-systems
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

5. **Build for production**
   ```bash
   yarn build
   ```

## 🐳 Docker Deployment

### Standard Deployment
```bash
docker-compose up -d
```

### GPU-Accelerated Deployment
```bash
docker-compose -f docker-compose.gpu.yml up -d
```

## 📁 Project Structure

```
├── src/
│   ├── api/          # API integration layers
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Core libraries and utilities
│   ├── services/     # Business logic and services
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── public/           # Static assets
├── tests/           # Test suites
├── docker/          # Docker configuration files
├── grafana/         # Grafana dashboards
└── notebooks/       # Jupyter notebooks for data analysis
```

## 🧪 Testing

Run the test suite:
```bash
yarn test
```

Run linting:
```bash
yarn lint
```

Fix linting issues:
```bash
yarn lint:fix
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=your_api_url
VITE_MILVUS_URI=your_milvus_uri
# Add other required environment variables
```

### TailwindCSS

Customize the Tailwind configuration in `tailwind.config.js`.

### TypeScript

The project uses multiple TypeScript configurations:
- `tsconfig.json`: Base configuration
- `tsconfig.app.json`: Application-specific settings
- `tsconfig.node.json`: Node.js specific settings
- `tsconfig.paths.json`: Path aliases

## 📈 Monitoring

The system includes Grafana dashboards for monitoring:
- System metrics
- Application performance
- Resource utilization

Access Grafana at `http://localhost:3000` when running in Docker.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

[Add your license information here]

## 📬 Contact

[Add contact information or maintainer details]
