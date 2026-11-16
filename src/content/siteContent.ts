// Website content for the Digital Agriculture Discovery Lab.
//
// This file is the single source of truth for everything the public site shows.
// The site is fully static (GitHub Pages), so content is edited here and
// published by merging the change to `main`; there is no admin backend.
//
// Visibility:
//   - publications: status 'published' shows; 'draft' is hidden.
//   - projects and opportunities: publish_status 'published' shows; 'draft' is hidden.
//   - courses: status 'active' or 'archived' shows; 'draft' is hidden.
//   - news: status 'published' or 'archived' shows; 'draft' is hidden.
//
// Publication links: `publication_url` is where a visitor lands when they click a
// publication card. Use the paper's DOI link (https://doi.org/...) when one exists,
// and only add a link after checking that it opens that exact paper. Leave it empty
// ('') if no verified link exists; the card then stays visible but is not clickable.
import type {
  CourseItem,
  NewsItem,
  OpportunityItem,
  PublicationItem,
  ResearchProjectItem,
  SiteProfile,
} from '../types/cms';

export const profile: SiteProfile = {
  reviewNote: "",
  labName: "Digital Agriculture Discovery Lab",
  shortTitle: "DAD Lab",
  department: "Department of Agricultural and Biological Engineering",
  college: "Purdue University",
  institution: "Purdue University",
  heroEyebrow: "",
  heroHeadline: "Digital Agriculture Discovery Lab",
  heroSubheadline: "Advancing Agriculture and Natural Resource Management Through Data Science, Artificial Intelligence, and Digital Technologies.",
  heroImageUrl: "",
  missionStatement: "The Digital Agriculture Discovery Lab at Purdue University conducts research at the intersection of agricultural engineering, data science, artificial intelligence, remote sensing, and environmental modeling. Led by Dr. Dharmendra Saraswat, the laboratory explores applications of information, communication, and sensing technologies to address challenges in agricultural production and natural resource management.",
  piName: "Dr. Dharmendra Saraswat",
  piTitle: "Professor, Department of Agricultural and Biological Engineering",
  piEmail: "saraswat@purdue.edu",
  piPhone: "",
  piOffice: "",
  piPortraitUrl: "",
  piBioHtml: "<p>Dr. Dharmendra Saraswat is a Professor in the Department of Agricultural and Biological Engineering at Purdue University. His research focuses on applications of information and communication technologies for addressing challenges in agricultural production and natural resource management.</p><p>His work spans digital agriculture, remote sensing, geographic information systems, environmental modeling, spatial data analysis, and decision-support technologies, with interdisciplinary collaborations applying emerging computational technologies to agricultural and environmental problems.</p><p>Before joining Purdue, he held academic and research positions at the University of Arkansas, the Indian Council of Agricultural Research in New Delhi, and Chandra Shekhar Azad University of Agriculture and Technology in Kanpur, India.</p>",
  piEducation: [
    "Ph.D., 2007 — The Ohio State University, Food, Agricultural and Biological Engineering",
    "M.S., 1990 — Indian Agricultural Research Institute, New Delhi, Agricultural Engineering"
  ],
  piHonors: [
    "2023 — Fulbright U.S. Scholar Award",
    "2022 — USDA-NIFA Excellence in Multistate Research Team Award",
    "2022 — Purdue Agricultural and Biological Engineering Outstanding Faculty Mentor Award",
    "2021 — Outstanding Educator Award, SHUATS",
    "2019 — ASABE ITSC Best Paper Award",
    "2018 — ASABE Standards Award",
    "2014 — Fellow, Indian Society of Agricultural Engineers"
  ],
  labAddress: "Purdue University, West Lafayette, Indiana",
  officeHours: "",
  googleScholarUrl: "",
  orcidUrl: "",
  githubUrl: "",
  homeLimits: {
    projects: 4,
    news: 3,
    publications: 4,
    opportunities: 3
  },
  teamMembers: [
    {
      id: "pi-saraswat",
      name: "Dr. Dharmendra Saraswat",
      role: "Principal Investigator",
      category: "Faculty",
      focus: "Digital agriculture, agricultural informatics, remote sensing, and environmental modeling",
      email: "saraswat@purdue.edu"
    }
  ],
  researchAreas: [
    {
      id: "area-1",
      title: "Artificial Intelligence and Machine Learning for Agriculture",
      description: "Machine learning, deep learning, crop disease detection, image analysis, and predictive modeling for agricultural production systems.",
      imageUrl: ""
    },
    {
      id: "area-2",
      title: "Remote Sensing and Precision Agriculture",
      description: "UAV imagery, remote sensing, and geospatial data for crop monitoring and location-specific agricultural management.",
      imageUrl: ""
    },
    {
      id: "area-3",
      title: "Digital Agriculture and Decision Support",
      description: "Digital tools, mobile technologies, and cloud-based platforms for agricultural data analysis and decision support.",
      imageUrl: ""
    },
    {
      id: "area-4",
      title: "Environmental and Watershed Modeling",
      description: "Hydrological modeling, geospatial analysis, and simulation of water quality and agricultural land management.",
      imageUrl: ""
    },
    {
      id: "area-5",
      title: "Agricultural Informatics and Education",
      description: "Computational thinking, data science, software development, and informatics education for agricultural students and professionals.",
      imageUrl: ""
    }
  ],
  teachingOverview: "Dr. Saraswat has led agricultural informatics and data science curriculum development supported by USDA-NIFA, including computational thinking, open-source technologies, data analysis, experiential learning, and problem-based education."
};

