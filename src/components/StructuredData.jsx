import { PERSONAL_INFO, HEADLINE, SITE_URL, SOCIAL_LINKS } from '../config/constants';

function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": PERSONAL_INFO.name,
    "alternateName": PERSONAL_INFO.fullName,
    "jobTitle": PERSONAL_INFO.title,
    "description": PERSONAL_INFO.bio,
    "disambiguatingDescription": HEADLINE,
    "url": SITE_URL,
    "image": `${SITE_URL}og-image.png`,
    "sameAs": SOCIAL_LINKS.filter((link) => link.platform !== 'Email').map((link) => link.url),
    "email": `mailto:${PERSONAL_INFO.email}`,
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Kwame Nkrumah University of Science and Technology",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kumasi",
          "addressCountry": "GH"
        }
      },
      {
        "@type": "EducationalOrganization",
        "name": "Azubi Africa"
      }
    ],
    "knowsAbout": [
      "AWS",
      "AWS SAM",
      "Amazon CloudFront",
      "AWS Lambda",
      "Amazon DynamoDB",
      "Amazon API Gateway",
      "Amazon ECS",
      "Amazon RDS",
      "Terraform",
      "Python",
      "FastAPI",
      "Django",
      "PostgreSQL",
      "QGIS",
      "GeoDjango",
      "PostGIS",
      "Spatial analysis",
      "React",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Cloud Computing",
      "Full Stack Development"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": PERSONAL_INFO.title,
      "occupationLocation": {
        "@type": "Country",
        "name": "Ghana"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default StructuredData;
