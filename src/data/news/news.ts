import type { NewsItem } from '../../types/cms.ts';

export type NewsSeed = Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'attachments'>;

/**
 * News migrated from the former DAD Lab website: the dated news feed
 * (dad.saraswat.rcac.purdue.edu/index.php/research/ — titled "News" on that
 * site) and its 2019 blog posts. Dates are the dates shown on the former site.
 * Items from 2023 onward are "published" (Current News); earlier items are
 * "archived" (News Archive). Personal/social posts and expired 2019 job
 * postings were not migrated (see docs/content-audit.md).
 *
 * Three entries from the personalization brief are retained: the Fulbright
 * and faculty-mentor items now carry the exact dates from the former site,
 * and the 2020 curriculum award keeps its year-only date.
 */
const OLD = 'https://dad.saraswat.rcac.purdue.edu';
const IMG = '/images/news/';

function news(n: Omit<NewsSeed, 'status' | 'author_name' | 'image_url' | 'image_caption' | 'featured_on_home' | 'source_url'> & Partial<NewsSeed>): NewsSeed {
  return {
    status: Number(n.published_date.slice(0, 4)) >= 2023 ? 'published' : 'archived',
    author_name: 'DAD Lab',
    image_url: '',
    image_caption: '',
    featured_on_home: false,
    source_url: '',
    ...n,
  };
}

const p = (...paras: string[]) => paras.map((t) => `<p>${t}</p>`).join('');

