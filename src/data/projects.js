import fileServiceImage from '../assets/images/portfolio/file-server.webp';
import yencareImage from '../assets/images/portfolio/yencare-platform.webp';
import eventConnectImage from '../assets/images/portfolio/event-connect.webp';
import { FLAGSHIP } from '../config/constants';

/**
 * Case studies, in display order. `featured` projects get the full case-study
 * layout; the rest render as one-line entries. `slug` doubles as the anchor id
 * (`work-<slug>`), so changing it breaks inbound links from the hero and skills.
 */
export const PROJECTS = [
  {
    slug: 'file-service',
    title: 'Multi-Tenant File Service API',
    shortTitle: 'File Service API',
    summary: 'Multi-tenant uploads through presigned S3 URLs on ECS Fargate',
    category: 'Backend · Cloud',
    featured: true,
    image: {
      src: fileServiceImage,
      width: 1508,
      height: 1024,
      kind: 'diagram',
      caption: 'Production architecture: ALB, ECS Fargate, RDS PostgreSQL, S3',
      alt: 'Architecture diagram: an Application Load Balancer routes requests to FastAPI containers on Amazon ECS Fargate, which query RDS PostgreSQL and issue presigned URLs for an S3 bucket.',
    },
    problem:
      'Clients need to upload and retrieve files without the API ever streaming bytes, while keeping tenants strictly isolated.',
    approach:
      'An ALB across two availability zones fronts FastAPI on ECS Fargate in private subnets. Metadata lives in RDS PostgreSQL 16 through SQLAlchemy 2.0; binaries land in S3 as {app_id}/{uuid}-{filename} via presigned PUT and GET. Terraform defines the topology across 12 modules and 3 environments.',
    decision:
      'Every query is scoped by app_id and files are addressed by UUIDv4. Cross-tenant reads return 404, so a tenant cannot even confirm another tenant’s file exists. API keys are SHA-256 hashed and compared in constant time.',
    stack: ['FastAPI', 'ECS Fargate', 'RDS', 'S3', 'Terraform', 'Docker', 'GitHub Actions'],
    links: { source: 'https://github.com/GeekKwame/file-service-server' },
  },
  {
    slug: 'event-connect',
    title: 'Event-Connect: Serverless Event Registration',
    shortTitle: 'Event-Connect',
    summary: 'Serverless registration behind CloudFront and AWS WAF',
    category: 'Serverless',
    featured: true,
    image: {
      src: eventConnectImage,
      width: 1536,
      height: 1024,
      kind: 'diagram',
      caption: 'Production architecture: CloudFront, WAF, API Gateway, Lambda, DynamoDB',
      alt: 'Architecture diagram: CloudFront serves a private S3 site and routes API calls to API Gateway behind AWS WAF, which invokes Lambda functions backed by DynamoDB, with SNS and SES notifications.',
    },
    problem:
      'Attendees browse events, register, and receive an on-screen ticket; admins list and cancel registrations; attendees can recover tickets by email.',
    approach:
      'CloudFront is the only public HTTPS endpoint. The UI is served from a private S3 bucket through Origin Access Control, and API Gateway sits behind it as a hidden origin. Five Python 3.12 Lambdas persist tickets in DynamoDB; SES sends confirmations and SNS notifies the admin topic.',
    decision:
      'Ticket validity lives in DynamoDB. The browser’s localStorage is a convenience, never the source of truth. The API origin sits behind a default-deny WAF.',
    stack: ['AWS SAM', 'CloudFront', 'Lambda', 'DynamoDB', 'WAF', 'SES', 'SNS', 'Python'],
    links: { source: FLAGSHIP.repo },
  },
  {
    slug: 'yencare',
    title: 'YɛnCare: Outpatient Clinic & Virtual Queue',
    shortTitle: 'YɛnCare',
    summary: 'Clinic booking and a live virtual queue for KNUST students',
    category: 'Full-stack',
    featured: true,
    image: {
      src: yencareImage,
      width: 1485,
      height: 697,
      kind: 'screenshot',
      caption: 'Patient-facing home screen for the KNUST Students’ Clinic',
      alt: 'YɛnCare home screen for the KNUST Students’ Clinic, with booking actions and live queue status.',
    },
    problem:
      'Campus clinics needed self-service booking and live waiting-room updates without password friction, across 70+ responsive views for triage, appointments, and dispatch.',
    approach:
      'An Express REST backend coordinates atomic queue transitions through Prisma and PostgreSQL, and isolates clinical workstation actions behind role-based JWT auth. 270+ Jest and Supertest specs run on GitHub Actions across client and server.',
    decision:
      'Patients check in with a reference code instead of an account. To stop brute-forcing, public check-ins are rate limited in tiers by IP and by reference code, returning HTTP 429.',
    stack: ['React', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Jest', 'GitHub Actions'],
    links: {
      live: 'https://yencare-platform.vercel.app/',
      source: 'https://github.com/GeekKwame/yencare-platform/',
    },
  },
  {
    slug: 'kora',
    title: 'KORA: African Music Discovery & Streaming',
    shortTitle: 'KORA',
    summary: 'Full-length streaming of independent African music from the Audius API',
    category: 'Full-stack',
    problem:
      'Spotify and Deezer expose only metadata or 30-second previews to third-party apps, so a public site cannot legally play full commercial tracks. African genres also have few dedicated discovery interfaces.',
    approach:
      'A provider layer normalizes Audius and optional Spotify metadata into one track model with explicit playback modes. Django resolves short-lived signed stream URLs on demand and never stores them, while browsers stream MP3 directly from Audius nodes. Collections for Afrobeats, Amapiano, Highlife and more are built from named searches, cached in memory per session, and protected by timeouts, per-client rate limits and a circuit breaker.',
    decision:
      'One client-side controller owns the only <audio> element. In-app navigation swaps the page shell around it, so playback survives page changes. Expired stream URLs are re-resolved and resume in place, and restricted tracks link out instead of being faked. 73 Django and 17 Node tests run offline in CI.',
    stack: ['Django', 'Audius API', 'HTML5 Audio', 'PostgreSQL', 'JavaScript', 'Render', 'GitHub Actions'],
    links: {
      live: 'https://kora-music-player.onrender.com',
      source: 'https://github.com/GeekKwame/kora-music-player',
    },
  },
  {
    slug: 'smart-task',
    title: 'Smart Task Notification System',
    shortTitle: 'Smart Task',
    summary: 'Event-driven fan-out on Lambda, SNS, SQS, and EventBridge',
    category: 'Serverless',
    problem:
      'A single write should fan out to DynamoDB, SNS, SQS, and EventBridge without making the client wait on downstream delivery.',
    approach:
      'API Gateway invokes an ingestion Lambda; SNS and SQS failures are logged without failing the request. CloudWatch metrics, a Lambda-error alarm, and CloudTrail provide telemetry and audit. Declared in AWS SAM, tested with pytest and moto in CI.',
    stack: ['AWS SAM', 'Lambda', 'DynamoDB', 'SNS', 'SQS', 'EventBridge', 'Pytest'],
    links: { source: 'https://github.com/GeekKwame/SmartTaskNotificationSystem' },
  },
  {
    slug: 'study-planner',
    title: 'Student Study Planner: AWS Capstone',
    shortTitle: 'Study Planner',
    summary: 'Highly available EC2 web tier behind CloudFront',
    category: 'Cloud infrastructure',
    problem:
      'Host an interactive study planner on highly available AWS infrastructure with automated SSL and CI/CD.',
    approach:
      'Route 53 and CloudFront front an ALB and an EC2 Auto Scaling group running Nginx; static assets sit in S3 behind OAC. The ALB only accepts the CloudFront managed prefix list and instances only accept the ALB. CloudWatch CPU and 5xx alarms plus AWS Budgets alerts.',
    stack: ['CloudFront', 'ALB', 'Auto Scaling', 'EC2', 'S3', 'ACM', 'GitHub Actions'],
    links: { source: 'https://github.com/GeekKwame/student-student-planner' },
  },
  {
    slug: 'pulsevote',
    title: 'PulseVote: Live Polling',
    shortTitle: 'PulseVote',
    summary: 'Real-time polling with zero-downtime deploys',
    category: 'Cloud infrastructure',
    problem:
      'Run a real-time polling app with high-availability routing, automated SSL, and zero-downtime deploys.',
    approach:
      'CloudFront, ALB, EC2, S3, and ACM, deployed with zero downtime through GitHub Actions over SCP and SSH. ALB ingress is restricted to the CloudFront managed prefix list; CloudWatch alarms watch CPU and ALB 5xx rates.',
    stack: ['CloudFront', 'ALB', 'EC2', 'S3', 'ACM', 'Nginx', 'CloudWatch'],
    links: { source: 'https://github.com/GeekKwame/pulsevote' },
  },
  {
    slug: 'terraformed',
    title: 'Terraformed: Static Site with Zero-Secret Deploys',
    shortTitle: 'Terraformed',
    summary: 'OIDC-federated GitHub Actions deploys, no stored AWS keys',
    category: 'Infrastructure as code',
    problem:
      'Deploy a static site without storing a single long-lived AWS access key in repository secrets.',
    approach:
      'S3 behind CloudFront Origin Access Control. Each GitHub Actions run requests short-lived STS credentials through IAM OIDC federation. Terraform state lives in encrypted S3 with DynamoDB locking.',
    stack: ['Terraform', 'S3', 'CloudFront', 'IAM OIDC', 'GitHub Actions', 'DynamoDB'],
    links: { source: 'https://github.com/GeekKwame/terraformed-project' },
  },
  {
    slug: 'serverless-api',
    title: 'Serverless API on Terraform',
    shortTitle: 'Serverless API',
    summary: 'API Gateway, Lambda, and S3 provisioned entirely in Terraform',
    category: 'Infrastructure as code',
    problem:
      'Provision an API Gateway → Python Lambda → S3 pipeline end to end in Terraform, with nothing created by hand.',
    approach:
      'IAM policies are scoped to specific S3 actions and the API Gateway source ARN. Lambda artifacts deploy idempotently through archive_file and source_code_hash. Remote state uses S3 versioning and DynamoDB locking.',
    stack: ['Terraform', 'Lambda', 'API Gateway', 'S3', 'IAM', 'Python'],
    links: { source: 'https://github.com/GeekKwame/terraform-aws-serverless-api' },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const OTHER_PROJECTS = PROJECTS.filter((p) => !p.featured);

export const projectAnchor = (slug) => `work-${slug}`;
