// Mock Interactive Virtual Labs for Official Statistics
// Simulates live code execution with realistic tabular / console feedback

export const VIRTUAL_LABS = [
  {
    id: "lab-01",
    title: "Python Sandbox: Pandas for Survey Microdata Wrangling",
    domain: "Technical & Statistical Automation",
    competencyId: "comp-tech-1",
    language: "python",
    difficulty: "Intermediate",
    duration: "45 Mins",
    objective: "Load raw NSS household survey microdata, handle non-response codes, apply sampling multipliers, and generate State-level weighted unemployment rates.",
    instructions: [
      "1. Inspect the loaded DataFrame 'df_nss' representing PLFS Round 8 microdata.",
      "2. Filter out invalid activity codes (e.g. Activity Status Code 99: Refusal).",
      "3. Compute weighted aggregate using sample multiplier column 'MULT'.",
      "4. Calculate Labour Force Participation Rate (LFPR) = (Employed + Unemployed) / Total Population * 100."
    ],
    starterCode: `# Official MoSPI Python Microdata Environment
import numpy as np
import pandas as pd

# Load simulated NSS 100k sample records
print("[INFO] Ingesting PLFS 2026 Round 8 Microdata Batch (Zone: East)...")
data = {
    "FSU_ID": [10245, 10245, 10246, 10247, 10248],
    "STATE": ["West Bengal", "West Bengal", "Bihar", "Odisha", "Jharkhand"],
    "AGE": [28, 45, 19, 62, 34],
    "USUAL_STATUS": [31, 11, 81, 92, 51],  # 11: Regular Salaried, 81: Unemployed, 92: Retired
    "MULTIPLIER": [1420.5, 1420.5, 980.2, 1150.0, 890.4]
}
df = pd.DataFrame(data)

# Compute Labor Force Categories
df['IN_LABOUR_FORCE'] = df['USUAL_STATUS'].apply(lambda x: 1 if x in [11, 12, 21, 31, 41, 51, 81] else 0)
df['UNEMPLOYED'] = df['USUAL_STATUS'].apply(lambda x: 1 if x in [81, 82] else 0)

# Apply Survey Weights
weighted_pop = df['MULTIPLIER'].sum()
weighted_lf = (df['IN_LABOUR_FORCE'] * df['MULTIPLIER']).sum()
weighted_unemp = (df['UNEMPLOYED'] * df['MULTIPLIER']).sum()

lfpr = (weighted_lf / weighted_pop) * 100
unemployment_rate = (weighted_unemp / weighted_lf) * 100

print(f"Total Weighted Population: {weighted_pop:,.0f}")
print(f"Labour Force Participation Rate (LFPR): {lfpr:.2f}%")
print(f"Unemployment Rate (CWS): {unemployment_rate:.2f}%")
print("--> Computation successfully calibrated against MoSPI NIF standards.")`,
    cannedOutput: `[INFO] Ingesting PLFS 2026 Round 8 Microdata Batch (Zone: East)...
[INFO] Parsed 5 Sample Enumeration Blocks across 4 States.
[INFO] Applied GREG Calibration Weights on Multiplier Field.
Total Weighted Population: 5,862
Labour Force Participation Rate (LFPR): 80.38%
Unemployment Rate (CWS): 20.80%
--> Computation successfully calibrated against MoSPI NIF standards.
[STATUS: 0 ERRORS] Code passed psychometric validation test cases!`
  },
  {
    id: "lab-02",
    title: "SQL Query Lab: National Accounts Sectoral GVA & Supply-Use Tables",
    domain: "National Accounts & Relational Queries",
    competencyId: "comp-tech-3",
    language: "sql",
    difficulty: "Advanced",
    duration: "40 Mins",
    objective: "Write PostgreSQL analytic window functions to aggregate Gross Value Added (GVA) across Mining, Manufacturing, and Services for Q1 2026, computing year-on-year deflators.",
    instructions: [
      "1. Join 'sectoral_output' with 'intermediate_consumption' on sector_id.",
      "2. Compute GVA_Current = Gross_Output - Intermediate_Consumption.",
      "3. Use LAG() window function over fiscal_quarter to compute QoQ growth rate."
    ],
    starterCode: `-- MoSPI Enterprise Database (PostgreSQL 16)
-- Query: Sectoral GVA Compilation for Q1 2026
WITH gva_calc AS (
  SELECT 
    s.sector_name,
    s.institutional_category,
    p.fiscal_quarter,
    p.gross_output_inr_crore,
    p.intermediate_consumption_inr_crore,
    (p.gross_output_inr_crore - p.intermediate_consumption_inr_crore) AS gva_basic_price
  FROM mospi_national_accounts.sectors s
  JOIN mospi_national_accounts.production_returns p 
    ON s.sector_id = p.sector_id
  WHERE p.fiscal_quarter = '2026-Q1'
)
SELECT 
  sector_name,
  institutional_category,
  gva_basic_price,
  ROUND(gva_basic_price * 100.0 / SUM(gva_basic_price) OVER (), 2) AS sector_share_percent,
  DENSE_RANK() OVER (ORDER BY gva_basic_price DESC) AS gva_rank
FROM gva_calc
ORDER BY gva_basic_price DESC;`,
    cannedOutput: `sector_name                 | institutional_category | gva_basic_price | sector_share_percent | gva_rank
----------------------------+------------------------+-----------------+----------------------+----------
Financial & Real Estate     | Services               |        14,820.5 |                28.40 |        1
Organized Manufacturing     | Secondary              |        11,940.2 |                22.88 |        2
Trade, Hotels & Transport   | Services               |         9,850.0 |                18.88 |        3
Agriculture & Forestry      | Primary                |         8,420.8 |                16.14 |        4
Construction & Infrastructure| Secondary              |         7,150.0 |                13.70 |        5
(5 rows affected in 18ms)
[STATUS: 0 ERRORS] Window calculation verified against National Accounts 2025 series!`
  },
  {
    id: "lab-03",
    title: "GIS Spatial Lab: Digital Enumeration Block Delineation in QGIS",
    domain: "Spatial Statistics & Survey Mapping",
    competencyId: "comp-tech-4",
    language: "python",
    difficulty: "Intermediate",
    duration: "50 Mins",
    objective: "Execute spatial joins and buffer generation to ensure no overlapping boundaries between urban Enumeration Blocks (EBs) during Economic Census preparation.",
    instructions: [
      "1. Load urban shapefile for Kolkata Municipal Corporation (KMC).",
      "2. Calculate bounding box and check polygon topological validity.",
      "3. Flag sliver polygons smaller than 100 sq meters as boundary errors."
    ],
    starterCode: `# GeoPandas / Shapely Spatial Geometry Script
import geopandas as gpd
from shapely.geometry import Polygon

print("[GIS] Loading Urban Frame Survey (UFS) Layer for Ward 42...")
# Simulating GeoDataFrame of Enumeration Blocks
eb_polygons = {
    'eb_id': ['EB-014-A', 'EB-014-B', 'EB-014-C'],
    'households': [142, 168, 120],
    'area_sqm': [24500, 31200, 22100],
    'is_valid_topology': [True, True, True]
}
print(f"[GIS] Successfully validated {len(eb_polygons['eb_id'])} Enumeration Blocks.")
for i in range(len(eb_polygons['eb_id'])):
    print(f" -> {eb_polygons['eb_id'][i]}: {eb_polygons['households'][i]} Households, Area: {eb_polygons['area_sqm'][i]:,} m² (Topology: PASS)")

print("[GIS] No topological overlaps detected with PM GatiShakti administrative layer.")`,
    cannedOutput: `[GIS] Loading Urban Frame Survey (UFS) Layer for Ward 42...
[GIS] Checking spatial intersection with Survey of India Base Layer...
[GIS] Successfully validated 3 Enumeration Blocks.
 -> EB-014-A: 142 Households, Area: 24,500 m² (Topology: PASS)
 -> EB-014-B: 168 Households, Area: 31,200 m² (Topology: PASS)
 -> EB-014-C: 120 Households, Area: 22,100 m² (Topology: PASS)
[GIS] No topological overlaps detected with PM GatiShakti administrative layer.
[STATUS: 0 ERRORS] Shapefile successfully cleared for field mobile CAPI synchronizer!`
  },
  {
    id: "lab-04",
    title: "DPDP Act 2023: Statistical Disclosure Anonymization & K-Anonymity",
    domain: "Digital Governance & Privacy",
    competencyId: "comp-gov-1",
    language: "python",
    difficulty: "Advanced",
    duration: "35 Mins",
    objective: "Implement k-anonymity (k=5) and cell suppression on survey microdata to eliminate re-identification risks before releasing public data files.",
    instructions: [
      "1. Identify Quasi-Identifiers: Age, Gender, Pincode.",
      "2. Group records and count equivalence class sizes.",
      "3. Suppress all equivalence classes with count < 5 (k=5 compliance)."
    ],
    starterCode: `# DPDP Act 2023 - Microdata De-identification Routine
import pandas as pd

# Raw sample with Quasi-Identifiers
records = [
    {'Official_ID': 'M-101', 'Age_Group': '25-30', 'Gender': 'F', 'District': 'Varanasi', 'Income_Band': 'High'},
    {'Official_ID': 'M-102', 'Age_Group': '25-30', 'Gender': 'F', 'District': 'Varanasi', 'Income_Band': 'High'},
    {'Official_ID': 'M-103', 'Age_Group': '25-30', 'Gender': 'F', 'District': 'Varanasi', 'Income_Band': 'Mid'},
    {'Official_ID': 'M-104', 'Age_Group': '25-30', 'Gender': 'F', 'District': 'Varanasi', 'Income_Band': 'High'},
    {'Official_ID': 'M-105', 'Age_Group': '25-30', 'Gender': 'F', 'District': 'Varanasi', 'Income_Band': 'High'},
    {'Official_ID': 'M-106', 'Age_Group': '65+',   'Gender': 'M', 'District': 'Varanasi', 'Income_Band': 'Low'}  # Outlier!
]
df = pd.DataFrame(records)

# Drop direct PII
df_anonymized = df.drop(columns=['Official_ID'])

# Check Equivalence Classes for Quasi-Identifiers
group_cols = ['Age_Group', 'Gender', 'District']
equiv_counts = df_anonymized.groupby(group_cols).size().reset_name if hasattr(df_anonymized.groupby(group_cols), 'reset_name') else df_anonymized.groupby(group_cols).size()

print("[DPDP 2023 AUDIT] Checking K-Anonymity (k=5 threshold)...")
for group, count in equiv_counts.items():
    if count < 5:
        print(f" [VIOLATION DETECTED] Class {group} has only {count} records! Applying cell suppression.")
    else:
        print(f" [PASS] Class {group} satisfies k={count} >= 5.")`,
    cannedOutput: `[DPDP 2023 AUDIT] Checking K-Anonymity (k=5 threshold)...
 [PASS] Class ('25-30', 'F', 'Varanasi') satisfies k=5 >= 5.
 [VIOLATION DETECTED] Class ('65+', 'M', 'Varanasi') has only 1 records! Applying cell suppression.
[SDC ACTION] Suppressed outlier record from Public Release Microdata File.
[STATUS: 0 ERRORS] Microdata export cleared under DPDP Act 2023 Section 17 Research Exemption!`
  }
];
