export const QUESTION_BANK = [
  {
    id: "q-001",
    competencyId: "comp-stat-1",
    competencyName: "Survey Design & Sampling",
    question: "In a stratified two-stage sampling design for the Periodic Labour Force Survey (PLFS), what typically serves as the First Stage Unit (FSU) in urban areas?",
    options: [
      "Individual Household",
      "Urban Frame Survey (UFS) Block",
      "District Municipality Ward",
      "Census Enumeration Block of 500+ individuals"
    ],
    correctAnswer: 1,
    explanation: "Under NSSO/PLFS survey design, Urban Frame Survey (UFS) blocks demarcated by MoSPI serve as the First Stage Units (FSUs) in urban areas, while Census villages serve as FSUs in rural areas.",
    difficulty: "Intermediate",
    sourceDocument: "MoSPI_PLFS_Survey_Design_Manual_2024.pdf"
  },
  {
    id: "q-002",
    competencyId: "comp-stat-1",
    competencyName: "Survey Design & Sampling",
    question: "Which of the following techniques is predominantly used in official statistics to calibrate sample survey weights against known auxiliary population totals from the Census?",
    options: [
      "GREG (Generalized Regression) Estimator",
      "K-Means Clustering Estimator",
      "Principal Component Projection",
      "Simple Ratio Imputation"
    ],
    correctAnswer: 0,
    explanation: "The Generalized Regression (GREG) estimator is the international standard applied by statistical agencies to adjust sample design weights using known population margin totals, reducing both variance and non-coverage bias.",
    difficulty: "Advanced",
    sourceDocument: "NSSTA_Sampling_Theory_Monograph.pdf"
  },
  {
    id: "q-003",
    competencyId: "comp-stat-2",
    competencyName: "National Accounts & GDP",
    question: "In the National Accounts System (SNA 2008) adopted by MoSPI, how is Gross Domestic Product (GDP) at market prices related to Gross Value Added (GVA) at basic prices?",
    options: [
      "GDP = GVA at basic prices - Product Taxes + Product Subsidies",
      "GDP = GVA at basic prices + Product Taxes - Product Subsidies",
      "GDP = GVA at factor cost + Net Capital Inflow",
      "GDP = GVA at basic prices + Production Taxes - Production Subsidies"
    ],
    correctAnswer: 1,
    explanation: "Under SNA 2008 methodology: GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies. Note that production taxes/subsidies are already incorporated into GVA at basic prices.",
    difficulty: "Intermediate",
    sourceDocument: "National_Accounts_Statistics_Methodology_NAD.pdf"
  },
  {
    id: "q-004",
    competencyId: "comp-stat-2",
    competencyName: "National Accounts & GDP",
    question: "What does the abbreviation FISIM stand for in the context of compiling GVA for the financial services sector?",
    options: [
      "Financial Institution Standard Inflation Multiplier",
      "Fiscal Income from Sovereign Investment Mechanisms",
      "Financial Intermediation Services Indirectly Measured",
      "Federal Interest Spread & Investment Metric"
    ],
    correctAnswer: 2,
    explanation: "FISIM refers to 'Financial Intermediation Services Indirectly Measured'. It captures the output of financial intermediaries arising from the interest rate spread between loans and deposits.",
    difficulty: "Intermediate",
    sourceDocument: "National_Accounts_Statistics_Methodology_NAD.pdf"
  },
  {
    id: "q-005",
    competencyId: "comp-stat-3",
    competencyName: "Price Statistics (CPI / WPI)",
    question: "Which formula is officially utilized by the Price Statistics Division of MoSPI for compiling elementary aggregate price indices before weighting them?",
    options: [
      "Carli Index (Arithmetic mean of price relatives)",
      "Jevons Index (Geometric mean of price relatives)",
      "Dutot Index (Ratio of arithmetic mean prices)",
      "Palgrave Index (Weighted harmonic mean)"
    ],
    correctAnswer: 1,
    explanation: "Following international best practices recommended by the ILO/IMF Consumer Price Index Manual, the Jevons formula (geometric mean) is preferred for elementary aggregates as it satisfies the time-reversal and transitivity tests.",
    difficulty: "Intermediate",
    sourceDocument: "MoSPI_Consumer_Price_Index_Manual_2024.pdf"
  },
  {
    id: "q-006",
    competencyId: "comp-tech-1",
    competencyName: "Python for Official Statistics",
    question: "When processing a 12-gigabyte unit-level NSS microdata text file on a standard government desktop with 8GB RAM, which Pandas technique prevents MemoryError?",
    options: [
      "df = pd.read_csv('data.txt', low_memory=False)",
      "Iterating through pd.read_csv('data.txt', chunksize=100000) and processing batch-wise",
      "Setting pd.options.display.max_rows = None",
      "Converting the file into a Python list of strings first"
    ],
    correctAnswer: 1,
    explanation: "Using `pd.read_csv(..., chunksize=N)` returns an iterator yielding DataFrames of size N, allowing chunk-by-chunk processing and aggregation without exceeding physical memory.",
    difficulty: "Intermediate",
    sourceDocument: "NSSTA_Python_Data_Science_Handbook.pdf"
  },
  {
    id: "q-007",
    competencyId: "comp-gov-1",
    competencyName: "Data Privacy & DPDP Act 2023",
    question: "Under the Digital Personal Data Protection (DPDP) Act 2023, what is the legal position regarding the processing of personal data for statistical, research, or historical purposes?",
    options: [
      "It is strictly prohibited under all circumstances.",
      "It is exempt from specific provisions provided the data is not used to make decisions regarding the specific data principal.",
      "It requires written notarized consent from every individual surveyed.",
      "It is only allowed if processed by private foreign cloud providers."
    ],
    correctAnswer: 1,
    explanation: "Section 17 of the DPDP Act 2023 provides exemptions for processing personal data necessary for research, archiving, or statistical purposes, provided the data is not utilized to make any decision directed at a specific Data Principal and adheres to prescribed standards.",
    difficulty: "Intermediate",
    sourceDocument: "DPDP_Act_2023_Official_Gazette.pdf"
  },
  {
    id: "q-008",
    competencyId: "comp-tech-3",
    competencyName: "SQL & Data Warehousing",
    question: "Which SQL clause is most appropriate when calculating a 3-month moving average of monthly Index of Industrial Production (IIP) values?",
    options: [
      "GROUP BY ROLLUP(month)",
      "AVG(iip_value) OVER (ORDER BY month_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)",
      "HAVING AVG(iip_value) > 3",
      "CROSS JOIN LATERAL"
    ],
    correctAnswer: 1,
    explanation: "The window function `AVG(...) OVER (ORDER BY ... ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` calculates the moving aggregate over the rolling window without collapsing individual row details.",
    difficulty: "Advanced",
    sourceDocument: "NIC_Database_Practices_MoSPI.pdf"
  },
  {
    id: "q-009",
    competencyId: "comp-stat-4",
    competencyName: "Labour & Employment Statistics",
    question: "In the Periodic Labour Force Survey (PLFS), an individual who spent 30 days or more in economic activity during the 365-day reference period is classified under:",
    options: [
      "Current Daily Status (CDS) Worker",
      "Usual Subsidiary Economic Status (SS) Worker",
      "Usual Principal Activity Status (PS) Worker",
      "Chronic Underemployment Status"
    ],
    correctAnswer: 1,
    explanation: "Under PLFS taxonomy, an individual who engaged in economic activity for 30 days or more during the preceding 365 days is categorized as a Subsidiary Status (SS) worker if their principal status was non-working.",
    difficulty: "Intermediate",
    sourceDocument: "SDRD_PLFS_Round_8_Instruction_Manual_Vol_I.pdf"
  },
  {
    id: "q-010",
    competencyId: "comp-beh-1",
    competencyName: "Public Leadership & Ethics",
    question: "According to UN Fundamental Principle 6 of Official Statistics adopted by the Government of India, what is the core mandate regarding individual data?",
    options: [
      "Individual data must be publicly auctioned for open research.",
      "Individual data collected by statistical agencies must be strictly confidential and used exclusively for statistical purposes.",
      "Individual data may be shared with commercial marketing vendors upon request.",
      "Individual records must be published in gazette notifications."
    ],
    correctAnswer: 1,
    explanation: "UN Fundamental Principle 6 strictly stipulates that individual data collected by statistical agencies for statistical compilation, whether they refer to natural or legal persons, are to be strictly confidential and used exclusively for statistical purposes.",
    difficulty: "Beginner",
    sourceDocument: "UN_Fundamental_Principles_Official_Statistics.pdf"
  }
];

