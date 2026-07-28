import type {
  Project,
  GitHubRepo,
  Commit,
  PullRequest,
  DocPage,
  AssetFile,
  Milestone,
  ClientPortal,
  Invoice,
  NotificationItem
} from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Aetheria Cloud Portal',
    clientName: 'Aetheria Systems Corp',
    description: 'High-performance real-time telemetry dashboard & cloud infrastructure manager.',
    techStack: ['Next.js 15', 'TypeScript', 'Rust', 'Tailwind', 'WebSockets'],
    status: 'in_progress',
    progress: 78,
    budget: 28500,
    spent: 21400,
    dueDate: '2026-08-15',
    githubRepo: 'velis-agency/aetheria-portal',
    priority: 'high',
    membersCount: 4
  },
  {
    id: 'proj-2',
    name: 'Hyperion AI Engine',
    clientName: 'Hyperion Labs',
    description: 'Distributed vector indexing and LLM prompt optimization SDK for developer workflows.',
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Qdrant', 'Docker'],
    status: 'review',
    progress: 92,
    budget: 42000,
    spent: 38500,
    dueDate: '2026-07-30',
    githubRepo: 'velis-agency/hyperion-core',
    priority: 'high',
    membersCount: 6
  },
  {
    id: 'proj-3',
    name: 'Vortex Finance Mobile',
    clientName: 'Vortex Capital',
    description: 'Cross-platform crypto wallet and institutional yield farming dashboard.',
    techStack: ['React Native', 'Ethers.js', 'GraphQL', 'Zustand'],
    status: 'in_progress',
    progress: 45,
    budget: 35000,
    spent: 15800,
    dueDate: '2026-09-20',
    githubRepo: 'velis-agency/vortex-mobile',
    priority: 'medium',
    membersCount: 3
  },
  {
    id: 'proj-4',
    name: 'Krypton Design System',
    clientName: 'Internal / Open Source',
    description: 'Ultra-minimal monochrome design tokens and headless component collection.',
    techStack: ['React', 'Tailwind v4', 'Framer Motion', 'Storybook'],
    status: 'completed',
    progress: 100,
    budget: 12000,
    spent: 11800,
    dueDate: '2026-07-10',
    githubRepo: 'velis-agency/krypton-ui',
    priority: 'low',
    membersCount: 2
  },
  {
    id: 'proj-5',
    name: 'OmniStream Video Engine',
    clientName: 'Omni Media Group',
    description: 'Ultra low-latency HLS video transcoding microservices on WebAssembly.',
    techStack: ['Go', 'Wasm', 'FFmpeg', 'AWS S3', 'Redis'],
    status: 'planning',
    progress: 15,
    budget: 50000,
    spent: 5200,
    dueDate: '2026-11-01',
    githubRepo: 'velis-agency/omnistream-core',
    priority: 'medium',
    membersCount: 5
  }
];

export const INITIAL_REPOS: GitHubRepo[] = [
  {
    id: 'repo-1',
    name: 'velis-agency/aetheria-portal',
    description: 'Next.js 15 App Router telemetry dashboard with liquid glass UI components.',
    stars: 342,
    forks: 48,
    openIssues: 5,
    openPRs: 3,
    defaultBranch: 'main',
    commitsCount: 284,
    updatedAt: '12 mins ago',
    language: 'TypeScript'
  },
  {
    id: 'repo-2',
    name: 'velis-agency/hyperion-core',
    description: 'High-throughput LLM prompt proxy & vector memory engine.',
    stars: 1240,
    forks: 189,
    openIssues: 12,
    openPRs: 6,
    defaultBranch: 'main',
    commitsCount: 512,
    updatedAt: '1 hour ago',
    language: 'Python'
  },
  {
    id: 'repo-3',
    name: 'velis-agency/vortex-mobile',
    description: 'React Native wallet client with hardware signer integration.',
    stars: 188,
    forks: 24,
    openIssues: 8,
    openPRs: 2,
    defaultBranch: 'develop',
    commitsCount: 196,
    updatedAt: '3 hours ago',
    language: 'TypeScript'
  },
  {
    id: 'repo-4',
    name: 'velis-agency/krypton-ui',
    description: 'Zero-config headless UI primitives tailored for dark desktop applications.',
    stars: 2890,
    forks: 310,
    openIssues: 2,
    openPRs: 1,
    defaultBranch: 'main',
    commitsCount: 340,
    updatedAt: 'Yesterday',
    language: 'TypeScript'
  }
];

