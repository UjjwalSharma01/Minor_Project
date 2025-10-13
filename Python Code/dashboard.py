"""
Network Behavior Analyzer - Streamlit Dashboard
Simple, beautiful interface for presenting your ML model
"""

import streamlit as st
import main
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Page config
st.set_page_config(
    page_title="Network Behavior Analyzer",
    page_icon="🔍",
    layout="wide"
)

# Title and description
st.title("🔍 Network Behavior Analyzer")
st.markdown("**XGBoost-powered ML model** | 97.7% Accuracy | 726 Domains")
st.markdown("---")

# Initialize parser (cached so it loads once)
@st.cache_resource
def load_model():
    """Load the ML model once"""
    parser = main.NetworkBehaviorParser(
        network_logs_file='networkLogs.json',
        domain_categories_file='domain_categories.json',
        training_data_file='training_data.json'
    )
    parser.initialize()
    return parser

# Load model
with st.spinner("Loading ML model..."):
    parser = load_model()
st.success("✅ Model loaded successfully!")

# Sidebar
st.sidebar.header("📁 Upload Network Logs")
st.sidebar.markdown("Upload your DNS logs in **CSV or JSON** format")

# File uploader - supports both CSV and JSON
uploaded_file = st.sidebar.file_uploader(
    "Choose CSV or JSON file",
    type=['csv', 'json'],
    help="Upload CSV (NextDNS export) or JSON format"
)

# Sample data button
use_sample = st.sidebar.button("🎯 Use Sample Data")

# Main content
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Model Accuracy", "97.7%", "↑ 32%")
with col2:
    st.metric("Domains", "726", "↑ 471")
with col3:
    st.metric("Algorithm", "XGBoost")
with col4:
    st.metric("Overfitting Gap", "1.7%", "↓ 43%")

st.markdown("---")

