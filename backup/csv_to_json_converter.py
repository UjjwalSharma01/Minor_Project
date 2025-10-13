#!/usr/bin/env python3
"""
CSV to JSON Converter for DNS Logs
==================================

This script converts DNS logs from CSV format (NextDNS, Pi-hole, etc.) 
to the JSON format required by the Network Behavior Parser.

Usage:
    python csv_to_json_converter.py your_dns_logs.csv

Features:
- Supports NextDNS export format
- Handles large files efficiently
- Anonymizes IP addresses
- Validates data integrity
- Provides conversion statistics

Author: Network Behavior Analysis System
Date: August 2025
"""

import pandas as pd
import json
import hashlib
import sys
import os
from datetime import datetime

def convert_csv_to_networklog_json(csv_file, output_file='networkLogs.json'):
    """
    Convert DNS logs from CSV format to networkLogs.json format
    
    Args:
        csv_file (str): Path to input CSV file
        output_file (str): Path to output JSON file
    
    Returns:
        str: Path to generated JSON file
    """
    
    print(f"🔄 Converting DNS logs from {csv_file} to {output_file}")
    print("=" * 60)
    
    # Check if input file exists
    if not os.path.exists(csv_file):
        print(f"❌ Error: File {csv_file} not found!")
        return None
    
    try:
        # Read CSV file
        print(f"📁 Reading CSV file...")
        df = pd.read_csv(csv_file, low_memory=False)
        print(f"✅ Loaded {len(df):,} records from CSV")
        
        # Display CSV structure
        print(f"📊 CSV Structure:")
        print(f"   Columns: {list(df.columns)}")
        print(f"   Shape: {df.shape}")
        
        # Detect column mapping (flexible for different CSV formats)
        column_mapping = detect_column_mapping(df.columns)
        print(f"🔍 Detected column mapping: {column_mapping}")
        
        # Create anonymized user ID from first IP address
        ip_column = column_mapping.get('client_ip')
        if ip_column and ip_column in df.columns:
            first_ip = str(df[ip_column].iloc[0]) if len(df) > 0 else "unknown"
            user_id = hashlib.md5(first_ip.encode()).hexdigest()[:8]
        else:
            user_id = "unknown_user"
        
        print(f"🔐 Generated anonymous user ID: {user_id}")
        
        # Convert to required format
        print(f"🔄 Converting records...")
        logs = []
        skipped_records = 0
        
        for idx, row in df.iterrows():
            try:
                # Extract data using column mapping
                log_entry = {
                    "timestamp": get_column_value(row, column_mapping.get('timestamp'), ''),
                    "domain": get_column_value(row, column_mapping.get('domain'), ''),
                    "query_type": get_column_value(row, column_mapping.get('query_type'), 'A'),
                    "client_ip": user_id,  # Use anonymized user_id instead of real IP
                    "status": get_column_value(row, column_mapping.get('status'), 'NOERROR'),
                    "reasons": get_column_value(row, column_mapping.get('reasons'), ''),
                    "user_id": user_id
                }
                
                # Validate essential fields
                if log_entry["domain"] and log_entry["timestamp"]:
                    logs.append(log_entry)
                else:
                    skipped_records += 1
                    
            except Exception as e:
                skipped_records += 1
                if skipped_records <= 5:  # Show first 5 errors only
                    print(f"⚠️  Skipped record {idx}: {e}")
        
        # Save as JSON
        print(f"💾 Saving to {output_file}...")
        output_data = {"logs": logs}
        
        with open(output_file, 'w') as f:
            json.dump(output_data, f, indent=2)
        
        # Display conversion statistics
        print("=" * 60)
        print("✅ CONVERSION COMPLETED!")
        print(f"📊 Statistics:")
        print(f"   Input records: {len(df):,}")
        print(f"   Output records: {len(logs):,}")
        print(f"   Skipped records: {skipped_records:,}")
        print(f"   Success rate: {(len(logs)/len(df)*100):.1f}%")
        print(f"   Output file: {output_file}")
        print(f"   File size: {os.path.getsize(output_file)/1024/1024:.1f} MB")
        print(f"   User ID: {user_id}")
        
        print("\n🚀 Ready to run analysis:")
        print("   python main.py")
        
        return output_file
        
    except Exception as e:
        print(f"❌ Error during conversion: {e}")
        return None

def detect_column_mapping(columns):
    """
    Detect column mapping based on common column names
    """
    columns_lower = [col.lower() for col in columns]
    mapping = {}
    
    # Timestamp detection
    for col, col_lower in zip(columns, columns_lower):
        if 'timestamp' in col_lower or 'time' in col_lower or 'date' in col_lower:
            mapping['timestamp'] = col
            break
    
    # Domain detection
    for col, col_lower in zip(columns, columns_lower):
        if 'domain' in col_lower or 'name' in col_lower:
            mapping['domain'] = col
            break
    
    # Query type detection
    for col, col_lower in zip(columns, columns_lower):
        if 'type' in col_lower and 'query' in col_lower:
            mapping['query_type'] = col
            break
        elif 'type' in col_lower:
            mapping['query_type'] = col
            break
    
    # Client IP detection
    for col, col_lower in zip(columns, columns_lower):
        if 'client' in col_lower and 'ip' in col_lower:
            mapping['client_ip'] = col
            break
        elif 'client' in col_lower:
            mapping['client_ip'] = col
            break
    
    # Status detection
    for col, col_lower in zip(columns, columns_lower):
        if 'status' in col_lower or 'response' in col_lower:
            mapping['status'] = col
            break
    
    # Reasons detection
    for col, col_lower in zip(columns, columns_lower):
        if 'reason' in col_lower or 'filter' in col_lower:
            mapping['reasons'] = col
            break
    
    return mapping

def get_column_value(row, column_name, default=''):
    """
    Safely get value from row with fallback to default
    """
    if column_name and column_name in row:
        value = row[column_name]
        return str(value) if pd.notna(value) else default
    return default

def main():
    """Main function for command-line usage"""
    
    print("🌐 DNS Logs CSV to JSON Converter")
    print("=" * 60)
    
    if len(sys.argv) < 2 or sys.argv[1] in ['--help', '-h', 'help']:
        print("Usage: python csv_to_json_converter.py <csv_file> [output_file]")
        print("\nExample:")
        print("  python csv_to_json_converter.py dns_logs.csv")
        print("  python csv_to_json_converter.py nextdns_export.csv networkLogs.json")
        print("\nSupported CSV formats:")
        print("  - NextDNS export format")
        print("  - Pi-hole logs")
        print("  - Custom DNS logs with timestamp, domain columns")
        return
    
    csv_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'networkLogs.json'
    
    result = convert_csv_to_networklog_json(csv_file, output_file)
    
    if result:
        print(f"\n🎉 Conversion successful! Run 'python main.py' to analyze the logs.")
    else:
        print(f"\n❌ Conversion failed. Please check the input file and try again.")

if __name__ == "__main__":
    main()
