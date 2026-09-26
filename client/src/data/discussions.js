// Mock Discussion Threads for Discuss Hub (iGOT Karmayogi Peer Exchange)

export const MOCK_DISCUSSIONS = [
  {
    id: "disc-001",
    title: "How to handle non-response in urban UFS blocks with gated communities?",
    division: "Field Operations Division (FOD)",
    topic: "Survey Design & Field Operations",
    authorName: "Rakesh Kumar Yadav",
    authorCadre: "Junior Statistical Officer (JSO)",
    authorAvatar: "RY",
    postedDate: "Yesterday",
    upvotes: 24,
    tags: ["PLFS", "UFS Blocks", "Gated Communities", "Non-response"],
    content: "During Round 8 urban listing in Bangalore East, field enumerators encountered zero physical access to 3 multi-storey apartment complexes due to resident association restrictions. How should we legally and procedurally record these First Stage Units (FSUs) without violating sample randomisation protocols?",
    replies: [
      {
        id: "rep-001",
        authorName: "Dr. Vikramaditya Sengupta",
        authorCadre: "Director, NSSTA (Faculty)",
        isFaculty: true,
        authorAvatar: "VS",
        postedDate: "18 hours ago",
        content: "Under MoSPI Instruction Manual Vol I (Para 3.14), you must issue official Form 'Notice under Collection of Statistics Act 2008' signed by the Regional Joint Director. If access is still withheld after 72 hours, record as 'Casualty FSU' and draw the designated substitute frame unit allocated in the sample list. Do not randomly substitute without Regional Scrutiny approval."
      },
      {
        id: "rep-002",
        authorName: "Dr. Priyadarshini Rao",
        authorCadre: "Senior Statistical Officer (SSO)",
        isFaculty: false,
        authorAvatar: "PR",
        postedDate: "12 hours ago",
        content: "In Delhi NAD surveys, we coordinated with the Resident Welfare Association (RWA) president through email citing the official MoSPI gazette notification. That unlocked 80% cooperation."
      }
    ]
  },
  {
    id: "disc-002",
    title: "Double Deflation vs Single Indicator approach for Manufacturing Sector GVA",
    division: "National Accounts Division (NAD)",
    topic: "Macroeconomic & National Accounts",
    authorName: "Smt. Neha Joshi",
    authorCadre: "Assistant Director (ISS)",
    authorAvatar: "NJ",
    postedDate: "2 days ago",
    upvotes: 38,
    tags: ["National Accounts", "SNA 2008", "GVA", "Double Deflation"],
    content: "In the upcoming revision of the National Accounts series, NAD is transitioning towards the Double Deflation method for compiled GVA. What are the major data limitations observed when deflating intermediate input consumption using the wholesale price index (WPI)?",
    replies: [
      {
        id: "rep-003",
        authorName: "Rajesh Kumar Meena",
        authorCadre: "Deputy Director (ESD)",
        isFaculty: false,
        authorAvatar: "RM",
        postedDate: "1 day ago",
        content: "The primary bottleneck is that WPI does not cover service sector inputs (legal, logistics, IT), leading to input price distortion. We must synthesize hybrid deflators using Service Price Indices where feasible."
      }
    ]
  },
  {
    id: "disc-003",
    title: "Handling missing price quotes in Consumer Price Index (CPI) during regional strikes",
    division: "Price Statistics Division (PSD)",
    topic: "Price Statistics",
    authorName: "Sunita Verma",
    authorCadre: "Senior Statistical Officer (SSO)",
    authorAvatar: "SV",
    postedDate: "3 days ago",
    upvotes: 19,
    tags: ["CPI", "Price Quotations", "Imputation"],
    content: "When local mandi markets are shut due to regional weather or strikes, is it permissible to carry forward the previous week price, or should we use the Jevons geometric mean of neighboring urban centers?",
    replies: [
      {
        id: "rep-004",
        authorName: "Dr. P. N. Murthy",
        authorCadre: "Director, PSD (Faculty)",
        isFaculty: true,
        authorAvatar: "PM",
        postedDate: "2 days ago",
        content: "MoSPI Price Statistics guidelines mandate imputed relative change method (Class Mean Imputation). Never carry forward sticky prices for perishables (vegetables/fruits), as this dampens volatility."
      }
    ]
  },
  {
    id: "disc-004",
    title: "Automating NIC-2008 5-digit classification with Python Transformers",
    division: "Data Quality Assurance Division (DQAD)",
    topic: "AI & Machine Learning in Statistics",
    authorName: "Mohammed Tariq Farooqui",
    authorCadre: "Junior Statistical Officer (JSO)",
    authorAvatar: "TF",
    postedDate: "4 days ago",
    upvotes: 45,
    tags: ["Python", "NLP", "NIC-2008", "Auto-coding"],
    content: "Has anyone benchmarked fine-tuned BERT vs string-distance algorithms (Levenshtein/Jaro-Winkler) for matching free-text enterprise descriptions to National Industrial Classification (NIC) codes? What accuracy rates are acceptable for official release scrutiny?",
    replies: [
      {
        id: "rep-005",
        authorName: "Prof. Arvind Ramanathan",
        authorCadre: "Advisor AI, MoSPI (Faculty)",
        isFaculty: true,
        authorAvatar: "AR",
        postedDate: "3 days ago",
        content: "At NSSTA AI Lab, fine-tuned IndicBERT achieved 91.4% top-1 accuracy on multilingual job descriptions. String distance fails completely when colloquial trade terms are used (e.g. 'Kirana', 'Dhaba', 'Lathe workshop'). We encourage officials to take the new Virtual Lab on NLP coding."
      }
    ]
  }
];
