import type { TeamMember } from '../../types/cms.ts';

/**
 * Lab roster migrated from the former DAD Lab website "People" page
 * (dad.saraswat.rcac.purdue.edu/index.php/people/, last updated 2023-2024) and
 * its dated news posts. Degree completions come from the dated thesis-defense
 * announcements on that site. Positions listed for alumni are those shown on
 * the former site and may have changed since.
 */
const P = '/images/people/members/';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'pi-saraswat',
    name: 'Dr. Dharmendra Saraswat',
    role: 'Principal Investigator',
    category: 'Faculty',
    focus: 'Digital agriculture, agricultural informatics, remote sensing, and environmental modeling',
    email: 'saraswat@purdue.edu',
    photoUrl: '/images/people/principal-investigator/dharmendra-saraswat.jpg',
  },
  {
    id: 'staff-hancock',
    name: 'Benjamin (Ben) Hancock',
    role: 'Application Developer, Agricultural and Biological Engineering',
    category: 'Staff',
    focus: 'Staff programmer for DAD Lab web tools; mentor for summer research projects.',
    photoUrl: `${P}ben-hancock.jpg`,
  },
  {
    id: 'grad-aggarwal',
    name: 'Varun Aggarwal',
    role: 'Ph.D. Student, Agricultural and Biological Engineering',
    category: 'PhD Student',
    focus: 'UAS imagery and deep learning for soybean stand counting and weed identification.',
    photoUrl: `${P}varun-aggarwal.jpg`,
  },
  {
    id: 'grad-adewumi',
    name: 'Adeayo Adewumi',
    role: 'Ph.D. Student, Agricultural and Biological Engineering',
    category: 'PhD Student',
    focus: 'Generalizing YOLO networks for soybean plant stand count across fields.',
  },
  {
    id: 'grad-lin',
    name: 'Shih-Yun Lin',
    role: 'M.S. Student, Agricultural and Biological Engineering',
    category: 'MS Student',
    focus: 'Deep learning applications for disease identification and prediction in rice.',
    photoUrl: `${P}shih-yun-lin.jpg`,
  },
  {
    id: 'visiting-ramalingam',
    name: 'Selvaprakash Ramalingam',
    role: 'Visiting Scholar (2023), Agricultural and Biological Engineering',
    category: 'Visiting Researcher',
    focus: '2023 visiting scholar in the DAD Lab.',
    photoUrl: `${P}selvaprakash-ramalingam.jpg`,
  },
  {
    id: 'visiting-tiwari',
    name: 'Pooja Tiwari',
    role: 'Visiting Scholar (2021-2022), Atmospheric Science',
    category: 'Visiting Researcher',
    focus: '2021-2022 visiting scholar in the DAD Lab.',
    photoUrl: `${P}pooja-tiwari.jpg`,
  },
  {
    id: 'visiting-tyagi',
    name: 'Shoobhangi Tyagi',
    role: 'Visiting SERB Scholar (2021-2022), Atmospheric Sciences',
    category: 'Visiting Researcher',
    focus:
      'Ph.D. candidate at the Indian Institute of Technology Delhi; flash drought and machine learning. 2023 European Geosciences Union OSPP award.',
    photoUrl: `${P}shoobhangi-tyagi.jpg`,
  },
  {
    id: 'visiting-saurav',
    name: 'Ankit Saurav',
    role: 'Visiting Scholar (2021-2022), Civil Engineering',
    category: 'Visiting Researcher',
    focus: '2021-2022 visiting scholar in the DAD Lab.',
  },
  {
    id: 'visiting-saini',
    name: 'Ankit Kumar Saini',
    role: 'Visiting Scholar (2021-2022), Civil Engineering',
    category: 'Visiting Researcher',
    focus: '2021-2022 visiting scholar in the DAD Lab.',
  },
  {
    id: 'ug-mehta',
    name: 'Smit Mehta',
    role: '2024 Summer Intern, Indian Institute of Technology Gandhinagar (Mechanical Engineering)',
    category: 'Undergraduate',
    focus: 'Evaluating computational approaches for agricultural field data analysis.',
    photoUrl: `${P}smit-mehta.jpg`,
  },
  {
    id: 'ug-ha',
    name: 'Son Thai Ha',
    role: '2023 SURF Fellow and 2023-2024 OUR Scholar, Purdue Computer Science',
    category: 'Undergraduate',
    focus: 'Chatbots and large language models for agricultural extension.',
    photoUrl: `${P}son-thai-ha.jpg`,
  },
  {
    id: 'ug-hwang',
    name: 'Jungeun (Jung) Hwang',
    role: '2023 SURF Fellow and 2023-2024 OUR Scholar, Purdue Computer Science',
    category: 'Undergraduate',
    focus:
      'Intent classification-based interactive chatbot for weed management; 2023 SURF Best Poster Presenter award.',
    photoUrl: `${P}jungeun-hwang.jpg`,
  },
  {
    id: 'ug-patel',
    name: 'Kush Patel',
    role: '2023 Summer Intern, Indian Institute of Technology Gandhinagar',
    category: 'Undergraduate',
    focus: '2023 summer research intern in the DAD Lab.',
    photoUrl: `${P}kush-patel.jpg`,
  },
  {
    id: 'ug-bhoopathy',
    name: 'Saron Bhoopathy',
    role: '2022 SURF Fellow, Purdue Aeronautical and Astronautical Engineering and Biological Sciences',
    category: 'Undergraduate',
    focus:
      'Software-in-the-loop simulation of UAS-UGV cooperation in precision agriculture; 2022 SURF Student Choice Award.',
    photoUrl: `${P}saron-bhoopathy.jpg`,
  },
  {
    id: 'ug-hirashima',
    name: 'Kenta Hirashima',
    role: '2022 SURF Fellow, Mechanical Engineering, University of Illinois Urbana-Champaign',
    category: 'Undergraduate',
    focus: 'ROS2/Gazebo simulation for autonomous navigation of robots in agriculture.',
    photoUrl: `${P}kenta-hirashima.jpg`,
  },
  {
    id: 'ug-azim',
    name: 'Samia Sohail Azim',
    role: '2022 SURF Fellow (Sister2Sister exchange), Computer Science, Institute of Business Administration, Karachi',
    category: 'Undergraduate',
    focus: 'Aiding farm operations with an artificial intelligence chatbot.',
    photoUrl: `${P}samia-sohail-azim.jpg`,
  },
  {
    id: 'ug-riaziat',
    name: 'Ava Riaziat',
    role: '2021 SURF Fellow, Purdue First-Year Engineering',
    category: 'Undergraduate',
    focus: '2021 summer undergraduate research fellow in the DAD Lab.',
    photoUrl: `${P}ava-riaziat.jpg`,
  },
  {
    id: 'alum-ahmad',
    name: 'Dr. Aanis Ahmad',
    role: 'Ph.D. 2023, Electrical and Computer Engineering',
    category: 'Alumni',
    focus:
      'Thesis: Deep Learning-Based Computer Vision for Disease Identification and Monitoring in Corn Systems (defended November 17, 2023).',
    photoUrl: `${P}aanis-ahmad.jpg`,
  },
  {
    id: 'alum-klein',
    name: 'Hannah Klein',
    role: 'M.S. 2023, Agricultural and Biological Engineering',
    category: 'Alumni',
    focus:
      'Thesis: Evaluation and Optimization of Deep Learning Networks for Plant Disease Forecasting and Assessment of their Generalizability for Early Warning Systems (defended April 11, 2023).',
    photoUrl: `${P}hannah-klein.jpg`,
  },
  {
    id: 'alum-guntaka',
    name: 'Madhu Lekha Guntaka',
    role: 'M.S. 2021, Civil Engineering',
    category: 'Alumni',
    focus: 'Thesis: IoT Based Low-Cost Precision Indoor Farming (defended July 16, 2021).',
    photoUrl: `${P}madhu-lekha-guntaka.jpg`,
  },
  {
    id: 'alum-hearst',
    name: 'Dr. Anthony A. Hearst',
    role: 'Ph.D. 2019, Agricultural and Biological Engineering',
    category: 'Alumni',
    focus:
      'Thesis: Remote Sensing of Soybean Canopy Cover, Color, and Visible Indicators of Moisture Stress Using Imagery from Unmanned Aircraft Systems (defended April 10, 2019).',
    photoUrl: `${P}anthony-hearst.jpg`,
  },
  {
    id: 'alum-etienne',
    name: 'Aaron Etienne',
    role: 'M.S. 2019, Agricultural and Biological Engineering',
    category: 'Alumni',
    focus:
      'Thesis: Automated Weed Detection Using Machine Learning Techniques on UAS-Based Imagery (defended July 16, 2019). 2019 ABE Outstanding Master’s Student.',
    photoUrl: `${P}aaron-etienne.jpg`,
  },
  {
    id: 'alum-fiechter',
    name: 'Jeff Fiechter',
    role: 'M.S. 2019, Agricultural and Biological Engineering',
    category: 'Alumni',
    focus:
      'Thesis: Development of a Field Based Soil Mapping Tool Using Comparative Evaluation of Geostatistics and Machine Learning: A Case Study in Indiana (defended July 18, 2019).',
    photoUrl: `${P}jeff-fiechter.jpg`,
  },
  {
    id: 'alum-pai',
    name: 'Dr. Naresh Pai',
    role: 'Alumnus; Senior Research Scientist, Bayer (as listed on the former lab website)',
    category: 'Alumni',
    focus: 'SWAT watershed modeling tools, including Field_SWAT, SWAT2009_LUC, and streambank delineation.',
    photoUrl: `${P}naresh-pai.jpg`,
  },
  {
    id: 'alum-singh',
    name: 'Dr. Gurdeep Singh',
    role: 'Alumnus; Research Data Engineer, The Climate Corporation (as listed on the former lab website)',
    category: 'Alumni',
    focus: 'Marginal land mapping in SWAT, conservation practices, and the LUU Checker framework.',
    photoUrl: `${P}gurdeep-singh.jpg`,
  },
  {
    id: 'alum-kumar',
    name: 'Eeshan Kumar',
    role: 'Alumnus; Water Resource Engineer, Wood plc (as listed on the former lab website)',
    category: 'Alumni',
    focus: 'Bioenergy crop impacts on water quality using static and dynamic land use change modeling.',
    photoUrl: `${P}eeshan-kumar.jpg`,
  },
  {
    id: 'alum-thomas',
    name: 'Nikhil Thomas',
    role: 'Alumnus; Software Engineer, Red Hat (as listed on the former lab website)',
    category: 'Alumni',
    focus: 'Former DAD Lab member.',
    photoUrl: `${P}nikhil-thomas.jpg`,
  },
];
