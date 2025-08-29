# FocusGuard ML - Network Behavior Parser

A machine learning-based tool for analyzing network logs to classify user behavior into predefined categories for productivity monitoring in corporate environments, converting raw logs into actionable insights.

## Features

- **File-based network log analysis** from `networkLogs.json` or NextDNS API
- **External domain categorization** via `domain_categories.json` (200+ domains)
- **Custom training data** support through `training_data.json`
- **ML-based behavior classification** into 5 categories:
  - 🎮 **Entertainment**: Gaming, streaming, social media
  - 💼 **Work**: Development tools, business applications  
  - ⚠️ **Unethical**: Job hunting, unauthorized activities
  - 📰 **Neutral**: General browsing, news, utilities
  - 🔄 **Mixed**: Combination of multiple behaviors
- **Enhanced domain matching** with subdomain support and prefix removal
- **Anomaly detection** for unusual patterns
- **Privacy-focused**: Uses domain-level analysis with IP anonymization
- **Actionable insights**: Converts raw network logs into meaningful behavioral patterns

## Quick Start

### 1. Installation

```bash
# Clone or download the code
git clone <repository-url>
cd focusguard-ml

# Install dependencies
pip install -r requirements.txt
```

### 2. Prepare Your Data Files

The system expects three JSON files:

#### `networkLogs.json` - Your network logs
```json
{
  "logs": [
    {
      "timestamp": "2024-08-20T09:15:23Z",
      "domain": "github.com",
      "client_ip": "192.168.1.15",
      "query_type": "A",
      "response_code": "NOERROR",
      "user_id": "employee_001"
    }
  ]
}
```

#### `domain_categories.json` - Domain categorization (200+ domains included)
```json
{
  "youtube.com": "entertainment",
  "github.com": "work",
  "indeed.com": "unethical",
  "google.com": "neutral"
}
```

#### `training_data.json` - ML training data (25+ samples included)
```json
[
  {
    "label": "entertainment",
    "total_queries": 45,
    "unique_domains": 12,
    "entertainment_pct": 0.78,
    "work_pct": 0.11,
    ...
  }
]
```

### 3. Basic Usage

```bash
# Run analysis on your network logs
python main.py
```

This will:
- Load domain categories from `domain_categories.json`
- Train ML model using `training_data.json`
- Analyze logs from `networkLogs.json`
- Display comprehensive behavior analysis
- Save results to `behavior_results.json`

## 🚀 Quick Start with CSV Files

**If you have DNS logs in CSV format (most common scenario):**

```bash
# 1. Convert CSV to JSON
python csv_to_json_converter.py your_dns_logs.csv

# 2. Run analysis
python main.py
```

**That's it!** The system will automatically:
- Convert your CSV to the required JSON format
- Generate an anonymized user ID
- Load 255+ pre-categorized domains
- Apply enhanced ML classification (23 features)
- Show detailed behavior analysis with confidence scores

### 4. NextDNS Integration (Optional)

For real-time monitoring with NextDNS:

```python
from main import NetworkBehaviorParser

# Configure with your NextDNS credentials
parser = NetworkBehaviorParser(
    nextdns_api_key="your_api_key",
    nextdns_profile_id="your_profile_id",
    network_logs_file="networkLogs.json",
    domain_categories_file="domain_categories.json",
    training_data_file="training_data.json"
)

# Start real-time monitoring
parser.initialize()
parser.start_monitoring(interval_minutes=5)
```

## File Formats

### Network Logs Format

Your `networkLogs.json` should contain DNS query logs with these fields:
- `timestamp`: ISO format timestamp
- `domain`: Queried domain name
- `client_ip`: Client IP address (anonymized in results)
- `query_type`: DNS query type (A, AAAA, etc.)
- `response_code`: DNS response code
- `user_id`: Optional user identifier

### Domain Categories

The `domain_categories.json` file maps domains to categories:
- **entertainment**: YouTube, Netflix, gaming platforms
- **work**: GitHub, AWS, development tools
- **unethical**: Job sites, freelancing platforms
- **neutral**: Search engines, news, utilities

### Training Data Structure