export const MOCK_DOCUMENTS = [
  {
    id: "doc-1",
    name: "MoSPI_National_Accounts_Manual_2025_Revision.pdf",
    size: "4.2 MB",
    pages: 142,
    domain: "National Accounts & GDP",
    uploadDate: "2026-08-20",
    topics: ["SNA 2008", "GVA Basic Prices", "FISIM Allocation", "Supply-Use Tables", "Capital Formation"],
    suggestedQuestionsCount: 8
  },
  {
    id: "doc-2",
    name: "SDRD_PLFS_Round_8_Instruction_Manual_Vol_I.pdf",
    size: "6.8 MB",
    pages: 218,
    domain: "Survey Design & Labour Statistics",
    uploadDate: "2026-08-28",
    topics: ["Rotational Sampling", "FSU Selection", "UPSS Criteria", "Sub-round Allocation", "Non-response"],
    suggestedQuestionsCount: 10
  },
  {
    id: "doc-3",
    name: "DPDP_Act_2023_Compliance_Guidelines_For_Census.pdf",
    size: "1.9 MB",
    pages: 64,
    domain: "Digital Governance & Privacy",
    uploadDate: "2026-09-02",
    topics: ["Statistical Disclosure Control", "Differential Privacy", "Data Principal Rights", "Data Fiduciary Audits"],
    suggestedQuestionsCount: 6
  }
];
