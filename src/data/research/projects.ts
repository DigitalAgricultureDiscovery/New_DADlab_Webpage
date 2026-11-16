import type { ResearchProjectItem } from '../../types/cms.ts';
import { areaTitle } from './areas.ts';

export type ProjectSeed = Omit<ResearchProjectItem, 'created_at' | 'updated_at'>;

/**
 * Research projects migrated from the former DAD Lab website
 * (dad.saraswat.rcac.purdue.edu): its news feed, Tools, People, Publications
 * and NNF pages, plus the personalization brief.
 *
 * Status rules (see docs/content-audit.md):
 *  - "ongoing": confirmed as ongoing by the PI (November 2026).
 *  - "completed": a documented end on the former site (thesis defended,
 *    funding/program period ended) or confirmed as completed by the PI.
 *
 * `topics` holds research area ids from ./areas.ts; a project may belong to
 * several. `research_area` is the primary area shown on cards and must be the
 * title of one of the project's topics.
 */
const IMG = '/images/research/projects/';

function project(p: Omit<ProjectSeed, 'research_area' | 'objectives_html' | 'methodology_html' | 'progress_notes' | 'image_url' | 'image_caption' | 'related_publication_ids' | 'collaborators' | 'funding_info' | 'featured_on_home' | 'publish_status'> & Partial<ProjectSeed>): ProjectSeed {
  return {
    research_area: areaTitle(p.topics[0]),
    objectives_html: '',
    methodology_html: '',
    progress_notes: '',
    image_url: '',
    image_caption: '',
    related_publication_ids: [],
    collaborators: '',
    funding_info: '',
    featured_on_home: false,
    publish_status: 'published',
    ...p,
  };
}