Each training sample in `training_data.json` includes:
- `label`: Behavior category
- `total_queries`: Number of DNS queries
- `unique_domains`: Number of unique domains
- `entertainment_pct`: Percentage of entertainment queries
- `work_pct`: Percentage of work-related queries
- `unethical_pct`: Percentage of unethical queries
- `neutral_pct`: Percentage of neutral queries
- `session_duration`: Session length in minutes
- `queries_per_minute`: Query frequency
- `domain_entropy`: Shannon entropy of domain distribution
- `avg_query_length`: Average domain name length

## Working with CSV DNS Logs

If you have DNS logs in CSV format (like NextDNS exports), follow these steps to convert and analyze them:

### Step 1: CSV Format Requirements

Your CSV file should contain these columns (standard NextDNS format):
```csv
Timestamp,Domain,Type,Client IP,Status,Reasons
2024-08-20T09:15:23Z,github.com,A,192.168.1.15,NOERROR,
2024-08-20T09:16:45Z,play.googleapis.com,AAAA,192.168.1.15,NOERROR,
```

### Step 2: CSV to JSON Conversion

Use the included conversion utility:

```bash
# Convert your CSV file to the required JSON format
python csv_to_json_converter.py your_dns_logs.csv

# Or specify a custom output filename
python csv_to_json_converter.py your_dns_logs.csv networkLogs.json
```

The converter will:
- ✅ Automatically detect column formats (NextDNS, Pi-hole, custom)
- ✅ Map different column names intelligently  
- ✅ Anonymize IP addresses for privacy
- ✅ Validate data integrity
- ✅ Show conversion statistics
- ✅ Create `networkLogs.json` ready for analysis

**Example output:**
```
🌐 DNS Logs CSV to JSON Converter
============================================================
📁 Reading CSV file...
✅ Loaded 33,259 records from CSV
📊 CSV Structure:
   Columns: ['Timestamp', 'Domain', 'Type', 'Client IP', 'Status', 'Reasons']
🔍 Detected column mapping: {...}
🔐 Generated anonymous user ID: 7a9691b7
💾 Saving to networkLogs.json...
============================================================
✅ CONVERSION COMPLETED!
📊 Statistics:
   Input records: 33,259
   Output records: 33,259
   Success rate: 100.0%
   Output file: networkLogs.json
   File size: 18.6 MB
```

### Step 3: Run Analysis

After conversion, run the analysis:

```bash
python main.py
```

### Step 4: Review Results

The system will:
1. Load your converted DNS logs from `networkLogs.json`
2. Apply domain categorization using `domain_categories.json` (255 domains)
3. Extract 23 enhanced features including:
   - Pure vs tracking domain attribution
   - Social media and streaming percentages
   - Temporal analysis and peak activity hours
   - Domain entropy and concentration metrics
4. Classify behavior using enhanced RandomForest model
5. Generate detailed results in `behavior_results.json`

### Step 5: Interpret Results

Example output:
```
==================================================
NETWORK BEHAVIOR ANALYSIS RESULTS
==================================================
User ID: 7a9691b7
Behavior: entertainment
Confidence: 53.6%

Feature Details:
- Total Queries: 33259
- Entertainment: 33.9%
  - Pure Entertainment: 23.9%
  - Entertainment Tracking: 10.1%
- Work: 1.3%
- Neutral: 61.0%

Top Domains:
- graph.facebook.com: 1667 queries (entertainment)
- play.googleapis.com: 1187 queries (neutral)
```

### Troubleshooting CSV Conversion

**Common Issues:**
1. **Column Name Mismatch**: Adjust column names in the conversion script
2. **Date Format Issues**: Ensure timestamps are in ISO format
3. **Large Files**: Process in chunks for files >100MB
4. **Missing Columns**: Add default values for missing fields

**CSV Column Variations:**
- NextDNS: `Timestamp, Domain, Type, Client IP, Status, Reasons`
- Pi-hole: `timestamp, domain, client, query_type, status`
- Custom logs: Adjust the conversion script accordingly

## Enhanced Features

### Advanced Domain Matching
- Removes common prefixes (www., api., cdn., m., mobile., app.)
- Multi-level subdomain matching (up to 3 levels)
- Partial matching for domain patterns

### Extended Domain Database
- 200+ pre-categorized domains across all categories
- Easy expansion via JSON file editing
- Automatic fallback to default categories

