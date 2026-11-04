/**
 * Verified architectural topologies and interactive request/pipeline traces
 * for the four featured engineering case studies.
 * Every metric, resource count, and design invariant comes directly from src/data/projects.js.
 */

export const ARCHITECTURE_TRACES = {
  'file-service': {
    slug: 'file-service',
    shortTitle: 'File Service API',
    title: 'Multi-Tenant File Service API',
    subtitle: 'Zero-stream S3 presigned architecture with strict tenant isolation',
    badge: '12 Terraform Modules · 82% Test Coverage',
    metrics: [
      { label: 'Topology', value: '2 AZs · ECS Fargate' },
      { label: 'Isolation', value: 'UUIDv4 + Cross-Tenant 404' },
      { label: 'Auth', value: 'SHA-256 Constant-Time' },
      { label: 'CI Suite', value: '12 Tests · Py 3.11 & 3.12' },
    ],
    nodes: [
      {
        id: 'alb',
        label: 'AWS ALB',
        sublabel: '2 Availability Zones',
        layer: 'Ingress',
        detail: 'Public Application Load Balancer spanning two availability zones, terminating TLS and routing traffic into private subnets.',
      },
      {
        id: 'fastapi',
        label: 'FastAPI · ECS Fargate',
        sublabel: 'Private Subnets',
        layer: 'Application',
        detail: 'Stateless FastAPI containers in private subnets. Compares SHA-256 hashed API keys in constant time and scopes every call by tenant.',
      },
      {
        id: 'rds',
        label: 'RDS PostgreSQL',
        sublabel: 'SQLAlchemy 2.0',
        layer: 'Metadata Store',
        detail: 'Stores file metadata via routers → services → repositories. Queries are strictly tenant-scoped; missing or foreign UUIDs return 404.',
      },
      {
        id: 's3',
        label: 'Amazon S3',
        sublabel: 'Presigned PUT / GET',
        layer: 'Object Storage',
        detail: 'Clients upload and download bytes directly against S3 using short-lived presigned URLs so file payloads never stream through FastAPI.',
      },
    ],
    scenarios: [
      {
        id: 'presigned-upload',
        name: 'Presigned S3 Upload (Zero-Stream)',
        status: '200 OK · Direct S3 Transfer',
        tone: 'signal',
        summary: 'Client requests an upload slot; API authenticates, records tenant metadata, and returns a presigned S3 PUT URL.',
        steps: [
          {
            nodeId: 'alb',
            action: 'Ingress across 2 AZs',
            protocol: 'HTTPS POST /v1/files/upload-url',
            note: 'ALB forwards request into ECS Fargate tasks running inside private subnets.',
          },
          {
            nodeId: 'fastapi',
            action: 'Constant-time key verification',
            protocol: 'SHA-256 Hash · Constant-Time Compare',
            note: 'API key is hashed with SHA-256 and verified in constant time to prevent timing side-channel leaks.',
          },
          {
            nodeId: 'rds',
            action: 'Tenant-scoped UUIDv4 registration',
            protocol: 'SQLAlchemy 2.0 · INSERT scoped by tenant_id',
            note: 'Repository layer persists file metadata addressed by UUIDv4 under the authenticated tenant.',
          },
          {
            nodeId: 's3',
            action: 'Presigned PUT URL issued',
            protocol: 'Direct Client → S3 Object Stream',
            note: 'Client uploads bytes directly to S3. Zero file bytes pass through the FastAPI memory space.',
          },
        ],
      },
      {
        id: 'cross-tenant-probe',
        name: 'Cross-Tenant UUID Probe Defense',
        status: '404 Not Found · Zero Enumeration',
        tone: 'accent',
        summary: 'Tenant B attempts to read a valid UUIDv4 belonging to Tenant A. System returns 404 rather than 403.',
        steps: [
          {
            nodeId: 'alb',
            action: 'Authenticated Tenant B request',
            protocol: 'HTTPS GET /v1/files/{tenant_a_uuid}',
            note: 'Request arrives with a valid Tenant B API key targeting another tenant’s file UUID.',
          },
          {
            nodeId: 'fastapi',
            action: 'Scope binding to Tenant B',
            protocol: 'Context: tenant_id = tenant_b',
            note: 'Service binds the authenticated tenant context before invoking the repository query.',
          },
          {
            nodeId: 'rds',
            action: 'Scoped lookup returns empty',
            protocol: 'SELECT ... WHERE id = :uuid AND tenant_id = :tenant_b',
            note: 'Because every query is scoped by tenant, Tenant A’s record is invisible at the query boundary.',
          },
          {
            nodeId: 'fastapi',
            action: 'Opaque 404 response',
            protocol: 'HTTP 404 Not Found (Never 403)',
            note: 'Returning 404 instead of 403 ensures one tenant cannot even confirm that another tenant’s file exists.',
          },
        ],
      },
    ],
  },

  'event-connect': {
    slug: 'event-connect',
    shortTitle: 'Event-Connect',
    title: 'Event-Connect: Serverless Event Registration',
    subtitle: 'CloudFront OAC single entry point with dual WAF + Lambda origin-secret defense',
    badge: '23 AWS SAM Resources · 19 Moto Tests',
    metrics: [
      { label: 'Entry Point', value: 'CloudFront OAC Only' },
      { label: 'Edge Defense', value: 'Default-Deny AWS WAF' },
      { label: 'IaC Stack', value: '23 SAM Resources' },
      { label: 'Pre-Deploy CI', value: '19 pytest + moto Tests' },
    ],
    nodes: [
      {
        id: 'cloudfront',
        label: 'CloudFront (OAC)',
        sublabel: 'Single Public Entry',
        layer: 'Global Edge',
        detail: 'Serves the static UI from a private S3 bucket via Origin Access Control and injects a secret header on /api/* origin forwards.',
      },
      {
        id: 'waf',
        label: 'AWS WAF + API Gateway',
        sublabel: 'Default-Deny Web ACL',
        layer: 'Security Gate',
        detail: 'API Gateway acts as a hidden origin behind AWS WAF. Requests missing the CloudFront origin secret are blocked at the edge.',
      },
      {
        id: 'lambda',
        label: '5 Python Lambdas',
        sublabel: 'Origin-Secret Guard',
        layer: 'Compute',
        detail: 'Validates the Secrets Manager origin secret a second time in code before processing event browsing, registration, or ticket recovery.',
      },
      {
        id: 'dynamodb',
        label: 'DynamoDB + SES / SNS',
        sublabel: 'Encrypted Source of Truth',
        layer: 'Persistence & Notify',
        detail: 'Ticket validity lives in encrypted DynamoDB (never trusting browser localStorage); SES emails tickets and SNS alerts admins.',
      },
    ],
    scenarios: [
      {
        id: 'valid-registration',
        name: 'Edge-Verified Registration & Ticket Issue',
        status: '201 Created · DynamoDB + SES',
        tone: 'signal',
        summary: 'Attendee registers through CloudFront; WAF and Lambda both verify the origin secret before issuing a DynamoDB ticket.',
        steps: [
          {
            nodeId: 'cloudfront',
            action: 'Edge routing + origin secret injection',
            protocol: 'HTTPS POST /api/register + X-Origin-Verify',
            note: 'CloudFront forwards the API call and attaches the managed origin secret header.',
          },
          {
            nodeId: 'waf',
            action: 'WAF rule inspection passes',
            protocol: 'AWS WAF Web ACL · Allow',
            note: 'Default-deny WAF confirms the origin secret matches before API Gateway invokes Lambda.',
          },
          {
            nodeId: 'lambda',
            action: 'Secondary secret check & registration',
            protocol: 'Python Lambda · Secrets Manager Match',
            note: 'Lambda verifies the origin secret again and generates a verifiable registration record.',
          },
          {
            nodeId: 'dynamodb',
            action: 'Encrypted write + SES/SNS dispatch',
            protocol: 'DynamoDB PutItem · SES Confirm · SNS Alert',
            note: 'Ticket validity is stored in encrypted DynamoDB; SES emails confirmation and SNS notifies admins.',
          },
        ],
      },
      {
        id: 'direct-bypass',
        name: 'Direct API Gateway Bypass Attempt',
        status: '403 Blocked · Dual-Layer Reject',
        tone: 'accent',
        summary: 'Request attempts to bypass CloudFront and hit API Gateway directly. Rejected at WAF and guarded again in Lambda.',
        steps: [
          {
            nodeId: 'waf',
            action: 'Layer 1: AWS WAF blocks direct call',
            protocol: 'Missing Origin Secret → WAF Block',
            note: 'Direct calls to the API Gateway URL lack the CloudFront-injected header and are rejected immediately by WAF.',
          },
          {
            nodeId: 'lambda',
            action: 'Layer 2: Lambda origin-secret check',
            protocol: 'Defense-in-Depth Handler Guard',
            note: 'Even if WAF were misconfigured, the Lambda handler checks the secret against Secrets Manager and rejects the call.',
          },
        ],
      },
    ],
  },

  'yencare': {
    slug: 'yencare',
    shortTitle: 'YɛnCare',
    title: 'YɛnCare: Clinic Booking & Virtual Queue',
    subtitle: 'Passwordless student check-in protected by dual IP + reference-code rate limiting',
    badge: '468 Backend + 34 Playwright E2E Tests',
    metrics: [
      { label: 'Backend Suite', value: '468 Tests (40 Files)' },
      { label: 'E2E Suite', value: '34 Playwright Tests' },
      { label: 'Rate Guard', value: 'Per-IP + Ref Code (429)' },
      { label: 'Contributions', value: '121 / 159 Commits' },
    ],
    nodes: [
      {
        id: 'pwa',
        label: 'React PWA · Vercel',
        sublabel: 'Patient & Staff UI',
        layer: 'Client',
        detail: 'Students book appointments and check live queue status without creating an account; staff sign in to role-specific workstations.',
      },
      {
        id: 'express',
        label: 'Express API · Render',
        sublabel: 'Dual Rate Limiter + JWT',
        layer: 'API Layer',
        detail: 'Rate-limits check-in and queue polling per client IP and reference code (HTTP 429); issues JWTs mapped to receptionist, doctor, and admin roles.',
      },
      {
        id: 'mongodb',
        label: 'MongoDB 7 · Mongoose',
        sublabel: 'Replica Set Tested in CI',
        layer: 'Database',
        detail: 'Stores bookings, virtual queue positions, and consultation states; tested in CI against a real MongoDB 7 service and replica set.',
      },
      {
        id: 'workstation',
        label: 'Role Workstations',
        sublabel: 'Reception · Doctor · Admin',
        layer: 'Clinic Ops',
        detail: 'Role-gated views let receptionists verify check-ins, doctors advance queue consultations, and administrators manage clinic capacity.',
      },
    ],
    scenarios: [
      {
        id: 'student-checkin',
        name: 'Passwordless Student Check-In & Queue Sync',
        status: '200 OK · Live Queue Position',
        tone: 'signal',
        summary: 'Student checks in with reference code and phone number; rate limiter guards the secret and updates the clinic queue.',
        steps: [
          {
            nodeId: 'pwa',
            action: 'Reference code + phone submission',
            protocol: 'React PWA · Zero-Account Flow',
            note: 'Student enters their booking reference code and phone number—no password required.',
          },
          {
            nodeId: 'express',
            action: 'Per-IP & per-reference-code rate check',
            protocol: 'Rate Limiter Pass (Else HTTP 429)',
            note: 'Because the reference code is the only secret, requests are throttled by both client IP and code.',
          },
          {
            nodeId: 'mongodb',
            action: 'Queue transition in MongoDB 7',
            protocol: 'Mongoose Atomic Update',
            note: 'Booking transitions to checked-in and calculates live queue position.',
          },
          {
            nodeId: 'workstation',
            action: 'Role-scoped workstation update',
            protocol: 'JWT Role Guard · Reception & Doctor',
            note: 'Reception and doctor workstations reflect the updated virtual queue immediately.',
          },
        ],
      },
    ],
  },

  'ghana-cocoa-belt': {
    slug: 'ghana-cocoa-belt',
    shortTitle: 'Ghana Cocoa Belt',
    title: 'Ghana Cocoa Belt: Mapping Western North',
    subtitle: 'Reproducible UTM Zone 30N spatial analysis & PyQGIS cartographic pipeline',
    badge: '20 Plots · 71.6 ha · 9 Districts · 0 Geometry Errors',
    metrics: [
      { label: 'Target CRS', value: 'EPSG:32630 (UTM 30N)' },
      { label: 'Sample Area', value: '20 Plots · 71.6 ha' },
      { label: 'Coverage', value: '9 Districts · 0 Overlaps' },
      { label: 'Output', value: 'GeoPackage + PyQGIS A4' },
    ],
    nodes: [
      {
        id: 'sources',
        label: 'Multi-Source GIS Layers',
        sublabel: 'OCHA · OSM · Synthetic Plots',
        layer: 'Input Data',
        detail: 'Combines OCHA/HDX administrative boundaries, OpenStreetMap roads and towns, Hansen tree-cover loss (2021–2024), and 20 synthetic cocoa plots.',
      },
      {
        id: 'utm',
        label: 'CRS Transformation',
        sublabel: 'EPSG:32630 · UTM Zone 30N',
        layer: 'Projection',
        detail: 'Transforms vector analysis layers to UTM Zone 30N so farm areas are measured accurately in metric hectares (71.6 ha) rather than degrees.',
      },
      {
        id: 'spatial-join',
        label: 'Spatial Join & QA Audit',
        sublabel: '9 Districts · 0 Overlaps',
        layer: 'Validation',
        detail: 'Joins each farm polygon to its Western North district and validates zero invalid geometries, zero overlapping pairs, and zero missing attributes.',
      },
      {
        id: 'pyqgis',
        label: 'Raster Clip & PyQGIS Export',
        sublabel: 'Nearest-Neighbour · GeoPackage',
        layer: 'Cartography',
        detail: 'Clips Hansen loss-year raster with nearest-neighbour resampling to preserve categorical values, packages a GeoPackage, and exports an attributed A4 PDF/PNG.',
      },
    ],
    scenarios: [
      {
        id: 'spatial-pipeline',
        name: 'Reproducible EPSG:32630 Pipeline & QA',
        status: 'Valid GeoPackage · A4 Map Built',
        tone: 'signal',
        summary: 'Reprojects Western North layers to UTM Zone 30N, validates 20 farm polygons across 9 districts, and runs PyQGIS export.',
        steps: [
          {
            nodeId: 'sources',
            action: 'Clip Western North districts & OSM network',
            protocol: '6 Vector Layers + Hansen Loss Raster',
            note: 'Selects Western North and its nine districts, clipping OSM roads and settlements to the study boundary.',
          },
          {
            nodeId: 'utm',
            action: 'Metric projection to EPSG:32630',
            protocol: 'GDAL / QGIS · UTM Zone 30N',
            note: 'Transforms layers to EPSG:32630 for true metric area calculation across all 20 synthetic plots (71.6 ha).',
          },
          {
            nodeId: 'spatial-join',
            action: 'District spatial join & topology audit',
            protocol: '0 Overlaps · 0 Missing Attributes',
            note: 'Every plot joins cleanly to its administrative district with documented data-quality constraints.',
          },
          {
            nodeId: 'pyqgis',
            action: 'Categorical raster clip & scripted A4 export',
            protocol: 'Nearest-Neighbour Resample · PyQGIS PDF/PNG',
            note: 'Preserves categorical loss-year values (2021–2024) and rebuilds the attributed A4 map from relative paths.',
          },
        ],
      },
    ],
  },
};

export const ARCHITECTURE_ORDER = [
  'file-service',
  'event-connect',
  'yencare',
  'ghana-cocoa-belt',
];