export const NEWS: NewsSeed[] = [
  news({
    slug: '2024-summer-intern-smit-mehta',
    title: 'Welcome 2024 Summer Intern Smit Mehta',
    category: 'Announcement',
    published_date: '2024',
    summary:
      'Smit Mehta of the Indian Institute of Technology Gandhinagar joined the DAD Lab for summer 2024 to evaluate computational approaches for agricultural field data analysis.',
    content_html: p(
      'Congratulations to Smit Mehta (Mechanical Engineering, Indian Institute of Technology Gandhinagar) for receiving the opportunity to conduct research in the DAD Lab during summer 2024. Smit will be working on evaluating computational approaches for agricultural field data analysis.'
    ),
  }),
  news({
    slug: '2024-03-tar-spot-deep-learning-paper',
    title: 'Paper on Deep Learning-Based Diagnosis of Tar Spot in Corn',
    category: 'Research Development',
    published_date: '2024-03-19',
    summary:
      'A new paper, “Tar Spot Disease Identification and Severity Estimation Using Deep Learning,” is available through the ASABE Technical Library.',
    content_html: p(
      'Management of tar spot disease of corn has traditionally relied on manual field scouting and visual analysis since 2015, the first year it was observed in the USA. DL models trained on images acquired under uniform lab conditions are limited in their ability to generalize to field conditions.',
      'In this study, a new tar spot disease dataset was acquired to train deep learning-based image classification, object detection, and segmentation models for tar spot identification, localization, and severity estimation. In addition, a smartphone-based disease diagnosis tool was developed that has the potential for accurate, in-field diagnosis of tar spot in corn.'
    ),
    source_url: 'https://elibrary.asabe.org/abstract.asp?aid=54627&t=3&redir=&redirType',
  }),
  news({
    slug: '2023-12-ouat-blending-research-ug-curriculum',
    title: 'Lead Speaker on “Blending Research in UG Curriculum” at OUAT, Bhubaneswar',
    category: 'Conference',
    published_date: '2023-12-13',
    summary:
      'During his Fulbright award at IARI, Dr. Saraswat was a lead speaker at a symposium on higher education in agriculture at the Odisha University of Agriculture and Technology.',
    content_html: p(
      'Dr. Saraswat, then pursuing a Fulbright Scholar Award at the Indian Agricultural Research Institute, New Delhi, was invited to be a lead speaker in a special opening session on “Blending Research in UG Curriculum,” organized as part of the symposium on “Higher Education in Agriculture and Allied Sciences: Challenges & Opportunities” at the Odisha University of Agriculture and Technology (OUAT), Bhubaneswar, India, on December 13, 2023.',
      'In his talk, Dr. Saraswat shared the need, elements, and examples of research components included in his geospatial course (ASM 540, GIS Applications) to provide Course-based Research Exposure to Undergraduate Students (CURE). The Vice-Chancellor, Prof. Pravat Kumar Roul, expressed interest in introducing the CURE concept in data science education and training for OUAT undergraduates.'
    ),
    image_url: `${IMG}2023-12-ouat-symposium.jpg`,
    image_caption: 'Dr. Saraswat at OUAT, Bhubaneswar, December 13, 2023.',
    featured_on_home: true,
  }),
  news({
    slug: '2023-11-aanis-ahmad-phd-defense',
    title: 'Aanis Ahmad Defends His Ph.D. Thesis',
    category: 'Student Achievement',
    published_date: '2023-11-17',
    summary:
      'Graduate student Aanis Ahmad successfully defended his Ph.D. thesis, “Deep Learning-Based Computer Vision for Disease Identification and Monitoring in Corn Systems.”',
    content_html: p(
      'Congratulations! Graduate student Aanis Ahmad successfully defended his Ph.D. thesis on November 17, 2023.',
      'Thesis title: Deep Learning-Based Computer Vision for Disease Identification and Monitoring in Corn Systems.'
    ),
    image_url: `${IMG}2023-11-ahmad-phd-defense.jpg`,
    image_caption: 'Title slide of the thesis defense. Committee: Aly El Gamal (co-advisor), Dharmendra Saraswat (co-advisor), Gurmukh S. Johal, and James V. Krogmeier.',
    featured_on_home: true,
  }),
  news({
    slug: '2023-10-precision-crop-management-invited-talk',
    title: 'Invited Talk: Precision Crop Management from Single Disease Identification to Multimodal Sensing',
    category: 'Conference',
    published_date: '2023-10-01',
    summary:
      'Dr. Saraswat presented an invited talk, “Precision Crop Management: A Journey from Single Disease Identification to Multimodal Sensing.”',
    content_html: p(
      'Dr. Saraswat presented an invited talk on the topic “Precision Crop Management: A Journey from Single Disease Identification to Multimodal Sensing.”'
    ),
    image_url: `${IMG}2023-10-automation-in-agriculture-asia-symposium.jpg`,
    image_caption: 'Symposium – Automation in Agriculture in Asia, 2–3 October 2023, Aurangabad, India.',
  }),
  news({
    slug: '2023-09-asabe-podcast-next-generation-engineers',
    title: 'ASABE Podcast: Preparing the Next Generation of Engineers for Future Careers',
    category: 'Announcement',
    published_date: '2023-09-20',
    summary:
      'Dr. Saraswat and Dr. Ankita Raturi joined an ASABE podcast on tech literacy, data management, and problem-solving skills for future engineers.',
    content_html: p(
      'Through an American Society of Agricultural and Biological Engineers (ASABE) initiative, Dr. Dharmendra Saraswat and his colleague Dr. Ankita Raturi participated in a podcast titled “Preparing the Next Generation of Engineers for Future Careers.” The episode explores why teaching students at all levels about tech literacy, data management, and problem-solving are critical career development skills.',
      'The podcast also discusses the ASABE Hackathon, an annual contest at the Annual International Meeting where students solve problems using concepts and code; 2023 was the second year ASABE hosted the event.'
    ),
    source_url:
      'https://www.iheart.com/podcast/53-the-lead-with-asabe-109451873/episode/preparing-the-next-generation-of-engineers-123523262/',
  }),
  news({
    slug: '2023-09-digital-ag-fest-posters',
    title: 'DAD Lab Posters at the 2023 Digital Ag Fest',
    category: 'Conference',
    published_date: '2023-09-19',
    summary:
      'Shih-Yun Lin, Adeayo Adewumi, and Aanis Ahmad presented posters on rice disease, soybean stand count, and corn disease research.',
    content_html:
      '<p>2023 Digital Ag Fest poster session:</p><ul><li>Shih-Yun Lin: “A Survey of Deep Learning Applications for Disease Identification and Prediction in Rice Crop” (Lin and Saraswat).</li><li>Adeayo Adewumi: “Evaluation of YOLO Network for Generalizing Soybean Plant Stand Count Across Different Fields” (Adewumi, Aggarwal, and Saraswat).</li><li>Aanis Ahmad: “Application of Deep Learning on UAS, UGV, and Handheld Sensor Acquired Data for Corn Diseases” (Ahmad, Aggarwal, Saraswat, and Johal).</li></ul>',
    image_url: `${IMG}2023-09-digital-ag-fest-posters.jpg`,
    image_caption: 'DAD Lab students at the 2023 Digital Ag Fest poster session.',
  }),
  news({
    slug: '2023-09-bnndc-net-paper',
    title: 'BNNDC-Net: A Branched Neural Network for Plant Disease Classification',
    category: 'Research Development',
    published_date: '2023-09-13',
    summary:
      'A new neural network architecture, BNNDC-Net, uses 86.6% fewer trainable parameters than ResNet50 while improving disease identification and generalization.',
    content_html: p(
      'To overcome limitations of commonly used deep learning models for identifying plant diseases, the lab developed a novel neural network architecture named Branched Neural Network for Disease Classification (BNNDC)-Net. BNNDC-Net has 3.86M trainable parameters, 86.60% fewer than the ResNet50 model, while improving disease identification (~14%) and generalization performance (~5%) compared to other architectures.',
      'Congratulations to Aanis Ahmad and Varun Aggarwal for sharing this work with the research community.'
    ),
    source_url: 'https://lnkd.in/gmzu6AGu',
  }),
  news({
    slug: '2023-08-surf-best-poster-presenter',
    title: 'Jungeun Hwang Wins 2023 SURF Best Poster Presenter Award',
    category: 'Student Achievement',
    published_date: '2023-08-02',
    summary:
      'Jungeun Hwang received the 2023 Best Poster Presenter award from Purdue’s Engineering Undergraduate Research Office for a weed-management chatbot, the second DAD Lab SURF intern recognized in back-to-back years.',
    content_html: p(
      'Congratulations to Jungeun Hwang, an undergraduate student at Purdue, for receiving the 2023 Best Poster Presenter award from Purdue’s Engineering Undergraduate Research Office after completing the ten-week Summer Undergraduate Research Fellowship (SURF) program in the DAD Lab. Jungeun is the second DAD Lab SURF intern to be recognized in back-to-back years, selected from among 250+ undergraduates in the 2023 SURF program.',
      'Her poster, “Intent Classification-based Interactive Chatbot for Weed Management,” was developed with fellow SURF intern Son Ha. Graduate mentors Aanis Ahmad and Varun Aggarwal provided guidance, and Nathan Mosier, Head of Purdue Agricultural & Biological Engineering, extended financial support to the SURF interns.'
    ),
    image_url: `${IMG}2023-08-surf-best-poster-award.jpg`,
    image_caption: 'Recognition for the 2023 SURF Best Poster Presenter award.',
  }),
  news({
    slug: '2023-07-israel-workshop-uas-plant-stress',
    title: 'Invited Talk at Workshop on Sustainable Precision Agriculture in the Era of IoT and AI',
    category: 'Conference',
    published_date: '2023-07-18',
    summary:
      'Dr. Saraswat spoke on “Unmanned Aerial Systems for Plant Stress Identification and Monitoring” at a three-day workshop in Israel.',
    content_html: p(
      'Dr. Saraswat delivered an invited talk on “Unmanned Aerial Systems for Plant Stress Identification and Monitoring” and participated in roundtable discussions during a three-day workshop (July 18–20, 2023) on “Sustainable Precision Agriculture in the Era of IoT and Artificial Intelligence” in Israel. The workshop was sponsored by the National Science Foundation, USA, and the Binational Agricultural Research and Development Fund, along with other partners.'
    ),
  }),
  news({
    slug: '2023-07-reeu-surf-presentations',
    title: '2023 REEU and SURF Student Presentations',
    category: 'Student Achievement',
    published_date: '2023-07-27',
    summary:
      'REEU Data Science for Agriculture and SURF students mentored by Dr. Saraswat presented posters and talks on July 27, 2023.',
    content_html:
      '<p>REEU Data Science for Agriculture posters and oral presentations:</p><ul><li>“Mental Wellbeing and Academic Performance: The Connection Between Healthy Eating, Food Insecurity, and Access to Resources” – Ja’Quan Battle</li><li>“Socioeconomic Determinants of Health Insurance Accessibility and Affordability Among Farmers” – Kate Veltri</li><li>“Identifying Spatial Patterns Between Agricultural Land Use and Decline in Domestic Honey Production in the United States” – Ahnaf Taluder</li><li>“Is Water Infrastructure Racially Biased? An Investigation into the Presence of Ongoing Tap Water Safety Violations in Communities of Color” – Joh Woodruff</li></ul><p>SURF presentations:</p><ul><li>“Intent Classification-based Interactive Chatbot for Weed Management” (poster) – Jungeun Hwang and Son Ha</li><li>“Advancing Agricultural Extension &amp; Outreach Through the Development of a Specialized Chatbot” (oral) – Son Ha and Jungeun Hwang</li></ul><p>PI: Dr. Dharmendra Saraswat. Graduate mentors: Varun Aggarwal and Aanis Ahmad.</p>',
  }),
  news({
    slug: '2023-06-tyagi-egu-ospp-award',
    title: 'Shoobhangi Tyagi Receives EGU Outstanding Student and PhD Candidate Presentation Award',
    category: 'Student Achievement',
    published_date: '2023-06-08',
    summary:
      'Former visiting SERB scholar Shoobhangi Tyagi received the 2023 European Geosciences Union OSPP award.',
    content_html: p(
      'Congratulations to Ms. Shoobhangi Tyagi, a former visiting SERB scholar in the DAD Lab and a Ph.D. candidate at the Indian Institute of Technology Delhi, for receiving the 2023 European Geosciences Union Outstanding Student and PhD Candidate Presentation (OSPP) award.'
    ),
    image_url: `${IMG}2023-06-tyagi-egu-ospp-award.jpg`,
    image_caption: 'Title slide: “Implications of 1.5°C global warming for agricultural productivity over a global rice exporting region in Central India.”',
    source_url:
      'https://blogs.egu.eu/geolog/2023/04/13/outstanding-student-and-phd-candidate-presentation-ospp-top-tips-from-winners-and-judges/',
  }),
  news({
    slug: '2023-05-geodls-editors-choice',
    title: 'GeoDLS Paper Selected as Remote Sensing Editor’s Choice Article',
    category: 'Award',
    published_date: '2023-05-23',
    summary:
      '“GeoDLS: A Deep Learning-Based Corn Disease Tracking and Location System Using RTK Geolocated UAS Imagery” was selected as an Editor’s Choice article by Remote Sensing.',
    content_html: p(
      'Congratulations to Aanis Ahmad, Ph.D. candidate, and co-authors Varun Aggarwal, Dharmendra Saraswat, Aly El Gamal, and Gurmukh S. Johal on their paper “GeoDLS: A Deep Learning-Based Corn Disease Tracking and Location System Using RTK Geolocated UAS Imagery” being selected as one of the Editor’s Choice articles by the journal Remote Sensing.'
    ),
    image_url: '/images/research/projects/corn-disease-geodls-app.jpg',
    image_caption: 'GeoDLS app workflow screens.',
    source_url: 'https://doi.org/10.3390/rs14174140',
  }),
  news({
    slug: '2023-05-summer-interns',
    title: 'Welcome 2023 Summer Interns',
    category: 'Announcement',
    published_date: '2023-05-22',
    summary:
      'The DAD Lab welcomed Son Thai Ha and Jung Hwang (Purdue SURF) and Kush Patel (IIT Gandhinagar) for summer 2023.',
    content_html: p(
      'Welcome to the 2023 summer interns: Son Thai Ha (Purdue undergraduate, SURF), Jung Hwang (Purdue undergraduate, SURF), and Kush Patel (IIT Gandhinagar undergraduate).'
    ),
  }),
  news({
    slug: 'fulbright-2023',
    title: 'Dr. Saraswat Selected for Fulbright U.S. Scholar Award',
    category: 'Award',
    published_date: '2023-04-05',
    summary:
      'Dr. Dharmendra Saraswat was selected as a Fulbright U.S. Scholar for 2023–2024 and headed to the Indian Agricultural Research Institute (IARI), New Delhi.',
    content_html: p(
      'Dr. Saraswat was selected for the Fulbright U.S. Scholar Award for 2023–2024, involving collaboration with the Indian Agricultural Research Institute (IARI) in New Delhi.'
    ),
    image_url: `${IMG}2023-04-fulbright-scholar.jpg`,
    image_caption: 'Dr. Dharmendra Saraswat.',
    source_url:
      'https://ag.purdue.edu/news/2023/05/saraswat-headed-for-indian-agricultural-research-institute-as-fulbright-scholar.html',
    featured_on_home: true,
  }),
  news({
    slug: '2023-04-digital-agriculture-international-development-panel',
    title: 'Panel: The Future of Digital Agriculture in International Development',
    category: 'Announcement',
    published_date: '2023-04-13',
    summary:
      'Dr. Saraswat joined Dr. Mitch Tuinstra and Dr. Jacki Boerman for a panel on opportunities in digital agriculture for international development.',
    content_html: p(
      'A panel discussion on upcoming opportunities and the future of digital agriculture in international development featured Dr. Dharmendra Saraswat from the Digital Agriculture Discovery (DAD) Lab, Dr. Mitch Tuinstra, and Dr. Jacki Boerman. The panel took place in person and virtually on April 13, 2023, from 12:00 to 1:30 p.m. in WSLR 116 at Purdue University.'
    ),
  }),
  news({
    slug: '2023-04-hannah-klein-ms-defense',
    title: 'Hannah Klein Defends Her Master’s Thesis',
    category: 'Student Achievement',
    published_date: '2023-04-11',
    summary:
      'Hannah Klein defended her M.S. thesis on deep learning networks for plant disease forecasting and early warning systems.',
    content_html: p(
      'Congratulations! Graduate student Hannah Klein successfully defended her Master’s thesis on April 11, 2023.',
      'Thesis title: Evaluation and Optimization of Deep Learning Networks for Plant Disease Forecasting and Assessment of their Generalizability for Early Warning Systems.'
    ),
  }),
  news({
    slug: '2023-04-our-scholars',
    title: 'Son Thai Ha and Jungeun Hwang Named 2023–2024 OUR Scholars',
    category: 'Student Achievement',
    published_date: '2023-04-10',
    summary:
      'Two undergraduates received Office of Undergraduate Research scholarships to explore large language models in agriculture.',
    content_html: p(
      'Congratulations to Son Thai Ha and Jungeun Hwang for receiving the Office of Undergraduate Research (OUR) Scholarship for 2023–2024. OUR Scholars are selected to recognize undergraduate engagement in research under a faculty mentor. Both will work on the project “Exploring Large Language Models in Agriculture.”'
    ),
  }),
  news({
    slug: '2023-03-varun-aggarwal-girs-awards',
    title: 'Varun Aggarwal Wins at the 2023 Graduate Industrial Research Symposium',
    category: 'Student Achievement',
    published_date: '2023-03-02',
    summary:
      'Ph.D. student Varun Aggarwal won first place for an oral presentation in “Creating the Farm of the Future” and second place in the 3-Minute Thesis competition.',
    content_html: p(
      'Congratulations to Varun Aggarwal, a Ph.D. student in the DAD Lab, for outstanding performance in the 2023 Graduate Industrial Research Symposium. He won first place in oral presentation in the thematic area “Creating the Farm of the Future” and second place in the 3-Minute Thesis competition.'
    ),
    image_url: `${IMG}2023-03-aggarwal-girs-3mt.jpg`,
    image_caption: 'Slide from Varun Aggarwal’s 2023 presentation.',
  }),
  news({
    slug: '2022-10-slic-segmentation-corn-leaves',
    title: 'Image-Based Scouting for Corn Foliar Disease Using SLIC Segmentation',
    category: 'Research Development',
    published_date: '2022-10-27',
    summary:
      'A manuscript led by 2021 SURF fellow Hieu Phan investigates image-based scouting as an efficient alternative to manual scouting for plant disease monitoring.',
    content_html: p(
      'Our latest manuscript investigates the potential of image-based scouting as an efficient alternative to manual scouting for plant disease monitoring. The research was led by Hieu Phan, an undergraduate Computer Science major at Miami University and a 2021 Summer Undergraduate Research Fellow (SURF) at Purdue, with help from Ph.D. candidate Aanis Ahmad. The paper is titled “Identification of Foliar Disease Regions on Corn Leaves Using SLIC Segmentation and Deep Learning Under Uniform Background and Field Conditions.”'
    ),
    image_url: '/images/research/projects/corn-leaf-slic-segmentation-workflow.jpg',
    image_caption: 'Workflow graphic for SLIC segmentation and deep learning-based identification of corn foliar disease regions.',
    source_url: 'https://doi.org/10.1109/ACCESS.2022.3215497',
  }),
  news({
    slug: '2022-10-samia-sohail-sister2sister',
    title: 'Sister2Sister Exchange Scholar Samia Sohail in the DAD Lab',
    category: 'Student Achievement',
    published_date: '2022-10-05',
    summary:
      'Samia Sohail, a Sister2Sister exchange scholar from Pakistan, spent summer 2022 in the DAD Lab; Purdue Engineering featured her project.',
    content_html: p(
      'Samia Sohail, a Sister2Sister exchange scholar from Pakistan, was part of the DAD Lab in summer 2022. Purdue Engineering shared her project idea in a feature story.'
    ),
    source_url: 'https://engineering.purdue.edu/Engr/AboutUs/News/Features/2022-0809-SURF-Sister2Sister',
  }),
  news({
    slug: '2022-10-weather-data-lesson-plan',
    title: 'Lesson Plan for Teaching Data Wrangling with Weather Data',
    category: 'Research Development',
    published_date: '2022-10-03',
    summary:
      'A lesson plan, slides, and exercise set for teaching data wrangling and analysis using weather data is available from the ASABE technical library.',
    content_html: p(
      'Interested in teaching data wrangling and analysis using weather data? Along with co-author Gang Shao, we offer a lesson plan with PowerPoint slides and an exercise set, made possible by funding from the USDA National Institute of Food and Agriculture Higher Education Challenge Grant program and an invitation from the Education, Outreach, & Professional Development Community of ASABE. Course materials can be downloaded in zip format from the ASABE technical library.'
    ),
    source_url: 'https://elibrary.asabe.org/azdez.asp?jid=4&aid=53574&cid=sci2021&v=&i=&t=1',
  }),
  news({
    slug: '2022-10-corn-disease-model-comparison-paper',
    title: 'Comparison of Deep Learning Models for Corn Disease Management',
    category: 'Research Development',
    published_date: '2022-10-03',
    summary:
      'A Journal of the ASABE paper shows UAV imagery can identify diseased regions in corn fields with about 97% accuracy.',
    content_html: p(
      'A paper on corn disease management using deep learning models, “Comparison of Deep Learning Models for Corn Disease Region Location, Identification of Disease Type, and Severity Estimation Using Images Acquired from UAS-Mounted and Handheld Sensors,” is available through the ASABE Technical Library.',
      'The paper shows that UAV imagery helps identify diseased regions in corn fields with approximately 97% accuracy, disease types within diseased regions with approximately 99% accuracy, and disease severity on affected leaves with approximately 94% accuracy. Thanks to co-authors Dr. Guri Johal and Dr. Aly El Gamal.'
    ),
    source_url: 'https://doi.org/10.13031/ja.14895',
  }),
  news({
    slug: '2022-08-geodls-manuscript',
    title: 'GeoDLS Manuscript Published in Remote Sensing',
    category: 'Research Development',
    published_date: '2022-08-23',
    summary:
      'A manuscript on a tool for an automated disease management system that tracks the spread of crop diseases and identifies diseased regions is available.',
    content_html: p(
      'One of our manuscripts describes a potential tool for an automated disease management system to track the spread of crop diseases, identify diseased regions, and provide actionable information to users.'
    ),
    source_url: 'https://doi.org/10.3390/rs14174140',
  }),
  news({
    slug: '2022-08-divyanth-segmentation-paper',
    title: 'Summer Intern Divyanth L. G. Publishes Corn Disease Segmentation Research',
    category: 'Student Achievement',
    published_date: '2022-08-17',
    summary:
      'A 2021 summer undergraduate intern from IIT Kharagpur brought his project to publication with mentoring from Aanis Ahmad.',
    content_html: p(
      'Congratulations to Divyanth L. G., a 2021 summer undergraduate intern from the Indian Institute of Technology Kharagpur, for bringing his summer project to fruition through a research publication. Ph.D. candidate Aanis Ahmad mentored the work. The publication contributes to our effort to develop a field-worthy disease management system for corn.'
    ),
    source_url: 'https://doi.org/10.1016/j.atech.2022.100108',
  }),
  news({
    slug: '2022-07-surf-student-choice-award',
    title: 'Saron Bhoopathy Receives 2022 SURF Student Choice Award',
    category: 'Student Achievement',
    published_date: '2022-07-29',
    summary:
      'SURF fellow Saron Bhoopathy was recognized with the 2022 SURF Student Choice Award.',
    content_html: p(
      'Congratulations to Saron Bhoopathy for being recognized with the 2022 SURF Student Choice Award for outstanding research contributions. SURF Fellows Kenta Hirashima and Samia Sohail Azim also made outstanding contributions to their research projects. Aanis Ahmad and Varun Aggarwal served as graduate mentors.'
    ),
    image_url: `${IMG}2022-07-surf-student-choice-award.jpg`,
    image_caption: '2022 SURF Student Choice Award recognition.',
  }),
  news({
    slug: '2022-07-aanis-ahmad-preliminary-exam',
    title: 'Aanis Ahmad Passes Preliminary Examination',
    category: 'Student Achievement',
    published_date: '2022-07-29',
    summary:
      'Ph.D. student Aanis Ahmad passed his preliminary examination on deep learning-based computer vision for corn disease identification and monitoring.',
    content_html: p(
      'Ph.D. student Aanis Ahmad passed the preliminary examination. The thesis title was “Deep Learning-Based Computer Vision for Disease Identification and Monitoring in Corn.”'
    ),
  }),
  news({
    slug: '2022-07-surf-presentations',
    title: '2022 SURF Student Presentations',
    category: 'Student Achievement',
    published_date: '2022-07-28',
    summary:
      'Three 2022 SURF fellows presented research on robot navigation, UAS-UGV cooperation, and an AI chatbot for farm operations.',
    content_html:
      '<ul><li>Kenta Hirashima: “ROS2/Gazebo Simulation for Autonomous Navigation of Robots in Agriculture” (July 28)</li><li>Saron Bhoopathy: “Software-In-The-Loop Simulation of UAS-UGV Cooperation in Precision Agriculture” (July 29)</li><li>Samia Sohail Azim: “Aiding Farm Operations With Artificial Intelligence Chatbot” (July 29)</li></ul><p>PI: Dr. Dharmendra Saraswat. Graduate mentors: Varun Aggarwal and Aanis Ahmad.</p>',
    image_url: `${IMG}2022-07-surf-2022-cohort.jpg`,
    image_caption: '2022 SURF fellows and mentors.',
  }),
  news({
    slug: '2022-07-asabe-aim-houston',
    title: 'Research Presentations at the 2022 ASABE Annual International Meeting',
    category: 'Conference',
    published_date: '2022-07-18',
    summary:
      'Varun Aggarwal and Aanis Ahmad presented soybean stand count, object detection, and tar spot research in Houston, Texas.',
    content_html:
      '<p>2022 ASABE AIM, Houston, Texas:</p><ul><li>Aggarwal, V., Saraswat, D., and El Gamal, A. Realtime and Offline Soybean Stand Count from an Unmanned Aerial System in Early Growth Season. ASABE Paper No. 2201187.</li><li>Chawla, Y., Aggarwal, V., and Saraswat, D. A Fine-Tuning Based Approach for Generalizing YOLOv4 Network for Soybean Detection in UAS Images.</li><li>Tiwari, S. R., Aggarwal, V., and Saraswat, D. Determining the Effect of Resolution on the Accuracy of Object Detection Networks in UAS Acquired Images. ASABE Paper No. 2201188.</li><li>Ahmad, A., Aggarwal, V., Saraswat, D., El Gamal, A., and Johal, G. S. Deep Learning-Based Disease Identification Tool for Tar Spot in Corn. ASABE Paper No. 2201193.</li></ul>',
    image_url: `${IMG}2022-07-asabe-aim-presentations.jpg`,
    image_caption: 'Varun Aggarwal presenting at the 2022 ASABE Annual International Meeting.',
  }),
  news({
    slug: '2022-06-icpa-presentation',
    title: 'Corn Disease Tracking Presentation at the 2022 ICPA Conference',
    category: 'Conference',
    published_date: '2022-06-28',
    summary:
      'Aanis Ahmad presented “Deep Learning-Based Corn Disease Tracking Using RTK Geolocated UAS Imagery” at the International Conference on Precision Agriculture.',
    content_html: p(
      'Ahmad, A., Aggarwal, V., Saraswat, D., El Gamal, A., and Johal, G. S. (2022). Deep Learning-Based Corn Disease Tracking Using RTK Geolocated UAS Imagery. Abstract ID 8812. Virtual oral presentation, June 28, 2022.'
    ),
  }),
  news({
    slug: '2022-06-plant-disease-review-article',
    title: 'Review Article on Deep Learning for Plant Disease Diagnosis',
    category: 'Research Development',
    published_date: '2022-06-16',
    summary:
      'The DAD Lab’s review of deep learning for plant disease diagnosis, research gaps, and recommended solutions is available.',
    content_html: p(
      'The latest review article from the DAD Lab on deep learning for plant disease diagnosis, research gaps, and recommended solutions is available in Smart Agricultural Technology.'
    ),
    source_url: 'https://doi.org/10.1016/j.atech.2022.100083',
  }),
  news({
    slug: '2022-05-surf-program',
    title: '2022 SURF Program Begins',
    category: 'Announcement',
    published_date: '2022-05-23',
    summary: 'Kenta Hirashima, Saron Bhoopathy, and Samia Sohail Azim joined the DAD Lab as 2022 SURF fellows.',
    content_html: p('Welcome to 2022 SURF fellows Kenta Hirashima, Saron Bhoopathy, and Samia Sohail Azim.'),
  }),
  news({
    slug: 'faculty-mentor-2022',
    title: 'Dr. Saraswat Receives 2022 Outstanding Faculty Mentor Award',
    category: 'Award',
    published_date: '2022-03-18',
    summary:
      'Dr. Saraswat was awarded the 2022 Outstanding Faculty Mentor Award, honored at the College of Engineering Graduate Student Awards Luncheon.',
    content_html: p(
      'Dr. Saraswat has been awarded the 2022 Outstanding Faculty Mentor Award. He was honored at the 2022 College of Engineering Graduate Student Awards Luncheon on April 13.'
    ),
  }),
  news({
    slug: '2022-03-envisioning-2050-ai-agriculture',
    title: 'Invited Talk at “Envisioning 2050 in the Southeast: AI-Driven Innovations in Agriculture”',
    category: 'Conference',
    published_date: '2022-03-09',
    summary:
      'Dr. Saraswat spoke on publicly available datasets for pest management using AI at a USDA-NIFA-sponsored conference.',
    content_html: p(
      'Dr. Saraswat delivered an invited talk on “Usefulness of publicly available datasets for pest management using artificial intelligence (AI) technologies” on March 9, 2022, at the USDA-NIFA-sponsored conference “Envisioning 2050 in the Southeast: AI-Driven Innovations in Agriculture,” a joint effort by land-grant universities in the U.S. Southeast.'
    ),
    source_url: 'https://aaes.auburn.edu/ai-driven-innovations-in-agriculture/',
  }),
  news({
    slug: '2022-03-rtdd-keynote-iit-jodhpur',
    title: 'Keynote on ICT for Plant Disease Management at RTDD-2022',
    category: 'Conference',
    published_date: '2022-03-05',
    summary:
      'Dr. Saraswat gave a keynote on ICT for plant disease management and early warning systems at IIT Jodhpur’s RTDD-2022 conference.',
    content_html: p(
      'Dr. Saraswat gave a keynote address on “ICT for Plant Disease Management and Development of Early Warning Systems” at the Third International Conference on Rural Technology Development and Delivery (RTDD-2022), organized by the Center for Emerging Technologies for Sustainable Development, Indian Institute of Technology Jodhpur, Rajasthan, India.'
    ),
    source_url: 'https://iitj.ac.in/CETSD/RTDD2022/',
  }),
  news({
    slug: '2022-03-applied-computing-agriculture-workshop',
    title: 'Invited Talk on Deep Learning for Weed Identification on IoT Devices',
    category: 'Conference',
    published_date: '2022-03-04',
    summary:
      'Dr. Saraswat spoke at the International Workshop on Applied Computing in Agriculture organized by De La Salle University and National Taiwan University.',
    content_html: p(
      'Dr. Saraswat gave an invited talk, “Harnessing Deep Learning Networks on IoT Devices for Weed Identification,” in a session on “Internet of Things, Connectivity, and Big Data in Agriculture” at the International Workshop on Applied Computing in Agriculture, jointly organized by De La Salle University (Manila) and National Taiwan University (Taipei City).'
    ),
    source_url: 'https://sites.google.com/view/agriapp2022/home',
  }),
  news({
    slug: '2022-02-aanis-ahmad-aetc-poster-award',
    title: 'Aanis Ahmad Wins First Place at ASABE AETC Student Poster Competition',
    category: 'Student Achievement',
    published_date: '2022-02-15',
    summary:
      'Aanis Ahmad received first position in the 2022 ASABE Agricultural Equipment Technology Conference student poster competition.',
    content_html: p(
      'Aanis Ahmad, Ph.D. student, received first position at the 2022 ASABE Agricultural Equipment Technology Conference (AETC) Student Poster Presentation Competition for “Promise of Computer Vision-Based Corn Disease Management Systems Using Deep Learning for Disease Identification and Severity Estimation.”',
      'The research was funded by the Foundation for Food and Agriculture Research (grant 534662) and USDA-NIFA Hatch project 1012501.'
    ),
  }),
  news({
    slug: '2021-11-bihar-citation',
    title: 'Dr. Saraswat Receives Citation from Bihar State Leaders',
    category: 'Award',
    published_date: '2021-11-23',
    summary:
      'Dr. Saraswat received a citation from the Deputy Chief Minister and the Agriculture Minister of the State of Bihar.',
    content_html: p(
      'Dr. Saraswat received a citation from the Deputy Chief Minister, State of Bihar, and the Agriculture Minister, State of Bihar.'
    ),
    image_url: `${IMG}2021-11-bihar-citation.jpg`,
    image_caption: 'Citation ceremony, November 23, 2021.',
  }),
  news({
    slug: '2021-11-isae-keynote-patna',
    title: 'Keynote on Deep Learning for Corn Diseases at ISAE Convention, Patna',
    category: 'Conference',
    published_date: '2021-11-23',
    summary:
      'Dr. Saraswat delivered a keynote at the international symposium of the 55th ISAE Annual Convention in Patna, India.',
    content_html: p(
      'Dr. Saraswat delivered a keynote talk on “Evaluation of Deep Learning Networks for Corn Diseases” at the International Symposium organized as part of the 55th Annual Convention of the Indian Society of Agricultural Engineers (ISAE), November 23, 2021, Patna, India.'
    ),
  }),
  news({
    slug: '2021-10-corn-disease-evaluation-preprint',
    title: 'Evaluating Deep Learning Models for Corn Disease Management',
    category: 'Research Development',
    published_date: '2021-10-25',
    summary:
      'A new preprint promotes evaluation of deep learning models for identifying corn diseases and estimating their severity.',
    content_html: p(
      'Accurate identification of corn diseases and estimation of their severity is an important consideration for developing disease management strategies. Our latest contribution promotes evaluation of deep learning models for corn disease management.'
    ),
    image_url: '/images/research/projects/corn-foliar-disease-types.jpg',
    image_caption: 'Corn foliar diseases studied: northern leaf blight, gray leaf spot, and northern leaf spot.',
    source_url: 'http://arxiv.org/abs/2110.12084',
  }),
  news({
    slug: '2021-10-aanis-ahmad-asabe-aim-student-award',
    title: 'Aanis Ahmad Receives ASABE AIM Student Presentation Competition Award',
    category: 'Student Achievement',
    published_date: '2021-10-14',
    summary:
      'Aanis Ahmad received a 2021 ASABE AIM Student Oral/Poster Presentation Competition Award for the ITSC community.',
    content_html: p(
      'Aanis Ahmad, Ph.D. student, received the 2021 ASABE Annual International Meeting (AIM) Student Oral/Poster Presentation Competition Award for the Information Technology, Sensors, and Control Systems (ITSC) Community for “Comparison of Deep Learning Models for Corn Disease Identification, Tracking, and Severity Estimation Using Images Acquired from UAV-mounted and Handheld Sensor.” Only 30 awards are presented across all ASABE technical communities.',
      'The research was funded by the Foundation for Food and Agriculture Research (grant 534662) and USDA-NIFA Hatch project 1012501.'
    ),
    image_url: `${IMG}2021-10-ahmad-asabe-student-award.jpg`,
    image_caption: 'ASABE Student Presentation Competition certificate, July 2021.',
  }),
  news({
    slug: '2021-09-serb-ovdf-fellow',
    title: 'Hosting a SERB Overseas Visiting Doctoral Fellow',
    category: 'Announcement',
    published_date: '2021-09-03',
    summary:
      'With support from India’s SERB OVDF program, the DAD Lab will host Ms. Sangeetharani Munusamy, a Ph.D. student from IIT Bombay, starting January 2022.',
    content_html: p(
      'Thanks to funding from India’s Science and Engineering Research Board (SERB) Overseas Visiting Doctoral Fellowship (OVDF) program, the DAD Lab will host Ms. Sangeetharani Munusamy, a Ph.D. student from the Indian Institute of Technology Bombay (IITB), for a year starting January 2022. Congratulations to Prof. Eswar Rajasekaran for mentoring a promising scientist in his lab at IITB.'
    ),
  }),
  news({
    slug: '2021-07-surf-presentations',
    title: '2021 SURF Student Presentations',
    category: 'Student Achievement',
    published_date: '2021-07-30',
    summary: 'SURF students Anushka Gupta and Hieu Phan presented water quality visualization and corn disease research.',
    content_html:
      '<ul><li>Anushka Gupta: “Workflow Design and Visualization of Water Quality Data” (mentor: Ben Hancock)</li><li>Hieu Phan: “SLIC Segmentation and Deep Learning for Corn Disease Monitoring Using PlantVillage Dataset” (mentor: Aanis Ahmad)</li></ul><p>PI: Dr. Dharmendra Saraswat.</p>',
    image_url: `${IMG}2021-07-surf-2021-presentations.jpg`,
    image_caption: 'Title slide: “Workflow Design and Visualization of Water Quality Data.”',
  }),
  news({
    slug: '2021-07-reeu-program',
    title: '2021 REEU Data Science for Agriculture Projects',
    category: 'Student Achievement',
    published_date: '2021-07-27',
    summary:
      'Five REEU participants completed projects with mentorship from Prof. Saraswat and the DAD group, presented at the Agriculture Summer Research Poster Session.',
    content_html:
      '<p>REEU is a 10-week research program designed to impart data science skills that complement participants’ agricultural discipline knowledge. The 2021 program had 18 participants from 13 institutions. The following participants completed projects with mentorship from Prof. Saraswat and DAD group members:</p><ul><li>Abraham Alvarez Garcia: IoT Sensing Integration for Indoor Agriculture (with Madhu Lekha Guntaka)</li><li>Austin Berenda: Expenses Correlated with Yield &amp; Cost-Benefit of Hydroponics</li><li>Landon Feese: Wine Grape Variety Database (with Ben Hancock)</li><li>Taylor Mitchel: Locating Waste Sites in North Carolina (with Ben Hancock)</li><li>Lizbeth Plaza-Torres: Counting Corn Plants Using Deep Learning (with Ben Hancock and Varun Aggarwal)</li></ul>',
    image_url: '/images/research/projects/reeu-2021-poster-session.jpg',
    image_caption: 'Lizbeth M. Plaza-Torres with her poster.',
    source_url: 'https://engineering.purdue.edu/Engr/AboutUs/News/Spotlights/2021/abe-summer2021',
  }),
  news({
    slug: '2021-07-madhu-guntaka-ms-defense',
    title: 'Madhu Lekha Guntaka Defends Her Master’s Thesis',
    category: 'Student Achievement',
    published_date: '2021-07-16',
    summary: 'Madhu Lekha Guntaka defended her M.S. thesis, “IoT Based Low-Cost Precision Indoor Farming.”',
    content_html: p(
      'Congratulations! Graduate student Madhu Lekha Guntaka successfully defended her Master’s thesis, “IoT Based Low-Cost Precision Indoor Farming,” on July 16, 2021.',
      'The study developed a low-cost IoT ecosystem using off-the-shelf components in an indoor farm, with cloud-based monitoring and control, and used it to investigate the effects of nutrition, lighting, and density on the growth of microgreens.'
    ),
  }),
  news({
    slug: '2021-07-asabe-aim-presentations',
    title: 'Presentations at the 2021 ASABE Annual International Meeting',
    category: 'Conference',
    published_date: '2021-07-12',
    summary:
      'Dr. Saraswat gave an invited talk on teaching geospatial programming and data science; students presented corn disease, weed, and IoT research.',
    content_html:
      '<p>Invited presentation: Dr. Saraswat spoke on “Teaching Geospatial Programming and Data Science to AgriScience Students: Analyzing Weather Network Data (WND) in Jupyter Notebook” on July 14, 2021, with collaborator Dr. Gang Shao (Purdue Libraries).</p><ul><li>Ahmad, A., Saraswat, D., El Gamal, A., and Johal, G. S. (2021). Comparison of Deep Learning Models for Corn Disease Identification, Tracking, and Severity Estimation Using Images Acquired from UAV-Mounted and Handheld Sensor. ASABE Paper No. 2100566.</li><li>Aggarwal, V., Saraswat, D., and Young, B. (2021). Evaluation of Semantic Segmentation for Assessing Accuracy of Weed Identification at Different Growth Stages Based on UAS Imagery. ASABE Paper No. 2100571.</li><li>Guntaka, M. L., Saraswat, D., and Langenhoven, P. (2021). Design and Evaluation of an IoT-Testbed for Precision Indoor Farming. ASABE Paper No. 2100617.</li></ul>',
  }),
  news({
    slug: '2021-06-aanis-ahmad-itsc-paper-award',
    title: 'Aanis Ahmad Selected for 2021 ASABE ITSC Paper Award',
    category: 'Award',
    published_date: '2021-06-14',
    summary:
      'Only the top 10% of ITSC meeting papers are honored; the award was presented on July 15, 2021.',
    content_html: p(
      'Aanis Ahmad, Ph.D. student, was selected for the 2021 ASABE Information Technology, Sensors, and Control Systems (ITSC) Technical Community Meeting Paper Award. Only the top 10% of ITSC meeting papers are honored.',
      'The paper, “Comparison of Deep Learning Models for Corn Disease Identification, Tracking, and Severity Estimation Using Images Acquired from UAV-Mounted and Handheld Sensors,” is by Aanis Ahmad, Dharmendra Saraswat, Aly El Gamal, and Gurmukh S. Johal. The award was presented on July 15, 2021, during the virtual awards ceremony of the 2021 ASABE Annual International Meeting.'
    ),
  }),
  news({
    slug: '2021-05-india-purdue-lecture-series-panel',
    title: 'Panelist in AgTech Session, India-Purdue Collaborative Lecture Series',
    category: 'Conference',
    published_date: '2021-05-19',
    summary:
      'Dr. Saraswat was an invited panelist in the AgTech session of the 7th Annual India-Purdue Collaborative Lecture Series.',
    content_html: p(
      'Dr. Saraswat was invited as a panelist in the AgTech session on May 19, 2021, as part of the 7th Annual India-Purdue Collaborative Lecture Series in Honor of Bharat Ratna Professor C. N. R. Rao.'
    ),
    source_url: 'https://connect.purdue.edu/s/listing/a0L3k00000pU4Kk/indiapurdue-collaborative-lecture-series',
  }),
  news({
    slug: '2021-05-shah-lab-seed-design-award',
    title: 'Purdue Shah Lab Seed Design Award for an Affordable Seed Drill',
    category: 'Award',
    published_date: '2021-05-07',
    summary:
      'Dr. Saraswat and team received a 2021 Purdue Shah Lab Seed Design award to develop and evaluate an affordable, scalable seed drill for resource-poor farmers in India.',
    content_html: p(
      'Dr. Saraswat and his team were awarded a 2021 Purdue Shah Lab Seed Design award, to be used for developing and evaluating an affordable, scalable seed drill for resource-poor farmers in India. Project collaborators include Ms. Vijayalakshmi Arora, Head of Programme – India, CRS, and Dr. S. K. Patel, Associate Professor, Rajendra Prasad Central Agricultural University (RPCAU), Pusa, Bihar.'
    ),
    source_url: 'https://engineering.purdue.edu/GEP/news/2021/2021-shah-lab-seed-grant-awards',
  }),
  news({
    slug: '2021-05-nudge-prize-cisco-agri-challenge',
    title: 'Faculty Expert for The Nudge Prize and the 2021 Cisco Agri Challenge',
    category: 'Announcement',
    published_date: '2021-05-01',
    summary:
      'Dr. Saraswat served as one of the faculty experts for the US$1 million Nudge Prize and the 2021 Cisco Agri Challenge.',
    content_html: p(
      'Dr. Saraswat served as one of the faculty experts for the US$1 million Nudge Prize and the 2021 Cisco Agri Challenge.'
    ),
    source_url: 'https://www.purdue.edu/india/',
  }),
  news({
    slug: 'informatics-curriculum-2020',
    title: 'Agricultural Informatics Curriculum Initiative',
    category: 'Research Development',
    published_date: '2020',
    summary:
      'A multidisciplinary team led by Dr. Saraswat received USDA-NIFA Higher Education Challenge funding to develop agricultural informatics education resources with partner institutions in 2020.',
    content_html: p(
      'A multidisciplinary team led by Dr. Saraswat received USDA-NIFA Higher Education Challenge funding to develop agricultural informatics education resources with partner institutions in 2020.'
    ),
  }),
  news({
    slug: '2019-07-gras-present-asabe-aim',
    title: 'Graduate Research Assistants Present at 2019 ASABE AIM',
    category: 'Conference',
    published_date: '2019-07-10',
    summary:
      'Jeff Fiechter and Aaron Etienne presented machine learning research for digital soil mapping and weed identification in Boston.',
    content_html: p(
      'Graduate research assistants Jeff Fiechter and Aaron Etienne presented their research on machine learning for digital soil mapping and weed identification, respectively, at the 2019 ASABE Annual International Meeting in Boston, July 7–10.'
    ),
  }),
  news({
    slug: '2019-07-jeff-fiechter-ms-defense',
    title: 'Jeff Fiechter Defends His Master’s Research',
    category: 'Student Achievement',
    published_date: '2019-07-18',
    summary: 'Jeff Fiechter defended his M.S. research on a field-based soil mapping tool.',
    content_html: p(
      'Jeff Fiechter successfully defended his master’s research, “Development of a Field Based Soil Mapping Tool Using Comparative Evaluation of Geostatistics and Machine Learning: A Case Study in Indiana,” on July 18, 2019. Other committee members: Dennis Buckmaster and James Krogmeier.'
    ),
  }),
  news({
    slug: '2019-07-aaron-etienne-ms-defense',
    title: 'Aaron Etienne Defends His Master’s Research',
    category: 'Student Achievement',
    published_date: '2019-07-17',
    summary: 'Aaron Etienne defended his M.S. research on automated weed detection using UAS-based imagery.',
    content_html: p(
      'Aaron Etienne successfully defended his master’s research, “Automated Weed Detection Using Machine Learning Techniques on UAS-Based Imagery,” on July 16, 2019. Other committee members: Dennis Buckmaster and Bryan G. Young.'
    ),
  }),
  news({
    slug: '2019-07-aabfeio-invited-talk',
    title: 'Invited Talk on the Food-Energy-Water Nexus at 2019 ASABE AIM',
    category: 'Conference',
    published_date: '2019-07-08',
    summary:
      'Dr. Saraswat spoke at an AABFEIO special session at the 2019 ASABE Annual International Meeting in Boston.',
    content_html: p(
      'Dr. Saraswat delivered an invited talk, “Sustainable Food-Energy-Water Nexus: Potential Options in Indian Context,” during a special session organized by the Association of Agricultural, Biological, and Food Engineers of Indian Origin (AABFEIO) at the 2019 ASABE AIM in Boston on July 8.'
    ),
  }),
  news({
    slug: '2019-05-bhopal-invited-talk',
    title: 'Invited Talk in Bhopal, India',
    category: 'Conference',
    published_date: '2019-05-20',
    summary: 'Dr. Saraswat spoke on Purdue and research at the DAD Lab at Patel Group of Institutions, Bhopal.',
    content_html: p(
      'Dr. Saraswat delivered an invited talk, “Purdue and Research at Digital Agriculture Discovery (DAD) Laboratory,” at Patel Group of Institutions, Bhopal, India, on May 20, 2019.'
    ),
  }),
  news({
    slug: '2019-04-aaron-etienne-outstanding-ms-student',
    title: 'Aaron Etienne Named 2019 Outstanding Master’s Student',
    category: 'Student Achievement',
    published_date: '2019-04-12',
    summary: 'The ABE Graduate Committee selected Aaron Etienne as the 2019 Outstanding Master’s Student.',
    content_html: p(
      'Congratulations to Aaron Etienne, a DAD group member, on his selection as the 2019 Outstanding Master’s Student by the ABE Graduate Committee. Aaron was recognized during the Alumni Banquet on April 18, 2019.'
    ),
  }),
  news({
    slug: '2019-04-anthony-hearst-phd-defense',
    title: 'Anthony A. Hearst Defends His Ph.D. Thesis',
    category: 'Student Achievement',
    published_date: '2019-04-10',
    summary:
      'Anthony A. Hearst defended his Ph.D. thesis on UAS remote sensing of soybean canopy and moisture stress.',
    content_html: p(
      'Anthony A. Hearst defended his Ph.D. thesis, “Remote Sensing of Soybean Canopy Cover, Color, and Visible Indicators of Moisture Stress Using Imagery from Unmanned Aircraft Systems,” on April 10, 2019. Other committee members: Melba M. Crawford, Bernie Engel, and Katy M. Rainey.'
    ),
  }),
  news({
    slug: '2019-04-uav-advanced-technologies-funding',
    title: 'New Funding for UAV and Advanced Technologies in Agriculture Research',
    category: 'Research Development',
    published_date: '2019-04-04',
    summary:
      'A new award supports a Ph.D. student evaluating deep learning algorithms and developing an efficient computing platform for UAVs.',
    content_html: p(
      'A new award for Ph.D.-level graduate student support has been received for evaluating deep learning algorithms, developing an efficient computing platform for UAVs, and engaging in outreach. The funding is available starting August 2019 for three years.'
    ),
  }),
  news({
    slug: '2019-03-urban-farm-automation-funding',
    title: 'New Funding for Urban Farm Automation',
    category: 'Research Development',
    published_date: '2019-03-01',
    summary:
      'Dr. Saraswat, Dr. Petrus Langenhoven, and Ms. Emily Brown received 2019 AgSeed funding for indoor urban farm microgreen production.',
    content_html: p(
      'Dr. Saraswat teamed up with Dr. Petrus Langenhoven and Ms. Emily Brown to obtain 2019 AgSeed funding for the project “Controlled environment micro green production efficiency optimization for indoor urban farms.”'
    ),
  }),
  news({
    slug: '2019-01-isae-keynote-uas-weed-monitoring',
    title: 'Keynote on Unmanned Aerial Systems for Weed Monitoring at ISAE, Varanasi',
    category: 'Conference',
    published_date: '2019-01-29',
    summary:
      'Dr. Saraswat delivered a keynote at the 53rd Annual Convention of the Indian Society of Agricultural Engineers in Varanasi, India.',
    content_html: p(
      'Dr. Saraswat delivered a keynote address at the 53rd Annual Convention of the Indian Society of Agricultural Engineers (ISAE) in Varanasi, India, on “Unmanned Aerial Systems for Weed Monitoring.”'
    ),
    image_url: `${IMG}2019-01-isae-keynote-varanasi.jpg`,
    image_caption: 'Keynote presentation at the 53rd ISAE Annual Convention, Varanasi.',
  }),
  news({
    slug: '2019-01-nifa-reeu-award',
    title: 'NIFA Award for Undergraduate Summer Research Program in Digital Agriculture',
    category: 'Research Development',
    published_date: '2019-01-13',
    summary:
      'A USDA-NIFA REEU award (2019–2023) supports undergraduates spending summers at Purdue in data science and digital agriculture.',
    content_html: p(
      'Drs. Saraswat and Buckmaster (PI) from ABE and collaborators Drs. Holland (ENTM), Ward (STAT), Krogmeier (ECE), and Erickson (AGRY) received funding from the USDA National Institute of Food and Agriculture (NIFA) under the Research and Extension Experiential Learning for Undergraduates (REEU) program for 01/01/2019–12/31/2023.',
      'The program supports undergraduate students spending most of the summer at Purdue University in West Lafayette for a 12-week data science and digital agriculture experience.'
    ),
  }),
];
