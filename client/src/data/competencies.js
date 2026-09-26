export const COMPETENCY_CATEGORIES = {
  STATISTICAL: "Statistical",
  TECHNICAL: "Technical",
  DIGITAL_GOV: "Digital Governance",
  BEHAVIOURAL: "Behavioural",
};

export const COMPETENCIES = [
  {
    id: "comp-stat-1",
    name: "Survey Design & Sampling",
    category: COMPETENCY_CATEGORIES.STATISTICAL,
    code: "STAT-01",
    description: "Formulation of sampling frames, stratified multi-stage sampling, sample size determination, and non-sampling error minimization in large-scale socio-economic surveys.",
    levelDescriptions: {
      1: "Understands basic simple random sampling and elementary probability theory.",
      2: "Can construct single-stage stratified frames and calculate standard sample errors.",
      3: "Designs multi-stage stratified sampling schemes for household and enterprise surveys (e.g. NSS/PLFS).",
      4: "Calibrates survey weights, handles non-response imputation, and designs complex rotating panel surveys.",
      5: "Authority on national statistical survey methodology, advising international agencies (UNSD/WB)."
    }
  },
  {
    id: "comp-stat-2",
    name: "National Accounts & GDP",
    category: COMPETENCY_CATEGORIES.STATISTICAL,
    code: "STAT-02",
    description: "System of National Accounts (SNA 2008/2025), Gross Value Added (GVA), Gross Domestic Product (GDP) compilation, input-output tables, and supply-use tables.",
    levelDescriptions: {
      1: "Aware of macroeconomic indicators (GDP, GVA) and basic production approach.",
      2: "Calculates sectoral GVA for organized manufacturing and agriculture using secondary data.",
      3: "Compiles institutional sector accounts, FISIM allocation, and consumption of fixed capital (CFC).",
      4: "Formulates Supply and Use Tables (SUT), leads rebasing of national accounts series.",
      5: "National expert leading macro-economic statistical revisions and international statistical harmonization."
    }
  },
  {
    id: "comp-stat-3",
    name: "Price Statistics (CPI / WPI)",
    category: COMPETENCY_CATEGORIES.STATISTICAL,
    code: "STAT-03",
    description: "Consumer Price Index (CPI), Wholesale Price Index (WPI), Laspeyres/Paasche/Fisher indices, item weighting baskets, and spatial price indices.",
    levelDescriptions: {
      1: "Understands price index basics and inflation calculation formulae.",
      2: "Collects and validates primary retail and wholesale price quotations across centres.",
      3: "Constructs state-level sub-indices and implements geometric mean index compilation.",
      4: "Designs item baskets, updates base years, and executes hedonic quality adjustments.",
      5: "Directs national inflation metrics governance and advises Monetary Policy Committee (RBI)."
    }
  },
  {
    id: "comp-stat-4",
    name: "Labour & Employment Statistics",
    category: COMPETENCY_CATEGORIES.STATISTICAL,
    code: "STAT-04",
    description: "Periodic Labour Force Survey (PLFS) concepts, Usual Status (ps+ss), Current Weekly Status (CWS), LFPR, WPR, and informal economy measurement.",
    levelDescriptions: {
      1: "Knows elementary employment definitions (Employed, Unemployed, Out of Labour Force).",
      2: "Analyzes quarterly PLFS bulletin tables and interprets activity status codes.",
      3: "Processes unit-level PLFS microdata to compute gender-disaggregated unemployment rates.",
      4: "Designs longitudinal rotational sampling and informal employment statistical frameworks.",
      5: "Represents India at ILO International Conferences of Labour Statisticians (ICLS)."
    }
  },
  {
    id: "comp-stat-5",
    name: "Index of Industrial Production (IIP)",
    category: COMPETENCY_CATEGORIES.STATISTICAL,
    code: "STAT-05",
    description: "Monthly compilation of industrial growth across Mining, Manufacturing, and Electricity sectors; item baskets; production estimation; and ASI integration.",
    levelDescriptions: {
      1: "Familiar with monthly IIP releases and sector weights.",
      2: "Validates monthly production returns from source agencies/ministries.",
      3: "Implements deflation techniques and computes use-based classification indices.",
      4: "Executes base year revisions and harmonizes Annual Survey of Industries (ASI) with monthly series.",
      5: "National focal point for industrial output analytics and index modernization."
    }
  },
  {
    id: "comp-stat-6",
    name: "SDG Indicators & Monitoring",
    category: COMPETENCY_CATEGORIES.STATISTICAL,
    code: "STAT-06",
    description: "National Indicator Framework (NIF) for Sustainable Development Goals, target tracking, metadata alignment, and sub-national localization.",
    levelDescriptions: {
      1: "Aware of the 17 UN SDGs and high-level national targets.",
      2: "Collects indicator data from line ministries for the National Indicator Framework.",
      3: "Validates metadata sheets and computes composite index scores across States/UTs.",
      4: "Formulates new localized indicators and coordinates with NITI Aayog SDG Index team.",
      5: "Advises UN Statistical Commission on global Tier-I/II/III SDG methodology."
    }
  },
  {
    id: "comp-tech-1",
    name: "Python for Official Statistics",
    category: COMPETENCY_CATEGORIES.TECHNICAL,
    code: "TECH-01",
    description: "Automated data pipelines, NumPy, Pandas for survey microdata processing, statistical hypothesis testing, and web scraping for price data.",
    levelDescriptions: {
      1: "Writes basic Python syntax, loops, and script execution.",
      2: "Loads and manipulates datasets with Pandas (filtering, groupby, merges).",
      3: "Develops automated scripts to clean multi-gigabyte survey microdata and generate tabular reports.",
      4: "Builds modular data pipelines, custom statistical packages, and automated anomaly detection.",
      5: "Architects enterprise-scale statistical computing infrastructure and open-source packages for GoI."
    }
  },
  {
    id: "comp-tech-2",
    name: "Advanced R & R-Shiny",
    category: COMPETENCY_CATEGORIES.TECHNICAL,
    code: "TECH-02",
    description: "Tidyverse, survey package for complex survey weights, R-Markdown reproducible reporting, and interactive dashboard creation via R-Shiny.",
    levelDescriptions: {
      1: "Executes simple R calculations and summary statistics.",
      2: "Uses dplyr and ggplot2 for exploratory data analysis.",
      3: "Applies survey package (svydesign, svyby) for variance estimation under complex designs.",
      4: "Develops interactive R-Shiny analytical portals for dissemination of official statistics.",
      5: "Conducts specialized training for Indian Statistical Service (ISS) probationers at NSSTA."
    }
  },
  {
    id: "comp-tech-3",
    name: "SQL & Data Warehousing",
    category: COMPETENCY_CATEGORIES.TECHNICAL,
    code: "TECH-03",
    description: "Relational database querying, multi-table joins, subqueries, indexing, PostgreSQL/MySQL management, and database schema design for censuses.",
    levelDescriptions: {
      1: "Executes basic SELECT, WHERE, and ORDER BY statements.",
      2: "Performs complex JOINs, aggregate queries, and GROUP BY with HAVING.",
      3: "Optimizes queries with indexing, writes stored procedures, and manages analytical databases.",
      4: "Designs dimensional data warehouses (star/snowflake schemas) for longitudinal census archives.",
      5: "Directs MoSPI data warehouse architecture and inter-ministerial database integration."
    }
  },
  {
    id: "comp-tech-4",
    name: "GIS & Spatial Mapping",
    category: COMPETENCY_CATEGORIES.TECHNICAL,
    code: "TECH-04",
    description: "QGIS, ArcGIS, geo-referencing, digital enumeration blocks (EB), choropleth mapping, and satellite imagery integration for agricultural statistics.",
    levelDescriptions: {
      1: "Familiar with coordinate systems and opening GIS shapefiles.",
      2: "Creates thematic maps and choropleths using Census/Survey boundaries.",
      3: "Performs spatial joins, buffer analysis, and digital enumeration block delineation.",
      4: "Integrates remote sensing data (Sentinel/ISRO Bhuvan) with crop cutting experiments.",
      5: "Leads national spatial statistical infrastructure (UN-GGIM India chapter)."
    }
  },
  {
    id: "comp-tech-5",
    name: "AI & Machine Learning for Statistics",
    category: COMPETENCY_CATEGORIES.TECHNICAL,
    code: "TECH-05",
    description: "Supervised and unsupervised learning, time-series forecasting (ARIMA/Prophet), automated text classification for economic activity codes (NIC/NCO).",
    levelDescriptions: {
      1: "Understands fundamental ML concepts (regression, classification, clustering).",
      2: "Trains standard scikit-learn models and evaluates with RMSE, F1-score.",
      3: "Builds NLP models for auto-coding free-text job descriptions to 5-digit NCO codes.",
      4: "Deploys advanced forecasting models for early economic indicators (Nowcasting GDP).",
      5: "Directs MoSPI Center of Excellence in Artificial Intelligence for Official Statistics."
    }
  },
  {
    id: "comp-tech-6",
    name: "Cloud & Open Data APIs",
    category: COMPETENCY_CATEGORIES.TECHNICAL,
    code: "TECH-06",
    description: "RESTful API development, data dissemination via data.gov.in, MeghRaj government cloud deployment, and secure API gateway integration.",
    levelDescriptions: {
      1: "Consumes external REST APIs using Postman or Python requests.",
      2: "Deploys basic micro-services on NIC MeghRaj cloud virtual machines.",
      3: "Builds FastAPI/Flask endpoints for publishing real-time statistical series.",
      4: "Architects secure, rate-limited public API portals adhering to Open Data guidelines.",
      5: "Establishes National Data Architecture standards for inter-ministerial data exchange."
    }
  },
  {
    id: "comp-gov-1",
    name: "Data Privacy & DPDP Act 2023",
    category: COMPETENCY_CATEGORIES.DIGITAL_GOV,
    code: "GOV-01",
    description: "Digital Personal Data Protection Act 2023 compliance, statistical disclosure control (SDC), anonymization, microdata release safeguards, and consent architectures.",
    levelDescriptions: {
      1: "Understands basic privacy principles and definition of personal data.",
      2: "Identifies Personally Identifiable Information (PII) in survey questionnaires.",
      3: "Applies k-anonymity, l-diversity, and cell suppression to public microdata releases.",
      4: "Formulates institutional Data Protection Impact Assessments (DPIA) for national censuses.",
      5: "Advises Data Protection Board of India on statistical research exemptions and standards."
    }
  },
  {
    id: "comp-gov-2",
    name: "Cyber Security in Gov Systems",
    category: COMPETENCY_CATEGORIES.DIGITAL_GOV,
    code: "GOV-02",
    description: "CERT-In guidelines, Information Security Management Systems (ISO 27001), endpoint security, role-based access control (RBAC), and crisis management.",
    levelDescriptions: {
      1: "Follows cyber hygiene (strong passwords, phishing awareness, 2FA).",
      2: "Implements secure configuration for data collection tablets and laptops in field.",
      3: "Conducts vulnerability audits and coordinates with NIC CISO for security clearances.",
      4: "Formulates cyber resilience frameworks for mission-critical survey portals.",
      5: "Chief Information Security Officer (CISO) level governance and disaster recovery leadership."
    }
  },
  {
    id: "comp-gov-3",
    name: "India Digital Public Infrastructure",
    category: COMPETENCY_CATEGORIES.DIGITAL_GOV,
    code: "GOV-03",
    description: "India Stack, Aadhaar-based authentication, DigiLocker, API Setu, PM GatiShakti spatial platform, and national data registry linkages.",
    levelDescriptions: {
      1: "Familiar with India Stack pillars (Identity, Payments, Data).",
      2: "Utilizes API Setu for integrating government database verification.",
      3: "Links survey sampling frames with administrative registries (GSTN, MCA21, EPFO).",
      4: "Designs interoperability workflows between MoSPI data platforms and PM GatiShakti.",
      5: "Steering committee member for National Data Governance Framework Policy (NDGFP)."
    }
  },
  {
    id: "comp-beh-1",
    name: "Public Leadership & Ethics",
    category: COMPETENCY_CATEGORIES.BEHAVIOURAL,
    code: "BEH-01",
    description: "Adherence to Fundamental Principles of Official Statistics (UNFPOS), civil service conduct rules, transparency, objective truth-telling, and integrity.",
    levelDescriptions: {
      1: "Demonstrates personal integrity and adheres to Central Civil Services conduct rules.",
      2: "Promotes transparency and objectivity in reporting statistical discrepancies.",
      3: "Mentors junior officers, upholds statistical independence against external pressures.",
      4: "Leads multi-disciplinary teams in high-stakes national survey operations.",
      5: "Exemplifies ethical leadership recognized at National Statistical Commission (NSC) level."
    }
  },
  {
    id: "comp-beh-2",
    name: "Stakeholder Communication",
    category: COMPETENCY_CATEGORIES.BEHAVIOURAL,
    code: "BEH-02",
    description: "Effective dissemination of complex statistical findings to policymakers, media, academia, and the public; bilingual presentation skills; press briefs.",
    levelDescriptions: {
      1: "Drafts clear internal notes and official memoranda.",
      2: "Prepares executive slide decks and statistical infographics for departmental meetings.",
      3: "Drafts official press notes and explains statistical methodologies to line ministries.",
      4: "Handles media queries and parliamentary questions (Starred/Unstarred) with accuracy.",
      5: "Represents Government of India at bilateral summits and parliamentary standing committees."
    }
  },
  {
    id: "comp-beh-3",
    name: "Field Survey Project Management",
    category: COMPETENCY_CATEGORIES.BEHAVIOURAL,
    code: "BEH-03",
    description: "Logistics planning for all-India field operations, budget management (GFR 2017), supervisory monitoring (FOD), vendor management, and crisis resolution.",
    levelDescriptions: {
      1: "Executes designated field inspection tasks within allocated timeline.",
      2: "Supervises regional field teams and conducts primary data validation checks.",
      3: "Manages regional office survey logistics, vehicle deployments, and enumerator training.",
      4: "Directs all-India field operations for economic census and large sample rounds.",
      5: "Orchestrates multi-hundred crore national statistical census operations."
    }
  }
];