# Analyze button
if uploaded_file or use_sample:
    
    # Load data
    if use_sample:
        # Use existing networkLogs.json file
        with open('networkLogs.json', 'r') as f:
            data = json.load(f)
            logs = data if isinstance(data, list) else data.get('logs', [])
    else:
        # Check file type
        file_type = uploaded_file.name.split('.')[-1].lower()
        
        if file_type == 'csv':
            # Use CSV to JSON converter
            st.info("📄 CSV file detected - converting to JSON format...")
            
            # Import converter
            import csv_to_json_converter as converter
            import tempfile
            import os
            
            # Save uploaded CSV temporarily
            with tempfile.NamedTemporaryFile(mode='wb', suffix='.csv', delete=False) as tmp:
                tmp.write(uploaded_file.getvalue())
                tmp_csv_path = tmp.name
            
            # Convert CSV to JSON
            tmp_json_path = tmp_csv_path.replace('.csv', '.json')
            converter.convert_csv_to_networklog_json(tmp_csv_path, tmp_json_path)
            
            # Load converted JSON
            with open(tmp_json_path, 'r') as f:
                data = json.load(f)
                logs = data if isinstance(data, list) else data.get('logs', [])
            
            # Cleanup temp files
            os.remove(tmp_csv_path)
            os.remove(tmp_json_path)
            
            st.success(f"✅ Converted CSV to JSON - {len(logs)} logs ready!")
            
        else:
            # Load JSON directly
            data = json.load(uploaded_file)
            logs = data if isinstance(data, list) else data.get('logs', [])
    
    st.info(f"📊 Loaded {len(logs)} network logs")
    
    if st.button("🚀 Analyze Behavior", type="primary"):
        
        with st.spinner("Analyzing behavior patterns..."):
            # Run analysis
            result = parser.analyze_logs(logs)
        
        # Display results
        st.success("✅ Analysis Complete!")
        
        # Main result card
        st.markdown("## 🎯 Classification Result")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            behavior = result['behavior'].upper()
            confidence = float(result['confidence'])
            
            # Color based on behavior
            color_map = {
                'ENTERTAINMENT': '🟢',
                'WORK': '🔵',
                'UNETHICAL': '🔴',
                'SHOPPING': '🟡',
                'NEUTRAL': '⚪'
            }
            
            icon = color_map.get(behavior, '⚪')
            st.markdown(f"### {icon} {behavior}")
            st.markdown(f"**Confidence:** {confidence:.1f}%")
        
        with col2:
            st.markdown("### 📊 Summary")
            st.markdown(result['summary'])
        
        with col3:
            anomaly_text = "⚠️ ANOMALY DETECTED" if result['is_anomaly'] else "✅ Normal Behavior"
            st.markdown(f"### {anomaly_text}")
        
        st.markdown("---")
        
        # Features breakdown
        st.markdown("## 📈 Detailed Analysis")
        
        features = result['features']
        
        # Two columns for metrics
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 📊 Activity Metrics")
            st.metric("Total Queries", features['total_queries'])
            st.metric("Unique Domains", features['unique_domains'])
            st.metric("Session Duration", f"{features['session_duration']:.1f} min")
            st.metric("Queries/Minute", f"{features['queries_per_minute']:.1f}")
        
        with col2:
            st.markdown("### 🎯 Category Distribution")
            st.metric("Entertainment", f"{features['entertainment_pct']*100:.1f}%")
            st.metric("Work", f"{features['work_pct']*100:.1f}%")
            st.metric("Unethical", f"{features['unethical_pct']*100:.1f}%")
            st.metric("Shopping", f"{features['shopping_pct']*100:.1f}%")
        
        # Category pie chart
        st.markdown("### 📊 Category Breakdown")
        
        categories = {
            'Entertainment': features['entertainment_pct'] * 100,
            'Work': features['work_pct'] * 100,
            'Unethical': features['unethical_pct'] * 100,
            'Shopping': features['shopping_pct'] * 100,
            'Neutral': features['neutral_pct'] * 100
        }
        
        # Filter out zero values
        categories = {k: v for k, v in categories.items() if v > 0}
        
        fig = px.pie(
            values=list(categories.values()),
            names=list(categories.keys()),
            title="Activity Distribution",
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Top domains
        st.markdown("### 🌐 Top Domains")
        
        top_domains = features.get('top_domains', {})
        if top_domains:
            # Create bar chart
            domains_df = pd.DataFrame([
                {'Domain': d, 'Queries': c} 
                for d, c in list(top_domains.items())[:10]
            ])
            
            fig = px.bar(
                domains_df,
                x='Queries',
                y='Domain',
                orientation='h',
                title="Most Accessed Domains",
                color='Queries',
                color_continuous_scale='Blues'
            )
            st.plotly_chart(fig, use_container_width=True)
        
        # Raw data and download for n8n
        col1, col2 = st.columns(2)
        
        with col1:
            with st.expander("📄 View Raw Analysis Data"):
                st.json(result)
        
        with col2:
            st.markdown("### 🔗 n8n Integration")
            
            # Convert result to JSON string for download
            result_json = json.dumps(result, indent=2, default=str)
            
            st.download_button(
                label="📥 Download JSON for n8n",
                data=result_json,
                file_name="behavior_analysis_result.json",
                mime="application/json",
                help="Download this result to use in your n8n workflow"
            )
            
            st.info("💡 Use this JSON output as input to your n8n workflow for further processing!")

else:
    # Instructions
    st.info("👈 Upload a JSON file or use sample data to start analysis")
    
    st.markdown("### 📝 Supported Formats:")
    
    tab1, tab2 = st.tabs(["JSON Format", "CSV Format"])
    
    with tab1:
        st.code("""{
  "logs": [
    {
      "timestamp": "2024-08-20T09:15:23Z",
      "domain": "youtube.com",
      "query_type": "A",
      "client_ip": "user123",
      "status": "NOERROR"
    }
  ]
}""", language="json")
    
    with tab2:
        st.code("""timestamp,domain,query_type,client_ip,status
2024-08-20T09:15:23Z,youtube.com,A,192.168.1.100,NOERROR
2024-08-20T09:15:24Z,instagram.com,A,192.168.1.100,NOERROR
2024-08-20T09:15:25Z,netflix.com,A,192.168.1.100,NOERROR""", language="csv")
        st.info("💡 CSV will be automatically converted using csv_to_json_converter.py")
    
    st.markdown("### ✨ Features:")
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        - 🎯 **5 Behavior Categories**
          - Entertainment
          - Work
          - Unethical (Job Hunting)
          - Shopping
          - Neutral
        
        - 📊 **Advanced Features**
          - Domain entropy analysis
          - Session duration tracking
          - Social media detection
        """)
    
    with col2:
        st.markdown("""
        - 🤖 **ML Model**
          - XGBoost algorithm
          - 97.7% accuracy
          - 726 categorized domains
          - Real-time inference
        
        - 🔒 **Privacy**
          - IP anonymization
          - Secure processing
        """)

# Footer
st.markdown("---")
st.markdown("**Network Behavior Analyzer** | Built with XGBoost & Streamlit | 2025")