export const publications: PublicationItem[] = [
  {
    id: 1,
    title: "SPEAR-NeXT: Causal Latent Forecasting Across Multiple Horizons for Spectral–Temporal Earth Representation Learning.",
    authors: "Ranjan, R., Singh, U., Tamaskar, S., and Saraswat, D.",
    year: 2026,
    venue: "arXiv preprint",
    pub_type: "Preprint",
    topic: "Remote Sensing and Precision Agriculture",
    publication_url: "https://doi.org/10.48550/arXiv.2609.16871",
    doi_url: "https://doi.org/10.48550/arXiv.2609.16871",
    publisher_url: "",
    pdf_url: "",
    abstract: "",
    bibtex: "",
    featured_on_home: true,
    status: "published"
  },
  {
    id: 2,
    title: "A two-stage deep-learning based segmentation model for crop disease quantification based on corn field imagery.",
    authors: "Divyanth, L. G., Ahmad, A., and Saraswat, D.",
    year: 2023,
    venue: "Smart Agricultural Technology, 3, 100108",
    pub_type: "Journal Article",
    topic: "Artificial Intelligence and Machine Learning for Agriculture",
    publication_url: "https://doi.org/10.1016/j.atech.2022.100108",
    doi_url: "https://doi.org/10.1016/j.atech.2022.100108",
    publisher_url: "",
    pdf_url: "",
    abstract: "",
    bibtex: "",
    featured_on_home: true,
    status: "published"
  },
  {
    id: 3,
    title: "Deep Learning-Based Object Detection System for Identifying Weeds Using UAS Imagery.",
    authors: "Etienne, A., Ahmad, A., Aggarwal, V., and Saraswat, D.",
    year: 2021,
    venue: "Remote Sensing, 13(24), 5182",
    pub_type: "Journal Article",
    topic: "Remote Sensing and Precision Agriculture",
    publication_url: "https://doi.org/10.3390/rs13245182",
    doi_url: "https://doi.org/10.3390/rs13245182",
    publisher_url: "https://www.mdpi.com/2072-4292/13/24/5182",
    pdf_url: "",
    abstract: "",
    bibtex: "",
    featured_on_home: true,
    status: "published"
  },
  {
    id: 4,
    title: "Development and evaluation of targeted marginal land mapping approach in SWAT model for simulating water quality impacts of selected second generation biofeedstock.",
    authors: "Singh, G., and Saraswat, D.",
    year: 2016,
    venue: "Environmental Modelling & Software, 81, 26–39",
    pub_type: "Journal Article",
    topic: "Environmental and Watershed Modeling",
    publication_url: "https://doi.org/10.1016/j.envsoft.2015.12.001",
    doi_url: "https://doi.org/10.1016/j.envsoft.2015.12.001",
    publisher_url: "",
    pdf_url: "",
    abstract: "",
    bibtex: "",
    featured_on_home: true,
    status: "published"
  },
  {
    id: 5,
    title: "Smartphone-based hierarchical crowdsourcing for weed identification.",
    authors: "Rahman, M., Blackwell, B., Banerjee, N., and Saraswat, D.",
    year: 2015,
    venue: "Computers and Electronics in Agriculture, 113, 14–23",
    pub_type: "Journal Article",
    topic: "Digital Agriculture and Decision Support",
    publication_url: "https://doi.org/10.1016/j.compag.2014.12.012",
    doi_url: "https://doi.org/10.1016/j.compag.2014.12.012",
    publisher_url: "",
    pdf_url: "",
    abstract: "",
    bibtex: "",
    featured_on_home: true,
    status: "published"
  },
  {
    id: 6,
    title: "A geospatial tool for delineating streambanks.",
    authors: "Pai, N., and Saraswat, D.",
    year: 2013,
    venue: "Environmental Modelling & Software, 40, 151–159",
    pub_type: "Journal Article",
    topic: "Environmental and Watershed Modeling",
    publication_url: "https://doi.org/10.1016/j.envsoft.2012.08.012",
    doi_url: "https://doi.org/10.1016/j.envsoft.2012.08.012",
    publisher_url: "",
    pdf_url: "",
    abstract: "",
    bibtex: "",
    featured_on_home: true,
    status: "published"
  }
];