### Comprehensive Analysis Output
```
NETWORK BEHAVIOR ANALYSIS RESULTS
==================================================
User ID: a1b2c3d4
Behavior: work
Confidence: 85.3%
Anomaly: No

Feature Details:
- Total Queries: 156
- Unique Domains: 23
- Entertainment: 8.3%
- Work: 76.9%
- Unethical: 1.3%
- Neutral: 13.5%
- Session Duration: 47.2 minutes
- Domain Entropy: 3.21

Category Breakdown:
- Entertainment: 13 queries (8.3%)
- Work: 120 queries (76.9%)
- Unethical: 2 queries (1.3%)
- Neutral: 21 queries (13.5%)

Top Domains:
- github.com: 45 queries (work)
- stackoverflow.com: 23 queries (work)
- aws.amazon.com: 19 queries (work)
- docs.google.com: 17 queries (work)
- youtube.com: 8 queries (entertainment)
```

## Customization

### Adding New Domains
Edit `domain_categories.json`:
```json
{
  "newsite.com": "work",
  "anotherdomain.com": "entertainment"
}
```

### Custom Training Data
Add samples to `training_data.json` matching your organization's patterns.

### Model Configuration
Modify the `BehaviorClassifier` class:
```python
self.model = RandomForestClassifier(
    n_estimators=200,  # Increase for better accuracy
    max_depth=15,      # Adjust tree depth
    random_state=42
)
```

## Real-time Monitoring

```python
# Start monitoring with custom interval
parser.start_monitoring(interval_minutes=10)

# Monitor specific log file updates
parser.analyze_logs(parser.load_network_logs())
```

## Security & Privacy

- IP addresses are anonymized using MD5 hashing
- Only domain-level analysis (no payload inspection)
- Local processing (no data sent to external services)
- Configurable data retention policies

## Troubleshooting

### File Not Found Errors
- Ensure all three JSON files are in the same directory as `main.py`
- Check file permissions and JSON syntax

### Low Accuracy
- Add more training samples to `training_data.json`
- Expand domain categories in `domain_categories.json`
- Adjust model parameters in `BehaviorClassifier`

### Memory Issues
- Reduce batch size for large log files
- Implement log rotation for continuous monitoring

## Extension Ideas

### Post-deadline Enhancements
- **Deep Learning**: LSTM models for sequence analysis
- **Real-time Dashboard**: Streamlit/Flask web interface  
- **Advanced Anomaly Detection**: Isolation Forest with custom features
- **Multi-user Analysis**: Department-level behavior profiles
- **API Integration**: REST API for external systems
- **Docker Deployment**: Containerized solution
- **Database Storage**: PostgreSQL/MongoDB integration

### Integration Options
- **SIEM Integration**: Splunk, ELK Stack connectors
- **Alerting**: Email, Slack notifications
- **Reporting**: PDF/Excel automated reports
- **Visualization**: Grafana dashboards

## Requirements

- Python 3.8+
- See `requirements.txt` for package dependencies
- Minimum 4GB RAM for large log processing
- 100MB disk space for models and logs

## 📁 Project Structure

```
network-behavior-parser/
├── main.py                      # 🎯 Primary application (run this!)
├── enhanced_classifier.py       # 🧠 Enhanced ML components with domain intelligence
├── csv_to_json_converter.py     # 🔄 CSV to JSON conversion utility
├── domain_categories.json       # 📊 Domain categorization database (255+ domains)
├── training_data.json           # 🎓 ML training data (130 samples, 23 features)
├── behavior_model.pkl           # 🤖 Trained ML model
├── networkLogs.json            # 📋 Your DNS logs (input data)
├── behavior_results.json       # 📈 Analysis results (output)
├── requirements.txt            # 📦 Dependencies
└── README.md                   # 📖 This documentation
```

**Core Files:**
- **main.py**: The main application - start here!
- **csv_to_json_converter.py**: Convert your CSV logs to the required format
- **domain_categories.json**: Pre-categorized domains (entertainment, work, etc.)
- **training_data.json**: ML training samples with enhanced features

**Generated Files:**
- **networkLogs.json**: Your converted DNS logs
- **behavior_results.json**: Detailed analysis results
- **behavior_model.pkl**: Trained machine learning model

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Add new domains to `domain_categories.json`
3. Contribute training samples to `training_data.json`
4. Submit pull requests for new features

## Support

For questions or issues:
- Check troubleshooting section
- Review sample data files format
- Validate JSON syntax of input files
- Monitor logs in `network_behavior.log`