export const INITIAL_COMMITS: Commit[] = [
  {
    id: 'c-1',
    hash: '7f9a12c',
    message: 'feat(ui): add liquid glass backdrop filter and floating card elevations',
    author: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: '14 mins ago',
    branch: 'main',
    repoName: 'aetheria-portal'
  },
  {
    id: 'c-2',
    hash: '3e810ab',
    message: 'perf(vector): optimize Qdrant distance computation batch size',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    timestamp: '42 mins ago',
    branch: 'feat/qdrant-batch',
    repoName: 'hyperion-core'
  },
  {
    id: 'c-3',
    hash: '90b631d',
    message: 'fix(auth): sanitize hardware key payload before broadcast',
    author: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    timestamp: '2 hours ago',
    branch: 'develop',
    repoName: 'vortex-mobile'
  },
  {
    id: 'c-4',
    hash: '11c4e90',
    message: 'docs(api): document WebSocket reconnect exponential backoff',
    author: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: '4 hours ago',
    branch: 'main',
    repoName: 'aetheria-portal'
  }
];

export const INITIAL_PRS: PullRequest[] = [
  {
    id: 'pr-1',
    title: 'feat: Implement Framer Motion shared layout transitions for client portal',
    author: 'Alex Vance',
    status: 'open',
    branch: 'feat/layout-transitions',
    additions: 432,
    deletions: 89,
    commentsCount: 7,
    repoName: 'aetheria-portal'
  },
  {
    id: 'pr-2',
    title: 'refactor: Upgrade vector indexer to PyTorch 2.4 C++ bindings',
    author: 'Elena Rostova',
    status: 'open',
    branch: 'feat/pytorch-cpp',
    additions: 1205,
    deletions: 640,
    commentsCount: 14,
    repoName: 'hyperion-core'
  },
  {
    id: 'pr-3',
    title: 'fix: Handle network dropouts during hardware wallet signature prompt',
    author: 'Marcus Chen',
    status: 'merged',
    branch: 'fix/wallet-reconnect',
    additions: 112,
    deletions: 45,
    commentsCount: 3,
    repoName: 'vortex-mobile'
  }
];

export const INITIAL_DOCS: DocPage[] = [
  {
    id: 'doc-1',
    title: 'Aetheria Cloud Telemetry Architecture',
    category: 'Architecture Specs',
    lastEdited: 'Today, 09:40 AM',
    author: 'Alex Vance',
    tags: ['Architecture', 'Next.js', 'Rust', 'WebSockets'],
    isPublic: true,
    content: `# Aetheria Cloud Telemetry Architecture

## Overview
This document specifies the real-time data flow for the Aetheria Telemetry Portal. All metrics are aggregated through a high-performance **Rust** edge gateway and streamed to **Next.js 15** frontend clients via **WebSockets**.

\`\`\`rust
// Edge Gateway Packet Normalizer
pub fn process_packet(raw: &[u8]) -> Result<TelemetryEvent, StreamError> {
    let packet = ProtocolParser::decode(raw)?;
    Ok(TelemetryEvent {
        sensor_id: packet.id,
        timestamp: Utc::now(),
        payload: packet.digest(),
    })
}
\`\`\`

### Key SLA Targets
- **Ingestion Latency**: < 12ms p99
- **Client Render Speed**: 60 FPS continuous smooth chart updates
- **Security**: AES-256-GCM encrypted transport tunnels`
  },
  {
    id: 'doc-2',
    title: 'Hyperion Vector Store API Integration',
    category: 'Developer Specs',
    lastEdited: 'Yesterday, 14:15 PM',
    author: 'Elena Rostova',
    tags: ['FastAPI', 'Qdrant', 'Python'],
    isPublic: false,
    content: `# Hyperion Vector Store Integration

## API Endpoint
\`POST /api/v1/vectors/upsert\`

\`\`\`json
{
  "collection": "developer_context",
  "points": [
    {
      "id": "doc-8812",
      "vector": [0.045, -0.192, 0.884, 0.129],
      "payload": {
        "source": "github_pull_request",
        "author": "elena@hyperion.io"
      }
    }
  ]
}
\`\`\`

Ensure client bearer token includes \`vectors:write\` permission scope.`
  },
  {
    id: 'doc-3',
    title: 'Client Portal Handover Checklist',
    category: 'Client Ops',
    lastEdited: '2 days ago',
    author: 'Sarah Jenkins',
    tags: ['Handover', 'Client Portal', 'SLA'],
    isPublic: true,
    content: `# Client Handover Protocol

1. **Repository Ownership**: Transfer primary GitHub organization admin permissions.
2. **Environment Secrets**: Verify production \`.env\` credentials in Velis Credentials Vault.
3. **Staging Approval**: Conduct sign-off session on Client Portal demo environment.
4. **Final Invoice**: Issue milestone 4 clearance receipt.`
  }
];