export const projects: ResearchProjectItem[] = [
  {
    id: 1,
    slug: "crop-disease-detection",
    title: "AI-Based Crop Disease Detection and Forecasting",
    research_area: "Artificial Intelligence and Machine Learning for Agriculture",
    overview: "Historical research on deep learning for crop disease identification and forecasting, including bacterial blight in rice and an early-warning framework in collaboration with scientists at the Indian Agricultural Research Institute. Current active status requires confirmation.",
    objectives_html: "",
    methodology_html: "",
    progress_notes: "Historical research activity / established theme; not a claim of current project funding or active status.",
    image_url: "",
    image_caption: "",
    project_status: "archived",
    related_publication_ids: [
      2
    ],
    collaborators: "Indian Agricultural Research Institute",
    funding_info: "",
    featured_on_home: true,
    publish_status: "published"
  },
  {
    id: 2,
    slug: "uav-plant-analysis",
    title: "UAV Imagery and Plant Analysis",
    research_area: "Remote Sensing and Precision Agriculture",
    overview: "Established research theme using unmanned aerial systems imagery for crop monitoring, weed detection, and image-based crop disease assessment. Specific active projects require confirmation.",
    objectives_html: "",
    methodology_html: "",
    progress_notes: "Historical research activity / established theme; not a claim of current project funding or active status.",
    image_url: "",
    image_caption: "",
    project_status: "archived",
    related_publication_ids: [
      2,
      3
    ],
    collaborators: "",
    funding_info: "",
    featured_on_home: true,
    publish_status: "published"
  },
  {
    id: 3,
    slug: "watershed-water-quality",
    title: "Watershed and Water Quality Simulation",
    research_area: "Environmental and Watershed Modeling",
    overview: "Established body of research using SWAT, hydrological modeling, and geospatial analysis to investigate land-use representation, water quality, and streambank delineation.",
    objectives_html: "",
    methodology_html: "",
    progress_notes: "Historical research activity / established theme; not a claim of current project funding or active status.",
    image_url: "",
    image_caption: "",
    project_status: "archived",
    related_publication_ids: [
      4,
      6
    ],
    collaborators: "",
    funding_info: "",
    featured_on_home: true,
    publish_status: "published"
  },
  {
    id: 4,
    slug: "agricultural-informatics",
    title: "Agricultural Informatics Curriculum Development",
    research_area: "Agricultural Informatics and Education",
    overview: "Documented USDA-NIFA-supported educational initiative led by Dr. Saraswat with Purdue University, the University of Kentucky, and Tuskegee University. The initiative addressed computational thinking, data analysis, software development, and experiential agricultural education.",
    objectives_html: "",
    methodology_html: "",
    progress_notes: "Historical research activity / established theme; not a claim of current project funding or active status.",
    image_url: "",
    image_caption: "",
    project_status: "archived",
    related_publication_ids: [],
    collaborators: "Purdue University; University of Kentucky; Tuskegee University",
    funding_info: "USDA-NIFA (documented educational initiative)",
    featured_on_home: true,
    publish_status: "published"
  }
];

