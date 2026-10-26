import fileServiceImage from '../assets/images/portfolio/file-server.webp';
import yencareImage from '../assets/images/portfolio/yencare-platform.webp';
import eventConnectImage from '../assets/images/portfolio/event-connect.webp';
import cocoaBeltImage from '../assets/images/portfolio/ghana-cocoa-belt.png';

/**
 * Focus areas drive the filter on /projects. A project can sit in several.
 */
export const FOCUS_AREAS = [
  { id: 'cloud', label: 'Cloud & IaC' },
  { id: 'serverless', label: 'Serverless' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'fullstack', label: 'Full-stack products' },
  { id: 'geospatial', label: 'Geospatial' },
  { id: 'tooling', label: 'DevOps & security tooling' },
];

/**
 * Every project, in display order within its tier. See docs/PORTFOLIO.md.
 *
 * tier        'featured' (homepage + full case study), 'additional' (card on /projects),
 *             or 'supporting' (one-line entry on /projects)
 * slug        anchor id on /projects (`/projects#<slug>`); changing it breaks inbound links
 * capability  featured only: the capability this project proves, shown on the homepage card
 * highlight   featured only: one verified engineering fact for the homepage card
 * evidence    optional list of verified facts shown in the case study
 * image       optional; cards fall back to a typographic panel when missing or broken
 * links       `source` and/or `live`; omit `live` unless the demo is reachable
 */
