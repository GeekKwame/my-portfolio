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
    summary: 'A hands-on QGIS study that places 20 synthetic cocoa plots in Western North alongside districts, roads, towns, and mapped tree cover loss.',
    highlight: '20 valid farm polygons across nine districts, with no overlapping pairs or missing area and district attributes.',
    image: {
      src: cocoaBeltImage,
      width: 2572,
      height: 1818,
      kind: 'diagram',
      caption: 'Western North, Ghana: synthetic farm locations and Hansen tree-cover loss, 2021–2024. Sources: OCHA / HDX; © OpenStreetMap contributors; Hansen/UMD/Google/USGS/NASA.',
      alt: 'Map of Western North showing nine districts, towns, major roads, 20 synthetic farm location markers and annual tree-cover loss from 2021 to 2024.',
    },
    problem: 'I wanted a reproducible map that made the training farms easy to understand in relation to district boundaries, roads, towns, and forest change, without hiding the limits of the data.',
    approach: 'I focused on Western North and its nine districts, clipped OpenStreetMap roads and settlements, and moved the analysis layers into UTM zone 30N. I calculated farm areas, joined every plot to its district, clipped the Hansen loss-year data, and packaged the finished layers in a GeoPackage. A PyQGIS script exports the attributed A4 map.',
    decision: 'I used EPSG:32630 so area measurements would be meaningful in metres and preserved the categorical loss-year values during raster reprojection. The farms are synthetic training data, and the forest-loss layer adds context rather than proving deforestation or compliance status.',
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
    summary: 'A FastAPI service that gives clients secure S3 upload and download links, keeping large file bytes out of the API while isolating every tenant.',
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
      'The service needed to move files without forcing the API to stream every byte, while making one tenant’s files completely invisible to every other tenant.',
    approach:
      'I placed FastAPI on ECS Fargate in private subnets behind an ALB spanning two availability zones. RDS PostgreSQL stores the metadata through SQLAlchemy 2.0, while files travel directly between the client and S3 through presigned URLs. Twelve Terraform modules define separate development, staging, and production environments.',
    decision:
      'I scope every query by tenant and identify files with UUIDv4 values. Cross-tenant reads return 404 instead of 403, so a tenant cannot use the response to discover another tenant’s files. API keys are stored as SHA-256 hashes and compared in constant time.',
    evidence: [
      '12 test functions cover the API lifecycle and tenant-isolation behavior; CI runs Ruff and pytest on Python 3.11 and 3.12.',
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
    summary: 'A simpler way for KNUST students to book clinic appointments, join a live virtual queue, and check in with a reference code instead of a password.',
    highlight: 'The current repository documents 471 backend tests and 34 authored Playwright scenarios, with the browser suite running in CI against MongoDB.',
    image: {
      src: yencareImage,
      width: 1485,
      height: 697,
      kind: 'screenshot',
      caption: 'Patient-facing home screen for the KNUST Students’ Clinic',
      alt: 'YɛnCare home screen for the KNUST Students’ Clinic, with booking actions and live queue status.',
    },
    problem:
      'The clinic needed self-service booking and live queue updates without asking every student to create an account. Staff also needed one workspace for reception, doctors, and administrators.',
    approach:
      'Our five-person team built a React PWA backed by an Express API and MongoDB through Mongoose. Staff sign in with JWTs mapped to receptionist, doctor, and admin roles. The frontend runs on Vercel and the API on Render.',
    decision:
      'Students use a reference code and phone number instead of an account. Because that code acts as the main secret, check-in and queue-status requests are rate limited by client IP and reference code, returning HTTP 429 when the limit is reached.',
    evidence: [
      'The current default branch documents 471 backend tests; 34 authored Playwright scenarios expand to 70 configured browser-project executions.',
      'Pull-request CI runs the backend suite against MongoDB 7 and builds the frontend; a second workflow runs Playwright across Chromium, Firefox, and WebKit against a replica set.',
      'Built by a team of five; I authored 121 commits in the shared repository.',
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
    summary: 'A serverless event registration system where guests can discover an event, register, and receive a ticket without exposing the underlying AWS API.',
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
      'Guests needed a smooth way to browse events, register, receive a ticket, and recover it by email. Administrators needed to view and cancel registrations without opening the API to direct public traffic.',
    approach:
      'I used CloudFront to serve the UI from a private S3 bucket and forward API calls to API Gateway as a hidden origin. Five Python Lambda functions store tickets in encrypted DynamoDB tables, SES sends confirmations, and SNS notifies administrators.',
    decision:
      'DynamoDB is the source of truth for every ticket; browser storage is only a convenience. CloudFront adds an origin secret to each request, and both the WAF and the Lambda functions reject traffic that arrives without it.',
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
    summary: 'A command-line scanner that spots five common AWS mistakes linked to leaked keys and surprise bills, then gives passing projects a README badge.',
    approach:
      'I check for hardcoded credentials, public S3 buckets, GitHub Actions that use static keys instead of OIDC, overly broad IAM policies, and missing budget alerts. CI runs 42 tests across Python 3.9, 3.11, and 3.12, followed by a smoke test of the scanner itself.',
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
    summary: 'A music discovery experience for independent African artists, with full-length Audius streaming and a player that keeps going as you move around the site.',
    approach:
      'Django creates short-lived signed stream URLs only when they are needed and never stores them. Per-client rate limits and timeouts protect the integration. CI runs 73 Django tests and 17 Node tests against PostgreSQL 16, then checks for missing migrations.',
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
    summary: 'A web map for exploring synthetic farm and forest parcels in Ghana, stored as PostGIS polygons and served to Leaflet as GeoJSON.',
    approach:
      'I calculate areas in hectares by reprojecting every polygon to UTM zone 30N instead of measuring in degrees. A GeoJSON endpoint supports bulk parcel imports, Docker Compose starts PostGIS and the app together, and CI runs Ruff and pytest against a PostGIS service.',
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
    summary: 'A prototype for arranging non-emergency dialysis transport, from clinic referrals to vehicle assignment for both legs of the journey.',
    approach:
      'I built the API with FastAPI, SQLAlchemy 2, and Pydantic 2, then containerised it with Docker. Gemini, OpenAI, and Claude sit behind one interchangeable interface. CI runs Ruff and 18 pytest tests, and all demo data is invented.',
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
    summary: 'A serverless notification flow where one API request reaches DynamoDB, SNS, SQS, and EventBridge without making the client wait for every downstream task.',
    approach:
      'API Gateway invokes an ingestion Lambda. SNS and SQS failures are logged without failing the original request, while a CloudWatch alarm watches for Lambda errors. AWS SAM defines the system, and CI runs pytest with moto before validating the template.',
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
    summary: 'A static site on private S3 behind CloudFront, deployed from GitHub Actions without storing a long-lived AWS access key.',
    approach:
      'Each workflow run assumes an IAM role through GitHub’s OIDC provider and receives temporary STS credentials. Terraform manages the bucket, CloudFront with Origin Access Control, the ACM certificate, and the Route 53 records.',
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
    summary: 'A small Flask notes API packaged with PostgreSQL and nginx on Docker Compose, including TLS, a non-root container, and health-checked startup.',
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
    summary: 'A focused Terraform lab for API Gateway, Lambda, and S3, with remote state in S3 and DynamoDB locking.',
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
    summary: 'A five-person capstone that took a static study planner from an EC2 instance to an ALB and CloudFront, documented across five project phases.',
    stack: ['EC2', 'ALB', 'Auto Scaling', 'CloudFront', 'S3', 'CloudWatch'],
    links: { source: 'https://github.com/GeekKwame/student-student-planner' },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.tier === 'featured');
export const ADDITIONAL_PROJECTS = PROJECTS.filter((p) => p.tier === 'additional');
export const SUPPORTING_PROJECTS = PROJECTS.filter((p) => p.tier === 'supporting');

export const projectHref = (slug) => `/projects#${slug}`;