export const PROJECTS: ProjectSeed[] = [
  // ---------------------------------------------------------------- Ongoing
  project({
    id: 1,
    slug: 'ai-chatbots-llms-agriculture',
    title: 'AI Chatbots and Large Language Models for Agricultural Extension',
    topics: ['area-1', 'area-3'],
    project_status: 'ongoing',
    overview:
      'Conversational AI for agriculture: chatbots that support farm operations, weed management, and agricultural extension and outreach, and an exploration of large language models (LLMs) in agriculture, carried out with undergraduate researchers in the DAD Lab.',
    objectives_html:
      '<ul><li>Aid farm operations with an artificial intelligence chatbot (2022 SURF project).</li><li>Develop an intent classification-based interactive chatbot for weed management (2023 SURF project).</li><li>Advance agricultural extension and outreach through a specialized chatbot (2023 SURF project).</li><li>Explore large language models in agriculture (2023–2024 Office of Undergraduate Research scholarship project).</li></ul>',
    progress_notes:
      'August 2023: Jungeun Hwang received the Best Poster Presenter award from Purdue’s Engineering Undergraduate Research Office for “Intent Classification-based Interactive Chatbot for Weed Management.” Son Thai Ha and Jungeun Hwang continued as 2023–2024 OUR Scholars on “Exploring Large Language Models in Agriculture.”',
    image_url: '/images/news/2023-08-surf-best-poster-award.jpg',
    image_caption: '2023 SURF Best Poster Presenter recognition for the DAD Lab’s weed-management chatbot project.',
    collaborators: 'Graduate mentors: Aanis Ahmad and Varun Aggarwal',
    funding_info:
      'Purdue SURF program (intern support from Purdue Agricultural and Biological Engineering); Purdue Office of Undergraduate Research Scholarship (2023–2024)',
    featured_on_home: true,
  }),
  project({
    id: 2,
    slug: 'affordable-seed-drill-india',
    title: 'Affordable, Scalable Seed Drill for Resource-Poor Farmers in India',
    topics: ['area-6'],
    project_status: 'ongoing',
    overview:
      'Developing and evaluating an affordable, scalable seed drill for resource-poor farmers in India, with partners at Dr. Rajendra Prasad Central Agricultural University (RPCAU), Pusa, Bihar, and CRS India.',
    progress_notes:
      'May 2021: Dr. Saraswat and team received a 2021 Purdue Shah Lab Seed Design award for the project. October 2021: listed among the Shah Lab’s 2021 grant recipients (Seed Drill Technology award).',
    collaborators:
      'Dr. S. K. Patel, Associate Professor, Dr. Rajendra Prasad Central Agricultural University (RPCAU), Pusa, Bihar; Ms. Vijayalakshmi Arora, Head of Programme – India, CRS',
    funding_info: 'Purdue Shah Lab Seed Design award (2021)',
  }),
  project({
    id: 3,
    slug: 'spear-next-earth-representation-learning',
    title: 'SPEAR-NeXT: Spectral–Temporal Earth Representation Learning',
    topics: ['area-2', 'area-1'],
    project_status: 'ongoing',
    overview:
      'Representation learning for spectral–temporal Earth observation data, documented in the 2026 preprint “SPEAR-NeXT: Causal Latent Forecasting Across Multiple Horizons for Spectral–Temporal Earth Representation Learning” (Ranjan, Singh, Tamaskar, and Saraswat).',
    progress_notes: '2026: preprint released on arXiv.',
    related_publication_ids: [1],
  }),

  // -------------------------------------------------------------- Completed
  project({
    id: 4,
    slug: 'corn-disease-deep-learning',
    title: 'Deep Learning for Corn Disease Identification, Severity Estimation, and Tracking',
    topics: ['area-1', 'area-2', 'area-3'],
    project_status: 'completed',
    overview:
      'Deep learning-based computer vision for identifying corn diseases, locating diseased regions, and estimating disease severity from images acquired with UAS-mounted and handheld sensors, as part of an effort to develop a field-worthy disease management system for corn.',
    objectives_html:
      '<ul><li>Locate diseased regions in corn fields, identify disease types, and estimate disease severity as connected steps toward an effective disease management system.</li><li>Track the spread of crop diseases and provide actionable, geolocated information to users (GeoDLS).</li><li>Improve how disease identification models trained under controlled conditions generalize to field conditions.</li><li>Deliver field-ready tools, including a smartphone-based diagnosis tool for tar spot.</li></ul>',
    methodology_html:
      '<p>Images were acquired from UAS-mounted and handheld sensors under field conditions, including RTK-geolocated UAS imagery. The team evaluated image classification, object detection, and segmentation models, SLIC superpixel segmentation, and a two-stage segmentation model for lesion quantification, and developed BNNDC-Net, a branched neural network for disease classification with 3.86 million trainable parameters (86.6% fewer than ResNet50).</p><p>As reported on the former lab website, UAV imagery identified diseased regions in corn fields with approximately 97% accuracy, disease types within those regions with approximately 99% accuracy, and disease severity on affected leaves with approximately 94% accuracy (Journal of the ASABE, 2022).</p>',
    progress_notes:
      'November 17, 2023: Aanis Ahmad defended his Ph.D. thesis, “Deep Learning-Based Computer Vision for Disease Identification and Monitoring in Corn Systems.” A follow-up paper on tar spot identification and severity estimation was shared in March 2024.',
    image_url: `${IMG}corn-disease-geodls-app.jpg`,
    image_caption:
      'GeoDLS app workflow: select a task, upload and select images, identify disease, and locate diseased regions (Remote Sensing, 2022; Editor’s Choice).',
    related_publication_ids: [2, 3, 4, 6, 7, 8, 31, 37, 38],
    collaborators:
      'Dr. Aly El Gamal (Purdue Electrical and Computer Engineering); Dr. Gurmukh S. Johal (Purdue); field data collection support from Drs. Bryan Dilkes and Raj Khangura',
    funding_info:
      'Foundation for Food and Agriculture Research (grant 534662); USDA National Institute of Food and Agriculture Hatch project 1012501',
    featured_on_home: true,
  }),
  project({
    id: 5,
    slug: 'weed-identification-uas',
    title: 'Deep Learning for Weed Identification Using UAS Imagery',
    topics: ['area-1', 'area-2'],
    project_status: 'completed',
    overview:
      'Machine learning and deep learning for identifying and locating weeds in UAS-acquired and field imagery of corn and soybean production systems. Knowing the precise location and species of weeds is a prerequisite for an effective site-specific weed management (SSWM) system.',
    objectives_html:
      '<ul><li>Automate weed detection in UAS-acquired images using machine learning methods.</li><li>Compare deep learning models for classifying and detecting broadleaf and grassy weeds in corn and soybean under field conditions.</li><li>Assess semantic segmentation for weed identification at different growth stages.</li><li>Run deep learning networks on IoT devices for real-time weed identification.</li></ul>',
    progress_notes:
      'July 16, 2019: Aaron Etienne defended his M.S. research on automated weed detection using UAS-based imagery. Graduate support for UAV and advanced technologies research began in August 2019 for three years. Results were published in Remote Sensing and Computers and Electronics in Agriculture (2021).',
    image_url: `${IMG}weed-detection-examples.jpg`,
    image_caption:
      'Weed detection examples featured with the lab’s 2021 study of deep learning models for common weeds in corn and soybean.',
    related_publication_ids: [9, 10, 32],
    collaborators: 'Committee members and co-authors: Dr. Dennis Buckmaster and Dr. Bryan G. Young',
    funding_info: 'Graduate research support for Unmanned Aerial Vehicle (UAV) and Advanced Technologies in Agriculture (from August 2019, three years)',
    featured_on_home: true,
  }),
  project({
    id: 6,
    slug: 'plant-disease-forecasting-early-warning',
    title: 'Plant Disease Forecasting and Early-Warning Systems',
    topics: ['area-1', 'area-3'],
    project_status: 'completed',
    overview:
      'Deep learning for crop disease identification and forecasting toward early-warning systems, including research on rice diseases such as bacterial blight in collaboration with scientists at the Indian Agricultural Research Institute (IARI), New Delhi.',
    objectives_html:
      '<ul><li>Evaluate and optimize deep learning networks for plant disease forecasting and assess their generalizability for early warning systems.</li><li>Survey deep learning applications for disease identification and prediction in rice.</li><li>Apply information and communication technologies (ICT) to plant disease management and the development of early warning systems.</li></ul>',
    progress_notes:
      'April 11, 2023: Hannah Klein defended her M.S. thesis on deep learning networks for plant disease forecasting. September 2023: Shih-Yun Lin presented a survey of deep learning for rice disease identification and prediction at the Digital Ag Fest. Dr. Saraswat worked with IARI as a 2023–2024 Fulbright U.S. Scholar.',
    image_url: `${IMG}disease-forecasting-model-workflow.jpg`,
    image_caption:
      'Model workflow diagram shared with the lab’s April 2023 thesis announcement on deep learning for plant disease forecasting.',
    related_publication_ids: [3],
    collaborators: 'Indian Agricultural Research Institute (IARI), New Delhi',
  }),
  project({
    id: 7,
    slug: 'uas-soybean-stand-count',
    title: 'UAS-Based Soybean Stand Counting with Deep Learning',
    topics: ['area-2', 'area-1'],
    project_status: 'completed',
    overview:
      'Real-time and offline soybean stand counting from unmanned aerial system (UAS) imagery early in the growing season, using object detection networks such as YOLO and examining how image resolution and field-to-field differences affect accuracy.',
    objectives_html:
      '<ul><li>Count soybean stands in real time and offline from UAS imagery in the early growth season.</li><li>Generalize YOLO networks for soybean detection across different fields through fine-tuning.</li><li>Determine the effect of image resolution on object detection accuracy in UAS-acquired images.</li></ul>',
    progress_notes:
      'July 2022: results presented at the ASABE Annual International Meeting in Houston. September 2023: poster “Evaluation of YOLO Network for Generalizing Soybean Plant Stand Count Across Different Fields” (Adewumi, Aggarwal, and Saraswat) at the Digital Ag Fest.',
    image_url: `${IMG}uas-hexacopter-field.jpg`,
    image_caption: 'DAD Lab hexacopter UAS staged at a field site.',
    related_publication_ids: [34, 35, 36],
    collaborators: 'Dr. Aly El Gamal (co-author)',
  }),
  project({
    id: 8,
    slug: 'iot-precision-indoor-farming',
    title: 'Low-Cost IoT Testbed for Precision Indoor Farming',
    topics: ['area-6', 'area-1', 'area-3'],
    project_status: 'completed',
    overview:
      'A low-cost Internet of Things (IoT) ecosystem built from off-the-shelf components to move indoor farm monitoring and control from prototype to a real-world testbed, with cloud-based remote monitoring and data-driven farm management.',
    objectives_html:
      '<ul><li>Develop a low-cost IoT ecosystem using off-the-shelf components in an indoor farm setting.</li><li>Test the availability, scalability, and reliability of low-cost IoT farm systems through larger experiments.</li><li>Use captured data for intelligent farm management, including anomaly detection and yield prediction.</li><li>Optimize controlled-environment microgreen production efficiency for indoor urban farms.</li></ul>',
    methodology_html:
      '<p>The testbed collected and monitored nutrient quality, light intensity, environmental variables, and images, with corresponding actuation of LEDs, irrigation, and camera modules, using commercially available sensors, Raspberry Pi computers, and Arduino microcontrollers. A cloud-based dashboard supported remote monitoring and control, and edge computing, anomaly detection, and machine vision techniques were applied. The testbed was used to investigate the effects of nutrition, lighting, and density on the growth of microgreens under a statistical experimental design.</p>',
    progress_notes:
      'July 16, 2021: Madhu Lekha Guntaka defended her M.S. thesis, “IoT Based Low-Cost Precision Indoor Farming,” and presented the testbed at the 2021 ASABE Annual International Meeting.',
    image_url: `${IMG}iot-indoor-outdoor-farms-diagram.jpg`,
    image_caption:
      'DAD Lab research graphic: IoT for indoor and outdoor farms, and big data analysis and visualization for farmers and agricultural service providers.',
    related_publication_ids: [33],
    collaborators: 'Dr. Petrus Langenhoven; Ms. Emily Brown',
    funding_info:
      'Purdue AgSeed (2019): “Controlled environment micro green production efficiency optimization for indoor urban farms”',
  }),
  project({
    id: 9,
    slug: 'reeu-data-science-for-agriculture',
    title: 'REEU: Data Science for Agriculture Undergraduate Research Program',
    topics: ['area-5', 'area-1'],
    project_status: 'completed',
    overview:
      'A USDA-NIFA Research and Extension Experiential Learning for Undergraduates (REEU) program that brought undergraduates to Purdue for summer research building data science skills that complement their agricultural discipline knowledge.',
    objectives_html:
      '<ul><li>Provide a summer data science and digital agriculture research experience at Purdue.</li><li>Have each participant complete and present a mentored research project of their choice.</li></ul>',
    methodology_html:
      '<p>In 2021, DAD group projects included IoT sensing integration for indoor agriculture, expenses correlated with yield and the cost–benefit of hydroponics, a wine grape variety database, locating waste sites in North Carolina, and counting corn plants using deep learning. 2023 projects examined healthy eating and food insecurity, health insurance accessibility among farmers, agricultural land use and domestic honey production, and tap water safety violations.</p>',
    progress_notes:
      'Funded for January 1, 2019 – December 31, 2023. The 2021 cohort had 18 participants from 13 institutions, who presented at the Agriculture Summer Research Poster Session on July 27, 2021.',
    image_url: `${IMG}reeu-2021-poster-session.jpg`,
    image_caption: 'Lizbeth M. Plaza-Torres with her poster at the 2021 Agriculture Summer Research Poster Session.',
    collaborators:
      'Dr. Dennis Buckmaster (PI) and Dr. Saraswat (ABE); Drs. Holland (Entomology), Ward (Statistics), Krogmeier (Electrical and Computer Engineering), and Erickson (Agronomy)',
    funding_info: 'USDA-NIFA Research and Extension Experiential Learning for Undergraduates (REEU), 2019–2023',
  }),
  project({
    id: 10,
    slug: 'agricultural-informatics',
    title: 'Agricultural Informatics and Data Science Education',
    topics: ['area-5'],
    project_status: 'completed',
    overview:
      'A USDA-NIFA-supported educational initiative led by Dr. Saraswat with Purdue University, the University of Kentucky, and Tuskegee University addressing computational thinking, data analysis, software development, and experiential agricultural education, together with National Needs Fellowships in data science for graduate students.',
    objectives_html:
      '<ul><li>Develop agricultural informatics and data science curriculum resources with partner institutions (USDA-NIFA Higher Education Challenge funding, 2020).</li><li>Share instructional case studies, such as analyzing weather network data in Jupyter notebooks.</li><li>Award USDA-NIFA National Needs Fellowships to six incoming research-based M.S. students in the ABE Data Science and Engineering concentration (two each starting Fall 2021, 2022, and 2023).</li></ul>',
    methodology_html:
      '<p>Materials include a lesson plan with slides and an exercise set for teaching data wrangling and analysis using weather data, co-authored with Dr. Gang Shao (Purdue Libraries) and distributed through the <a href="https://elibrary.asabe.org/azdez.asp?jid=4&amp;aid=53574&amp;cid=sci2021&amp;v=&amp;i=&amp;t=1">ASABE technical library</a>. National Needs Fellows were expected to mentor undergraduates in programs such as SURF, the Purdue Undergraduate Research Experience, and The Data Mine, help organize hackathons, and take part in industry-sponsored projects and Open Ag Technology and Systems (OATS) Center events.</p><p>Further reading: <a href="https://medium.com/purdue-engineering/teaching-data-science-for-smart-agriculture-5755980b6934">Teaching data science for smart agriculture</a> (Purdue Engineering).</p>',
    progress_notes:
      'July 2021: invited ASABE talk on teaching geospatial programming and data science to agriscience students. October 2022: weather data lesson plan published through the ASABE technical library.',
    collaborators:
      'University of Kentucky; Tuskegee University; National Needs Fellowship mentors Drs. Dennis Buckmaster, Keith Cherkauer, and Somali Chaterji; Dr. Gang Shao (Purdue Libraries)',
    funding_info: 'USDA-NIFA Higher Education Challenge grant (2020); USDA-NIFA National Needs Fellowship',
  }),
  project({
    id: 11,
    slug: 'uas-user-log',
    title: 'UAS User Log: A Digital Logbook for UAS Operations',
    topics: ['area-3', 'area-2'],
    project_status: 'completed',
    overview:
      'A server-based digital logbook, accessible through any web browser on internet-connected devices, that builds a record of unmanned aircraft system (UAS) missions. It is an outcome of multi-state teams developing a common protocol for UAS operation for research and production, spray application, and other activities.',
    objectives_html:
      '<ul><li>Build a record of UAS missions through simple user interactions.</li><li>Enhance users’ flight and maintenance experience.</li></ul>',
    methodology_html:
      '<p>Website: <a href="https://www.uasuserlog.org/">uasuserlog.org</a>. Source code: <a href="https://github.com/DigitalAgricultureDiscovery/uas-user-log">github.com/DigitalAgricultureDiscovery/uas-user-log</a>.</p>',
    collaborators: 'Multi-state UAS operations teams',
  }),
  project({
    id: 12,
    slug: 'watershed-water-quality',
    title: 'Watershed and Water Quality Modeling',
    topics: ['area-4'],
    project_status: 'completed',
    overview:
      'Hydrologic and water quality modeling with the Soil and Water Assessment Tool (SWAT) and geospatial analysis to evaluate land use representation, the water quality impacts of bioenergy crops and conservation practices, and recommended calibration and validation practices.',
    objectives_html:
      '<ul><li>Represent marginal lands and dynamic land use change in SWAT to simulate the water quality impacts of second-generation bioenergy feedstocks.</li><li>Evaluate how conservation practices affect water quality in the L’Anguille River Watershed, Arkansas.</li><li>Quantify the effect of land use and land cover uncertainty on SWAT hydrologic modeling.</li><li>Identify priority subwatersheds using a distributed modeling approach.</li><li>Contribute ASABE guidance on calibration, validation, documentation, and reporting for hydrologic and water quality models.</li></ul>',
    progress_notes:
      'Body of work published 2010–2020 with DAD Lab alumni including Dr. Naresh Pai, Dr. Gurdeep Singh, and Eeshan Kumar.',
    related_publication_ids: [11, 13, 16, 17, 19, 20, 21, 22, 25, 27],
  }),
  project({
    id: 13,
    slug: 'swat-geospatial-web-tools',
    title: 'Web-Based Geospatial Tools for SWAT and Streambank Assessment',
    topics: ['area-4', 'area-3'],
    project_status: 'completed',
    overview:
      'Web applications that help Soil and Water Assessment Tool (SWAT) users perform common but complex operations on model inputs and outputs, and that support streambank delineation and riparian buffer assessment.',
    objectives_html:
      '<ul><li>Make complex SWAT input and output operations accessible through the web.</li><li>Provide decision support for streambank delineation and riparian buffer planning.</li><li>Help users find water monitoring sites and data in Indiana.</li></ul>',
    methodology_html:
      '<ul><li><strong><a href="https://saraswat-swat.rcac.purdue.edu/">SWAT Tools</a></strong>: Field SWAT visualizes SWAT output at field scale; LUU Checker detects emerging land uses by comparing multiple years of land use data against a base dataset; LUU Uncertainty evaluates the impact of land use and land cover errors on model output; and SWAT LUU prepares input files for SWAT’s land use update module. Source code: <a href="https://github.com/DigitalAgricultureDiscovery/swat-tools">github.com/DigitalAgricultureDiscovery/swat-tools</a>.</li><li><strong><a href="https://saraswat-streband.rcac.purdue.edu/">StreBand Cloud</a></strong>: integrates remote sensing images and stream centerline data to delineate streambanks and identify riparian buffer hotspots using NRCS guidelines.</li><li><strong>Indiana Water Monitoring Inventory (IWMI)</strong>: a web portal for finding 5,000+ water monitoring sites in Indiana and the data collected there, with CSV and shapefile downloads.</li></ul>',
    progress_notes: 'LUU Checker was described in Applied Engineering in Agriculture (2019).',
    image_url: `${IMG}swat-tools-web-application.jpg`,
    image_caption: 'SWAT Tools web application home page.',
    related_publication_ids: [12, 23, 24, 26],
  }),
  project({
    id: 14,
    slug: 'soybean-moisture-stress-uas',
    title: 'UAS Imagery for Soybean Canopy and Moisture Stress',
    topics: ['area-2'],
    project_status: 'completed',
    overview:
      'Sensing and modeling the impacts of moisture stress on soybean growth and yield using imagery from an unmanned aircraft system, including remote sensing of canopy cover, color, and visible indicators of moisture stress.',
    progress_notes:
      'April 10, 2019: Anthony A. Hearst defended his Ph.D. thesis, “Remote Sensing of Soybean Canopy Cover, Color, and Visible Indicators of Moisture Stress Using Imagery from Unmanned Aircraft Systems.”',
    collaborators: 'Thesis committee: Drs. Melba M. Crawford, Bernie Engel, and Katy M. Rainey',
  }),
  project({
    id: 15,
    slug: 'field-scale-soil-mapping',
    title: 'Field-Scale Predictive Soil Mapping',
    topics: ['area-4', 'area-1'],
    project_status: 'completed',
    overview:
      'Comparative evaluation of machine learning and geostatistics for field-scale predictive soil mapping, leading to a field-based soil mapping tool developed as a case study in Indiana.',
    progress_notes:
      'July 18, 2019: Jeff Fiechter defended his M.S. research, “Development of a Field Based Soil Mapping Tool Using Comparative Evaluation of Geostatistics and Machine Learning: A Case Study in Indiana,” after presenting it at the 2019 ASABE Annual International Meeting.',
    collaborators: 'Thesis committee: Drs. Dennis Buckmaster and James Krogmeier',
  }),
  project({
    id: 16,
    slug: 'mobile-apps-cloud-decision-tools',
    title: 'Mobile Apps and Cloud Tools for Crop Production Decisions',
    topics: ['area-3'],
    project_status: 'completed',
    overview:
      'Mobile apps and cloud-based software listed on the former DAD Lab website, many developed for Arkansas producers with the University of Arkansas System Division of Agriculture, giving growers 24/7 access to production guidance and decision tools.',
    methodology_html:
      '<ul><li><strong>Corn Advisor</strong> and <strong>Soybean Advisor</strong>: 24/7 pocket experts for Arkansas corn and soybean producers.</li><li><strong>Cotton Advisor</strong>: access to cotton production guidelines developed by the University of Arkansas System Division of Agriculture, Cotton Inc., and others.</li><li><strong>Rice Irrigation</strong>: helps Arkansas rice farmers develop a multiple-inlet rice irrigation plan.</li><li><strong>CE Budgets</strong>: evaluate expected costs and returns and compare alternative crop decisions.</li><li><strong>Hort Plants</strong>: a photographic database of 268 landscape plants for the mid-South with 931 images.</li><li><strong>Manure Valuator</strong>: calculates the dollar and nutritive value of manure.</li><li><strong>FTT Cloud</strong>: cloud-based, participatory software that stores field data to help reduce misapplication of herbicides in row crops.</li><li>Event apps for the 2014 Rice Expo, the 2014 Galaxy Conference, and the 2013 International Master Gardener Conference.</li></ul>',
    progress_notes: 'Historical tools; several apps were retired, and the event apps were removed after their conferences.',
    related_publication_ids: [18],
  }),
];