export const PROJECTS = [
  {
    slug: 'ghana-cocoa-belt',
    tier: 'featured',
    title: 'Ghana Cocoa Belt: Mapping Western North',
    shortTitle: 'Ghana Cocoa Belt',
    category: 'Geospatial · Cartography',
    capability: 'Spatial analysis and documented data quality',
    focus: ['geospatial'],
    status: 'Learning project',
    year: '2026',
    summary: 'A QGIS study of 20 synthetic cocoa plots in Western North, Ghana, placing farms alongside districts, roads, towns and mapped tree-cover loss.',
    highlight: '20 valid farm polygons across nine districts, with no overlapping pairs or missing area and district attributes.',
    image: {
      src: cocoaBeltImage,
      width: 2572,
      height: 1818,
      kind: 'diagram',
      caption: 'Western North, Ghana: synthetic farm locations and Hansen tree-cover loss, 2021–2024. Sources: OCHA / HDX; © OpenStreetMap contributors; Hansen/UMD/Google/USGS/NASA.',
      alt: 'Map of Western North showing nine districts, towns, major roads, 20 synthetic farm location markers and annual tree-cover loss from 2021 to 2024.',
    },
    problem: 'Build a reproducible map that explains where training farm plots sit relative to administrative boundaries, infrastructure and forest change, while making data quality and limitations explicit.',
    approach: 'Selected Western North and its nine districts, clipped OSM roads and settlements, and transformed analysis layers to UTM zone 30N. Calculated farm areas, joined each polygon to its district, and clipped Hansen loss-year data using nearest-neighbour resampling. Packaged the layers in a GeoPackage and exported an attributed A4 map with a PyQGIS script.',
    decision: 'Use EPSG:32630 for metric area calculations and preserve categorical loss-year values during raster reprojection. The farm boundaries are synthetic training data; mapped tree-cover loss provides context and does not establish deforestation or compliance status.',
    evidence: [
      '20 synthetic plots covering 71.6 ha across nine districts; zero invalid geometries, overlaps, missing areas or missing district joins.',
      'Six vector layers and the forest-loss raster are included with relative paths, source licences and a CRS decision guide.',
      'The project reopens with all layers valid; the export script rebuilds the A4 PDF and PNG from the included data.',
    ],
    stack: ['QGIS', 'PyQGIS', 'GeoPackage', 'GDAL', 'Spatial joins', 'CRS transformation'],
    links: {
      source: 'https://github.com/GeekKwame/ghana-cocoa-belt-qgis',
      map: '/ghana-cocoa-belt.pdf',
    },
  },
  {
    slug: 'file-service',
    tier: 'featured',
    title: 'Multi-Tenant File Service API',
    shortTitle: 'File Service API',
    category: 'Backend · Cloud',
    capability: 'Backend API design on AWS infrastructure',
    focus: ['backend', 'cloud'],
    status: 'Complete',
    summary: 'A FastAPI service that hands clients presigned S3 URLs, so file bytes never pass through the API, with every tenant strictly isolated.',
    highlight: 'Cross-tenant reads return 404, so one tenant cannot even confirm that another tenant’s file exists.',
    image: {
      src: fileServiceImage,
      width: 1508,
      height: 1024,
      kind: 'diagram',
      caption: 'Production architecture: ALB, ECS Fargate, RDS PostgreSQL, S3',
      alt: 'Architecture diagram: an Application Load Balancer routes requests to FastAPI containers on Amazon ECS Fargate, which query RDS PostgreSQL and issue presigned URLs for an S3 bucket.',
    },
    problem:
      'Apps need to upload and retrieve files without the API streaming the bytes, while keeping each tenant’s files invisible to every other tenant.',
    approach:
      'An ALB across two availability zones fronts FastAPI on ECS Fargate in private subnets. Metadata lives in RDS PostgreSQL through SQLAlchemy 2.0, split into routers, services, and repositories; files go straight to S3 through presigned PUT and GET URLs. Terraform defines the whole topology in 12 modules with dev, staging, and production environments.',
    decision:
      'Every query is scoped by tenant and files are addressed by UUIDv4. Cross-tenant reads return 404 rather than 403, so a tenant cannot probe for other tenants’ files. API keys are stored as SHA-256 hashes and compared in constant time.',
    evidence: [
      '12 tests pass with 82% coverage of the application package; CI runs Ruff and pytest on Python 3.11 and 3.12.',
      'A Terraform workflow plans the dev, staging, and production environments in CI.',
      'Docs cover architecture, cost estimates, deployment, disaster recovery, and a runbook.',
    ],
    stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'ECS Fargate', 'S3', 'Terraform', 'Docker', 'GitHub Actions'],
    links: { source: 'https://github.com/GeekKwame/file-service-server' },
  },
  {
    slug: 'yencare',
    tier: 'featured',
    title: 'YɛnCare: Clinic Booking & Virtual Queue',
    shortTitle: 'YɛnCare',
    category: 'Full-stack',
    capability: 'Product engineering and automated testing',
    focus: ['fullstack', 'backend'],
    status: 'Team project',
    summary: 'Appointment booking and a live virtual queue for the KNUST Students’ Clinic. Students book without a password and check in with a reference code.',
    highlight: '468 backend tests and 34 Playwright end-to-end tests run in CI against a real MongoDB service.',
    image: {
      src: yencareImage,
      width: 1485,
      height: 697,
      kind: 'screenshot',
      caption: 'Patient-facing home screen for the KNUST Students’ Clinic',
      alt: 'YɛnCare home screen for the KNUST Students’ Clinic, with booking actions and live queue status.',
    },
    problem:
      'The clinic needed self-service booking and live queue updates for students without making them create an account, plus a workstation for reception, doctors, and administrators.',
    approach:
      'An Express API on MongoDB through Mongoose, behind a React PWA. Staff sign in with JWTs mapped to three roles: receptionist, doctor, and admin. The frontend is deployed on Vercel and the API on Render.',
    decision:
      'Patients identify themselves with a reference code and phone number instead of an account. Because that code is effectively the only secret, check-in and queue-status requests are rate limited per client IP and reference code, returning HTTP 429.',
    evidence: [
      '468 backend test cases across 40 files, plus 34 Playwright end-to-end tests.',
      'Pull-request CI runs the backend suite against MongoDB 7 and builds the frontend; a second workflow runs Playwright against a replica set.',
      'Built by a team of five; I wrote 121 of the 159 commits.',
    ],
    stack: ['React', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'Playwright', 'GitHub Actions'],
    links: {
      live: 'https://yencare-platform.vercel.app/',
      source: 'https://github.com/GeekKwame/yencare-platform',
    },
  },
  {
    slug: 'event-connect',
    tier: 'featured',
    title: 'Event-Connect: Serverless Event Registration',
    shortTitle: 'Event-Connect',
    category: 'Serverless',
    capability: 'Serverless architecture and edge security',
    focus: ['serverless', 'cloud'],
    status: 'Capstone',
    summary: 'Event registration on AWS Lambda where CloudFront is the only public entry point and the API sits behind a default-deny WAF.',
    highlight: 'Requests that bypass CloudFront are rejected twice: by the WAF, and again by the Lambda origin-secret check.',
    image: {
      src: eventConnectImage,
      width: 1536,
      height: 1024,
      kind: 'diagram',
      caption: 'Production architecture: CloudFront, WAF, API Gateway, Lambda, DynamoDB',
      alt: 'Architecture diagram: CloudFront serves a private S3 site and routes API calls to API Gateway behind AWS WAF, which invokes Lambda functions backed by DynamoDB, with SNS and SES notifications.',
    },
    problem:
      'Attendees browse events, register, and get an on-screen ticket; admins list and cancel registrations; attendees can recover their tickets by email.',
    approach:
      'CloudFront serves the UI from a private S3 bucket through Origin Access Control and forwards /api calls to API Gateway as a hidden origin. Five Python Lambdas store tickets in encrypted DynamoDB tables; SES sends confirmations and SNS notifies admins.',
    decision:
      'Ticket validity lives in DynamoDB; the browser’s localStorage is a convenience, never the source of truth. API Gateway is never called directly: CloudFront injects an origin secret, and both the WAF and the Lambdas reject requests without it.',
    evidence: [
      'The SAM template declares 23 resources, including the WAF web ACL, CloudFront distribution, and three Secrets Manager secrets.',
      '19 tests run with moto before every deploy; the workflow then runs sam build and sam deploy.',
    ],
    stack: ['AWS SAM', 'CloudFront', 'Lambda', 'DynamoDB', 'WAF', 'SES', 'SNS', 'Python'],
    links: { source: 'https://github.com/GeekKwame/event-registration-system-sam' },
  },
  {
    slug: 'keyless',
    tier: 'additional',
    title: 'KeyLess: AWS Security Scanner',
    shortTitle: 'KeyLess',
    category: 'Security tooling',
    focus: ['tooling', 'cloud'],
    status: 'Open source',
    summary: 'A CLI that catches five AWS mistakes behind most leaked keys and surprise bills, and awards a README badge to projects that pass.',
    approach:
      'Checks for hardcoded credentials, public S3 buckets, GitHub Actions using static keys instead of OIDC, admin-level IAM policies, and missing budget alerts. 42 tests run in CI on Python 3.9, 3.11, and 3.12, plus a smoke test of the scanner itself.',
    stack: ['Python', 'boto3', 'IAM', 'Terraform', 'GitHub Actions'],
    links: { source: 'https://github.com/GeekKwame/keyless' },
  },
  {
    slug: 'kora',
    tier: 'additional',
    title: 'KORA: African Music Discovery & Streaming',
    shortTitle: 'KORA',
    category: 'Full-stack',
    focus: ['fullstack', 'backend'],
    status: 'Complete',
    summary: 'Full-length streaming of independent African music through the Audius API, with a player that keeps playing as you move between pages.',
    approach:
      'Django resolves short-lived signed stream URLs on demand and never stores them, behind per-client rate limits and timeouts. 73 Django and 17 Node tests run in CI against PostgreSQL 16, along with a check for missing migrations.',
    stack: ['Django', 'PostgreSQL', 'Audius API', 'JavaScript', 'Render', 'GitHub Actions'],
    links: {
      live: 'https://kora-music-player.onrender.com',
      source: 'https://github.com/GeekKwame/kora-music-player',
    },
  },
  {
    slug: 'asase-gis',
    tier: 'additional',
    title: 'Asase GIS: Land Parcels on a Web Map',
    shortTitle: 'Asase GIS',
    category: 'Geospatial',
    focus: ['geospatial', 'backend'],
    status: 'Prototype',
    summary: 'Farm and forest parcels in Ghana stored as PostGIS polygons, served as GeoJSON, and drawn on a Leaflet map. Uses synthetic demo data.',
    approach:
      'Areas are computed in hectares by reprojecting each polygon to UTM zone 30N (EPSG:32630) instead of measuring in degrees. A GeoJSON endpoint imports parcels in bulk, Docker Compose starts PostGIS and the app together, and CI runs Ruff and pytest against a PostGIS service.',
    stack: ['Django', 'GeoDjango', 'PostGIS', 'Django REST Framework', 'Leaflet', 'Docker Compose'],
    links: { source: 'https://github.com/GeekKwame/asase-gis' },
  },
  {
    slug: 'renal-route',
    tier: 'additional',
    title: 'Renal Route: Dialysis Transport Scheduling',
    shortTitle: 'Renal Route',
    category: 'Backend',
    focus: ['backend'],
    status: 'Prototype',
    summary: 'Booking for non-emergency rides to dialysis: clinic referrals, vehicle assignment for both legs of each trip, and a chat for clinic staff.',
    approach:
      'FastAPI with SQLAlchemy 2 and Pydantic 2, Dockerised, with interchangeable adapters for Gemini, OpenAI, and Claude behind one interface. 18 pytest tests and Ruff run in CI. Demo data is invented.',
    stack: ['FastAPI', 'SQLAlchemy', 'Pydantic', 'Docker', 'pytest'],
    links: { source: 'https://github.com/GeekKwame/renal-route' },
  },
  {
    slug: 'smart-task',
    tier: 'additional',
    title: 'Smart Task Notification System',
    shortTitle: 'Smart Task',
    category: 'Serverless',
    focus: ['serverless', 'cloud'],
    status: 'Complete',
    summary: 'One API write fans out to DynamoDB, SNS, SQS, and EventBridge without making the client wait on downstream delivery.',
    approach:
      'API Gateway invokes an ingestion Lambda; SNS and SQS failures are logged without failing the request, and a CloudWatch alarm watches Lambda errors. Declared in AWS SAM; CI runs pytest with moto and sam validate --lint.',
    stack: ['AWS SAM', 'Lambda', 'DynamoDB', 'SNS', 'SQS', 'EventBridge', 'pytest'],
    links: { source: 'https://github.com/GeekKwame/SmartTaskNotificationSystem' },
  },
  {
    slug: 'terraformed',
    tier: 'additional',
    title: 'Terraformed: Static Site with Keyless Deploys',
    shortTitle: 'Terraformed',
    category: 'Infrastructure as code',
    focus: ['cloud', 'tooling'],
    status: 'Practice project',
    summary: 'A static site on private S3 behind CloudFront, deployed by Terraform from GitHub Actions without a stored AWS access key.',
    approach:
      'Each workflow run assumes an IAM role through GitHub’s OIDC provider and gets short-lived STS credentials. Terraform manages the bucket, CloudFront with Origin Access Control, the ACM certificate, and Route 53 records.',
    stack: ['Terraform', 'S3', 'CloudFront', 'IAM OIDC', 'ACM', 'GitHub Actions'],
    links: { source: 'https://github.com/GeekKwame/terraformed-project' },
  },
  {
    slug: 'compose-notes-api',
    tier: 'supporting',
    title: 'Compose Notes API',
    shortTitle: 'Compose Notes',
    category: 'Docker',
    focus: ['tooling', 'backend'],
    status: 'Small build',
    summary: 'A Flask API, PostgreSQL, and nginx with TLS on Docker Compose: multi-stage image, non-root user, and health-checked startup order.',
    stack: ['Docker Compose', 'Flask', 'PostgreSQL', 'nginx', 'gunicorn'],
    links: { source: 'https://github.com/GeekKwame/compose-notes-api' },
  },
  {
    slug: 'serverless-api',
    tier: 'supporting',
    title: 'Serverless API on Terraform',
    shortTitle: 'Serverless API',
    category: 'Infrastructure as code',
    focus: ['cloud', 'serverless'],
    status: 'Lab',
    summary: 'API Gateway, Lambda, and S3 in Terraform, with remote state in S3 and DynamoDB locking.',
    stack: ['Terraform', 'API Gateway', 'Lambda', 'S3', 'DynamoDB'],
    links: { source: 'https://github.com/GeekKwame/terraform-aws-serverless-api' },
  },
  {
    slug: 'study-planner',
    tier: 'supporting',
    title: 'Student Study Planner: AWS Capstone',
    shortTitle: 'Study Planner',
    category: 'Cloud infrastructure',
    focus: ['cloud'],
    status: 'Team capstone',
    summary: 'A five-person capstone hosting a static study planner on EC2 behind an ALB and CloudFront, documented across five phases.',
    stack: ['EC2', 'ALB', 'Auto Scaling', 'CloudFront', 'S3', 'CloudWatch'],
    links: { source: 'https://github.com/GeekKwame/student-student-planner' },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.tier === 'featured');
export const ADDITIONAL_PROJECTS = PROJECTS.filter((p) => p.tier === 'additional');
export const SUPPORTING_PROJECTS = PROJECTS.filter((p) => p.tier === 'supporting');

export const projectHref = (slug) => `/projects#${slug}`;