export const courses: CourseItem[] = [
  {
    id: 1,
    course_number: "ASM 54000",
    title: "Geographic Information System Application",
    semester: "",
    academic_year: "2026–2027",
    description_html: "<p>Fundamentals of geographic information systems (GIS) applied to environmental, agricultural, and engineering problems. Students work with spatial data sources, map projections, and metadata; analyze vector and raster data; automate GIS workflows with custom geoprocessing tools; and share their results through dashboards, web apps, and StoryMaps.</p>",
    topics: [],
    objectives: [],
    syllabus_url: "",
    materials: [],
    university_catalog_url: "https://catalog.purdue.edu/preview_course_nopop.php?catoid=19&coid=227381",
    status: "active",
    featured_on_home: false
  },
  {
    id: 2,
    course_number: "ASM 59100",
    title: "Data Visualization and Edge Computing",
    semester: "",
    academic_year: "2026–2027",
    description_html: "<p>A hands-on introduction to data visualization for students new to the field, covering the visualization process through lectures, readings, and current tools. Students also work with IoT sensors for real-time data, edge computing, and deep learning models for computer vision, building a foundation in data analysis and visualization for future applications.</p>",
    topics: [],
    objectives: [],
    syllabus_url: "",
    materials: [
      {
        label: "Course description (Purdue Agricultural & Biological Engineering)",
        url: "https://ag.purdue.edu/department/abe/courses/agriculture-informatics/index.html"
      }
    ],
    university_catalog_url: "https://catalog.purdue.edu/preview_course_nopop.php?catoid=19&coid=227384",
    status: "active",
    featured_on_home: false
  },
  {
    id: 3,
    course_number: "ASM 59100",
    title: "Hands-On Introduction to AI",
    semester: "",
    academic_year: "",
    description_html: "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
    topics: [],
    objectives: [],
    syllabus_url: "",
    materials: [],
    university_catalog_url: "",
    status: "draft",
    featured_on_home: false
  },
  {
    id: 4,
    course_number: "ABE 49500",
    title: "Modeling and Computational Tools in Biological Engineering (title to verify)",
    semester: "",
    academic_year: "",
    description_html: "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
    topics: [],
    objectives: [],
    syllabus_url: "",
    materials: [],
    university_catalog_url: "",
    status: "draft",
    featured_on_home: false
  },
  {
    id: 5,
    course_number: "ASM 49000",
    title: "Special Problems",
    semester: "",
    academic_year: "",
    description_html: "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
    topics: [],
    objectives: [],
    syllabus_url: "",
    materials: [],
    university_catalog_url: "",
    status: "draft",
    featured_on_home: false
  },
  {
    id: 6,
    course_number: "ILS 59500",
    title: "Visual Media Smart (title to verify)",
    semester: "",
    academic_year: "",
    description_html: "<p>Candidate course from the personalization brief. Official title, instructor assignment, semester, and materials require confirmation before publication.</p>",
    topics: [],
    objectives: [],
    syllabus_url: "",
    materials: [],
    university_catalog_url: "",
    status: "draft",
    featured_on_home: false
  }
];

export const news: NewsItem[] = [
  {
    id: 1,
    slug: "fulbright-2023",
    title: "Fulbright U.S. Scholar Recognition (2023–2024)",
    category: "Award",
    published_date: "2023",
    summary: "Dr. Dharmendra Saraswat was selected as a Fulbright U.S. Scholar for India for 2023–2024, involving collaboration with the Indian Agricultural Research Institute in New Delhi.",
    content_html: "<p>Dr. Dharmendra Saraswat was selected as a Fulbright U.S. Scholar for India for 2023–2024, involving collaboration with the Indian Agricultural Research Institute in New Delhi.</p><p>Historical announcement. Year supplied in the content brief; exact announcement date and source link await migration verification.</p>",
    image_url: "",
    image_caption: "",
    source_url: "",
    attachments: [],
    featured_on_home: false,
    status: "archived",
    author_name: "DAD Lab"
  },
  {
    id: 2,
    slug: "faculty-mentor-2022",
    title: "Faculty Mentoring Recognition",
    category: "Award",
    published_date: "2022",
    summary: "Dr. Saraswat received the Outstanding Faculty Mentor Award from Purdue’s Department of Agricultural and Biological Engineering in 2022.",
    content_html: "<p>Dr. Saraswat received the Outstanding Faculty Mentor Award from Purdue’s Department of Agricultural and Biological Engineering in 2022.</p><p>Historical announcement. Year supplied in the content brief; exact announcement date and source link await migration verification.</p>",
    image_url: "",
    image_caption: "",
    source_url: "",
    attachments: [],
    featured_on_home: false,
    status: "archived",
    author_name: "DAD Lab"
  },
  {
    id: 3,
    slug: "informatics-curriculum-2020",
    title: "Agricultural Informatics Curriculum Initiative",
    category: "Research Development",
    published_date: "2020",
    summary: "A multidisciplinary team led by Dr. Saraswat received USDA-NIFA Higher Education Challenge funding to develop agricultural informatics education resources with partner institutions in 2020.",
    content_html: "<p>A multidisciplinary team led by Dr. Saraswat received USDA-NIFA Higher Education Challenge funding to develop agricultural informatics education resources with partner institutions in 2020.</p><p>Historical announcement. Year supplied in the content brief; exact announcement date and source link await migration verification.</p>",
    image_url: "",
    image_caption: "",
    source_url: "",
    attachments: [],
    featured_on_home: false,
    status: "archived",
    author_name: "DAD Lab"
  }
];

export const opportunities: OpportunityItem[] = [];