export const INITIAL_FILES: AssetFile[] = [
  {
    id: 'file-1',
    name: 'Aetheria_Master_Service_Agreement_2026.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedAt: '2026-06-12',
    category: 'contracts',
    secureUrl: 'https://velis.app/storage/contracts/msa-aetheria.pdf'
  },
  {
    id: 'file-2',
    name: 'Hyperion_VisionOS_UI_Design_Tokens.figma',
    type: 'figma',
    size: '48.1 MB',
    uploadedAt: '2026-07-01',
    category: 'designs',
    secureUrl: 'https://figma.com/file/hyperion-tokens-v2'
  },
  {
    id: 'file-3',
    name: 'Aetheria_Prod_Database_Master_URL',
    type: 'env',
    size: '1.2 KB',
    uploadedAt: 'Today',
    category: 'credentials',
    secureUrl: '#',
    isSecret: true,
    secretValue: 'postgresql://admin:k8s_x99_sec_v3ls@db.aetheria-cloud.internal:5432/telemetry_prod'
  },
  {
    id: 'file-4',
    name: 'Vortex_Mobile_AppStore_Provisioning.mobileprovision',
    type: 'archive',
    size: '512 KB',
    uploadedAt: '2026-07-18',
    category: 'credentials',
    secureUrl: 'https://velis.app/storage/certs/vortex.mobileprovision'
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'm-1',
    projectName: 'Aetheria Cloud Portal',
    title: 'Phase 1: Real-time Telemetry Dashboard Release',
    status: 'in_progress',
    dueDate: '2026-07-31',
    progress: 85,
    phase: 'Development'
  },
  {
    id: 'm-2',
    projectName: 'Hyperion AI Engine',
    title: 'Phase 2: PyTorch GPU Acceleration Benchmarks',
    status: 'completed',
    dueDate: '2026-07-20',
    progress: 100,
    phase: 'QA & Benchmarking'
  },
  {
    id: 'm-3',
    projectName: 'Vortex Finance Mobile',
    title: 'Phase 1: Hardware Signer Bluetooth Integration',
    status: 'in_progress',
    dueDate: '2026-08-15',
    progress: 40,
    phase: 'Engineering'
  },
  {
    id: 'm-4',
    projectName: 'OmniStream Video Engine',
    title: 'Phase 0: Wasm Transcoder Proof of Concept',
    status: 'pending',
    dueDate: '2026-09-01',
    progress: 10,
    phase: 'Research'
  }
];

export const INITIAL_CLIENTS: ClientPortal[] = [
  {
    id: 'client-eswar',
    clientName: 'Eswar Chinthakayala',
    company: 'Velis Systems & Media',
    activeProjectsCount: 2,
    unpaidInvoicesTotal: 0,
    satisfactionRating: 5.0,
    lastActive: 'Just now',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    email: 'eswarchinthakayala2004@gmail.com'
  },
  {
    id: 'client-1',
    clientName: 'Victor Vance',
    company: 'Aetheria Systems Corp',
    activeProjectsCount: 1,
    unpaidInvoicesTotal: 7100,
    satisfactionRating: 4.9,
    lastActive: '10 mins ago',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    email: 'victor@aetheriacloud.io'
  },
  {
    id: 'client-2',
    clientName: 'Dr. Evelyn Reed',
    company: 'Hyperion Labs',
    activeProjectsCount: 1,
    unpaidInvoicesTotal: 0,
    satisfactionRating: 5.0,
    lastActive: '2 hours ago',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    email: 'e.reed@hyperionlabs.ai'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1049',
    clientName: 'Aetheria Systems Corp',
    projectName: 'Aetheria Cloud Portal',
    amount: 7100,
    status: 'pending',
    dueDate: '2026-08-05',
    issuedDate: '2026-07-20'
  },
  {
    id: 'inv-1048',
    clientName: 'Hyperion Labs',
    projectName: 'Hyperion AI Engine',
    amount: 14500,
    status: 'paid',
    dueDate: '2026-07-15',
    issuedDate: '2026-07-01'
  },
  {
    id: 'inv-1047',
    clientName: 'Vortex Capital',
    projectName: 'Vortex Finance Mobile',
    amount: 19200,
    status: 'overdue',
    dueDate: '2026-07-10',
    issuedDate: '2026-06-25'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Commit Pushed',
    message: 'Alex Vance pushed 7f9a12c to aetheria-portal:main',
    time: '14 mins ago',
    read: false,
    type: 'commit'
  },
  {
    id: 'n-2',
    title: 'Invoice Payment Received',
    message: 'Hyperion Labs paid invoice #INV-1048 ($14,500)',
    time: '2 hours ago',
    read: false,
    type: 'invoice'
  },
  {
    id: 'n-3',
    title: 'Milestone Signed Off',
    message: 'Dr. Evelyn Reed approved Milestone #2 on Hyperion AI Engine',
    time: 'Yesterday',
    read: true,
    type: 'approval'
  }
];
