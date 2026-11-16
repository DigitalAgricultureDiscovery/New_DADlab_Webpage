import type { SiteProfile } from "../src/types/cms.ts";

// Source: user-supplied Personalization Brief v2.0. See docs/content-audit.md.
export const initialProfile: SiteProfile = {
  "reviewNote": "Content review version based on the personalization brief. Publication metadata and historical records await final PI approval.",
  "labName": "Digital Agriculture Discovery Lab",
  "shortTitle": "DAD Lab",
  "department": "Department of Agricultural and Biological Engineering",
  "college": "Purdue University",
  "institution": "Purdue University",
  "heroEyebrow": "",
  "heroHeadline": "Digital Agriculture Discovery Lab",
  "heroSubheadline": "Advancing Agriculture and Natural Resource Management Through Data Science, Artificial Intelligence, and Digital Technologies.",
  "heroImageUrl": "",
  "missionStatement": "The Digital Agriculture Discovery Lab at Purdue University conducts research at the intersection of agricultural engineering, data science, artificial intelligence, remote sensing, and environmental modeling. Led by Dr. Dharmendra Saraswat, the laboratory explores applications of information, communication, and sensing technologies to address challenges in agricultural production and natural resource management.",
  "piName": "Dr. Dharmendra Saraswat",
  "piTitle": "Professor, Department of Agricultural and Biological Engineering",
  "piEmail": "saraswat@purdue.edu",
  "piPhone": "",
  "piOffice": "",
  "piPortraitUrl": "",
  "piBioHtml": "<p>Dr. Dharmendra Saraswat is a Professor in the Department of Agricultural and Biological Engineering at Purdue University. His research focuses on applications of information and communication technologies for addressing challenges in agricultural production and natural resource management.</p><p>His work spans digital agriculture, remote sensing, geographic information systems, environmental modeling, spatial data analysis, and decision-support technologies, with interdisciplinary collaborations applying emerging computational technologies to agricultural and environmental problems.</p><p>Before joining Purdue, he held academic and research positions at the University of Arkansas, the Indian Council of Agricultural Research in New Delhi, and Chandra Shekhar Azad University of Agriculture and Technology in Kanpur, India.</p>",
  "piEducation": [
    "Ph.D., 2007 \u2014 The Ohio State University, Food, Agricultural and Biological Engineering",
    "M.S., 1990 \u2014 Indian Agricultural Research Institute, New Delhi, Agricultural Engineering"
  ],
  "piHonors": [
    "2023 \u2014 Fulbright U.S. Scholar Award",
    "2022 \u2014 USDA-NIFA Excellence in Multistate Research Team Award",
    "2022 \u2014 Purdue Agricultural and Biological Engineering Outstanding Faculty Mentor Award",
    "2021 \u2014 Outstanding Educator Award, SHUATS",
    "2019 \u2014 ASABE ITSC Best Paper Award",
    "2018 \u2014 ASABE Standards Award",
    "2014 \u2014 Fellow, Indian Society of Agricultural Engineers"
  ],
  "labAddress": "Purdue University, West Lafayette, Indiana",
  "officeHours": "",
  "googleScholarUrl": "",
  "orcidUrl": "",
  "githubUrl": "",
  "homeLimits": {
    "projects": 4,
    "news": 3,
    "publications": 4,
    "opportunities": 3
  },
  "teamMembers": [
    {
      "id": "pi-saraswat",
      "name": "Dr. Dharmendra Saraswat",
      "role": "Principal Investigator",
      "category": "Faculty",
      "focus": "Digital agriculture, agricultural informatics, remote sensing, and environmental modeling",
      "email": "saraswat@purdue.edu"
    }
  ],
  "researchAreas": [
    {
      "id": "area-1",
      "title": "Artificial Intelligence and Machine Learning for Agriculture",
      "description": "Machine learning, deep learning, crop disease detection, image analysis, and predictive modeling for agricultural production systems.",
      "imageUrl": ""
    },
    {
      "id": "area-2",
      "title": "Remote Sensing and Precision Agriculture",
      "description": "UAV imagery, remote sensing, and geospatial data for crop monitoring and location-specific agricultural management.",
      "imageUrl": ""
    },
    {
      "id": "area-3",
      "title": "Digital Agriculture and Decision Support",
      "description": "Digital tools, mobile technologies, and cloud-based platforms for agricultural data analysis and decision support.",
      "imageUrl": ""
    },
    {
      "id": "area-4",
      "title": "Environmental and Watershed Modeling",
      "description": "Hydrological modeling, geospatial analysis, and simulation of water quality and agricultural land management.",
      "imageUrl": ""
    },
    {
      "id": "area-5",
      "title": "Agricultural Informatics and Education",
      "description": "Computational thinking, data science, software development, and informatics education for agricultural students and professionals.",
      "imageUrl": ""
    }
  ],
  "teachingOverview": "Dr. Saraswat has led agricultural informatics and data science curriculum development supported by USDA-NIFA, including computational thinking, open-source technologies, data analysis, experiential learning, and problem-based education."
};
export const initialRecords = {
  "publications": [
    {
      "id": 1,
      "title": "SPEAR-NeXT: Causal Latent Forecasting Across Multiple Horizons for Spectral\u2013Temporal Earth Representation Learning.",
      "authors": "Ranjan, R., Singh, U., Tamaskar, S., and Saraswat, D.",
      "year": 2026,
      "venue": "arXiv preprint",
      "pub_type": "Preprint",
      "topic": "Remote Sensing and Precision Agriculture",
      "abstract": "",
      "doi_url": "",
      "publisher_url": "",
      "pdf_url": "",
      "bibtex": "",
      "featured_on_home": 1,
      "status": "published"
    },
    {
      "id": 2,
      "title": "A two-stage deep-learning based segmentation model for crop disease quantification based on corn field imagery.",
      "authors": "Divyanth, L. G., Ahmad, A., and Saraswat, D.",
      "year": 2023,
      "venue": "Smart Agricultural Technology, 3, 100108",
      "pub_type": "Journal Article",
      "topic": "Artificial Intelligence and Machine Learning for Agriculture",
      "abstract": "",
      "doi_url": "",
      "publisher_url": "",
      "pdf_url": "",
      "bibtex": "",
      "featured_on_home": 1,
      "status": "published"
    },
    {
      "id": 3,
      "title": "Deep Learning-Based Object Detection System for Identifying Weeds Using UAS Imagery.",
      "authors": "Etienne, A., Ahmad, A., Aggarwal, V., and Saraswat, D.",
      "year": 2021,
      "venue": "Remote Sensing, 13(24), 5182",
      "pub_type": "Journal Article",
      "topic": "Remote Sensing and Precision Agriculture",
      "abstract": "",
      "doi_url": "",
      "publisher_url": "https://www.mdpi.com/2072-4292/13/24/5182",
      "pdf_url": "",
      "bibtex": "",
      "featured_on_home": 1,
      "status": "published"
    },
    {
      "id": 4,
      "title": "Development and evaluation of targeted marginal land mapping approach in SWAT model for simulating water quality impacts of selected second generation biofeedstock.",
      "authors": "Singh, G., and Saraswat, D.",
      "year": 2016,
      "venue": "Environmental Modelling & Software, 81, 26\u201339",
      "pub_type": "Journal Article",
      "topic": "Environmental and Watershed Modeling",
      "abstract": "",
      "doi_url": "",
      "publisher_url": "",
      "pdf_url": "",
      "bibtex": "",
      "featured_on_home": 1,
      "status": "published"
    },
    {
      "id": 5,
      "title": "Smartphone-based hierarchical crowdsourcing for weed identification.",
      "authors": "Rahman, M., Blackwell, B., Banerjee, N., and Saraswat, D.",
      "year": 2015,
      "venue": "Computers and Electronics in Agriculture, 113, 14\u201323",
      "pub_type": "Journal Article",
      "topic": "Digital Agriculture and Decision Support",
      "abstract": "",
      "doi_url": "",
      "publisher_url": "",
      "pdf_url": "",
      "bibtex": "",
      "featured_on_home": 1,
      "status": "published"
    },
    {
      "id": 6,
      "title": "A geospatial tool for delineating streambanks.",
      "authors": "Pai, N., and Saraswat, D.",
      "year": 2013,
      "venue": "Environmental Modelling & Software, 40, 151\u2013159",
      "pub_type": "Journal Article",
      "topic": "Environmental and Watershed Modeling",
      "abstract": "",
      "doi_url": "",
      "publisher_url": "",
      "pdf_url": "",
      "bibtex": "",
      "featured_on_home": 1,
      "status": "published"
    }
  ],
  "projects": [
    {
      "id": 1,
      "slug": "crop-disease-detection",
      "title": "AI-Based Crop Disease Detection and Forecasting",
      "research_area": "Artificial Intelligence and Machine Learning for Agriculture",
      "overview": "Historical research on deep learning for crop disease identification and forecasting, including bacterial blight in rice and an early-warning framework in collaboration with scientists at the Indian Agricultural Research Institute. Current active status requires confirmation.",
      "objectives_html": "",
      "methodology_html": "",
      "progress_notes": "Historical research activity / established theme; not a claim of current project funding or active status.",
      "image_url": "",
      "image_caption": "",
      "project_status": "archived",
      "related_publication_ids_json": "[2]",
      "collaborators": "Indian Agricultural Research Institute",
      "funding_info": "",
      "featured_on_home": 1,
      "publish_status": "published"
    },
    {
      "id": 2,
      "slug": "uav-plant-analysis",
      "title": "UAV Imagery and Plant Analysis",
      "research_area": "Remote Sensing and Precision Agriculture",
      "overview": "Established research theme using unmanned aerial systems imagery for crop monitoring, weed detection, and image-based crop disease assessment. Specific active projects require confirmation.",
      "objectives_html": "",
      "methodology_html": "",
      "progress_notes": "Historical research activity / established theme; not a claim of current project funding or active status.",
      "image_url": "",
      "image_caption": "",
      "project_status": "archived",
      "related_publication_ids_json": "[2, 3]",
      "collaborators": "",
      "funding_info": "",
      "featured_on_home": 1,
      "publish_status": "published"
    },
    {
      "id": 3,
      "slug": "watershed-water-quality",
      "title": "Watershed and Water Quality Simulation",
      "research_area": "Environmental and Watershed Modeling",
      "overview": "Established body of research using SWAT, hydrological modeling, and geospatial analysis to investigate land-use representation, water quality, and streambank delineation.",
      "objectives_html": "",
      "methodology_html": "",
      "progress_notes": "Historical research activity / established theme; not a claim of current project funding or active status.",
      "image_url": "",
      "image_caption": "",
      "project_status": "archived",
      "related_publication_ids_json": "[4, 6]",
      "collaborators": "",
      "funding_info": "",
      "featured_on_home": 1,
      "publish_status": "published"
    },
    {
      "id": 4,
      "slug": "agricultural-informatics",
      "title": "Agricultural Informatics Curriculum Development",
      "research_area": "Agricultural Informatics and Education",
      "overview": "Documented USDA-NIFA-supported educational initiative led by Dr. Saraswat with Purdue University, the University of Kentucky, and Tuskegee University. The initiative addressed computational thinking, data analysis, software development, and experiential agricultural education.",
      "objectives_html": "",
      "methodology_html": "",
      "progress_notes": "Historical research activity / established theme; not a claim of current project funding or active status.",
      "image_url": "",
      "image_caption": "",
      "project_status": "archived",
      "related_publication_ids_json": "[]",
      "collaborators": "Purdue University; University of Kentucky; Tuskegee University",
      "funding_info": "USDA-NIFA (documented educational initiative)",
      "featured_on_home": 1,
      "publish_status": "published"
    }
  ],
  "courses": [
    {
      "course_number": "ASM 54000",
      "title": "Geographic Information System Application",
      "semester": "",
      "academic_year": "",
      "description_html": "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
      "topics_json": "[]",
      "objectives_json": "[]",
      "syllabus_url": "",
      "materials_json": "[]",
      "university_catalog_url": "",
      "status": "draft",
      "featured_on_home": 0
    },
    {
      "course_number": "ASM 59100",
      "title": "Hands-On Introduction to AI",
      "semester": "",
      "academic_year": "",
      "description_html": "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
      "topics_json": "[]",
      "objectives_json": "[]",
      "syllabus_url": "",
      "materials_json": "[]",
      "university_catalog_url": "",
      "status": "draft",
      "featured_on_home": 0
    },
    {
      "course_number": "ABE 49500",
      "title": "Modeling and Computational Tools in Biological Engineering (title to verify)",
      "semester": "",
      "academic_year": "",
      "description_html": "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
      "topics_json": "[]",
      "objectives_json": "[]",
      "syllabus_url": "",
      "materials_json": "[]",
      "university_catalog_url": "",
      "status": "draft",
      "featured_on_home": 0
    },
    {
      "course_number": "ASM 49000",
      "title": "Special Problems",
      "semester": "",
      "academic_year": "",
      "description_html": "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
      "topics_json": "[]",
      "objectives_json": "[]",
      "syllabus_url": "",
      "materials_json": "[]",
      "university_catalog_url": "",
      "status": "draft",
      "featured_on_home": 0
    },
    {
      "course_number": "ILS 59500",
      "title": "Visual Media Smart (title to verify)",
      "semester": "",
      "academic_year": "",
      "description_html": "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
      "topics_json": "[]",
      "objectives_json": "[]",
      "syllabus_url": "",
      "materials_json": "[]",
      "university_catalog_url": "",
      "status": "draft",
      "featured_on_home": 0
    }
  ],
  "news": [
    {
      "slug": "fulbright-2023",
      "title": "Fulbright U.S. Scholar Recognition (2023\u20132024)",
      "category": "Award",
      "published_date": "2023",
      "summary": "Dr. Dharmendra Saraswat was selected as a Fulbright U.S. Scholar for India for 2023\u20132024, involving collaboration with the Indian Agricultural Research Institute in New Delhi.",
      "content_html": "<p>Dr. Dharmendra Saraswat was selected as a Fulbright U.S. Scholar for India for 2023\u20132024, involving collaboration with the Indian Agricultural Research Institute in New Delhi.</p><p>Historical announcement. Year supplied in the content brief; exact announcement date and source link await migration verification.</p>",
      "image_url": "",
      "image_caption": "",
      "featured_on_home": 0,
      "status": "archived",
      "author_name": "DAD Lab"
    },
    {
      "slug": "faculty-mentor-2022",
      "title": "Faculty Mentoring Recognition",
      "category": "Award",
      "published_date": "2022",
      "summary": "Dr. Saraswat received the Outstanding Faculty Mentor Award from Purdue\u2019s Department of Agricultural and Biological Engineering in 2022.",
      "content_html": "<p>Dr. Saraswat received the Outstanding Faculty Mentor Award from Purdue\u2019s Department of Agricultural and Biological Engineering in 2022.</p><p>Historical announcement. Year supplied in the content brief; exact announcement date and source link await migration verification.</p>",
      "image_url": "",
      "image_caption": "",
      "featured_on_home": 0,
      "status": "archived",
      "author_name": "DAD Lab"
    },
    {
      "slug": "informatics-curriculum-2020",
      "title": "Agricultural Informatics Curriculum Initiative",
      "category": "Research Development",
      "published_date": "2020",
      "summary": "A multidisciplinary team led by Dr. Saraswat received USDA-NIFA Higher Education Challenge funding to develop agricultural informatics education resources with partner institutions in 2020.",
      "content_html": "<p>A multidisciplinary team led by Dr. Saraswat received USDA-NIFA Higher Education Challenge funding to develop agricultural informatics education resources with partner institutions in 2020.</p><p>Historical announcement. Year supplied in the content brief; exact announcement date and source link await migration verification.</p>",
      "image_url": "",
      "image_caption": "",
      "featured_on_home": 0,
      "status": "archived",
      "author_name": "DAD Lab"
    }
  ]
};
