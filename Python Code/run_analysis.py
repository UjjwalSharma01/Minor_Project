#!/usr/bin/env python3
"""
Complete Network Behavior Analysis Pipeline
============================================

This script orchestrates the full analysis pipeline:
1. Converts CSV logs to JSON format using csv_to_json_converter
2. Runs network behavior analysis using main.py
3. Generates comprehensive reports and visualizations

Usage:
    python run_analysis.py

Author: InsightNet - Network Behavior Analysis System
Date: October 2025
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import Dict, Optional

# Import required modules
try:
    from csv_to_json_converter import convert_csv_to_networklog_json
    from main import NetworkBehaviorParser
except ImportError as e:
    print(f"❌ Error importing required modules: {e}")
    print("Please ensure csv_to_json_converter.py and main.py are in the same directory.")
    sys.exit(1)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('analysis_pipeline.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AnalysisPipeline:
    """Complete analysis pipeline orchestrator"""
    
    def __init__(self, csv_file: str = '6a9666.csv'):
        self.csv_file = csv_file
        self.json_file = 'networkLogs.json'
        self.results_file = 'behavior_results.json'
        self.domain_categories_file = 'domain_categories.json'
        self.training_data_file = 'training_data.json'
        self.parser = None
        
    def validate_files(self) -> bool:
        """Validate that all required files exist"""
        print("\n" + "="*70)
        print("🔍 FILE VALIDATION")
        print("="*70)
        
        # Check CSV file
        if not os.path.exists(self.csv_file):
            print(f"❌ CSV file not found: {self.csv_file}")
            return False
        else:
            file_size = os.path.getsize(self.csv_file) / 1024 / 1024
            print(f"✅ CSV file found: {self.csv_file} ({file_size:.2f} MB)")
        
        # Check domain categories
        if not os.path.exists(self.domain_categories_file):
            print(f"⚠️  Domain categories file not found: {self.domain_categories_file}")
            print(f"    Will be created with default categories")
        else:
            print(f"✅ Domain categories found: {self.domain_categories_file}")
        
        # Check training data
        if not os.path.exists(self.training_data_file):
            print(f"⚠️  Training data file not found: {self.training_data_file}")
            print(f"    Will be created with default training data")
        else:
            print(f"✅ Training data found: {self.training_data_file}")
        
        return True
    
    def step1_convert_csv_to_json(self) -> bool:
        """Step 1: Convert CSV to JSON format"""
        print("\n" + "="*70)
        print("📊 STEP 1: CSV TO JSON CONVERSION")
        print("="*70)
        
        try:
            result = convert_csv_to_networklog_json(self.csv_file, self.json_file)
            
            if result:
                print(f"\n✅ Conversion successful!")
                return True
            else:
                print(f"\n❌ Conversion failed!")
                return False
                
        except Exception as e:
            logger.error(f"Error during CSV conversion: {e}")
            print(f"❌ Conversion error: {e}")
            return False
    
    def step2_analyze_behavior(self) -> Optional[Dict]:
        """Step 2: Analyze network behavior using ML"""
        print("\n" + "="*70)
        print("🤖 STEP 2: NETWORK BEHAVIOR ANALYSIS")
        print("="*70)
        
        try:
            # Initialize parser
            print("\n🔧 Initializing Network Behavior Parser...")
            self.parser = NetworkBehaviorParser(
                network_logs_file=self.json_file,
                domain_categories_file=self.domain_categories_file,
                training_data_file=self.training_data_file
            )
            
            # Train model
            print("🎓 Training ML model...")
            self.parser.initialize()
            
            # Load network logs
            print("📥 Loading network logs...")
            network_logs = self.parser.load_network_logs()
            
            if not network_logs:
                print("❌ No network logs found!")
                return None
            
            print(f"✅ Loaded {len(network_logs)} log entries")
            
            # Analyze behavior
            print("🔍 Analyzing behavior patterns...")
            result = self.parser.analyze_logs(network_logs)
            
            # Save results
            self.parser.save_results(self.results_file)
            
            return result
            
        except Exception as e:
            logger.error(f"Error during behavior analysis: {e}")
            print(f"❌ Analysis error: {e}")
            return None
    
    def step3_generate_report(self, result: Dict):
        """Step 3: Generate comprehensive analysis report"""
        print("\n" + "="*70)
        print("📝 STEP 3: GENERATING ANALYSIS REPORT")
        print("="*70)
        
        try:
            self._print_summary_report(result)
            self._print_detailed_report(result)
            self._print_recommendations(result)
            
        except Exception as e:
            logger.error(f"Error generating report: {e}")
            print(f"❌ Report generation error: {e}")
    
    def _print_summary_report(self, result: Dict):
        """Print summary report"""
        print("\n" + "="*70)
        print("📊 ANALYSIS SUMMARY")
        print("="*70)
        
        print(f"\n🆔 User ID: {result['user_id']}")
        print(f"🎯 Behavior Classification: {result['behavior'].upper()}")
        print(f"📈 Confidence Level: {result['confidence']:.1%}")
        print(f"⚠️  Anomaly Detection: {'⚠️  YES - UNUSUAL BEHAVIOR' if result['is_anomaly'] else '✅ NORMAL'}")
        
        if result.get('summary'):
            print(f"\n💬 Summary: {result['summary']}")
    
    def _print_detailed_report(self, result: Dict):
        """Print detailed feature analysis"""
        print("\n" + "="*70)
        print("📈 DETAILED FEATURE ANALYSIS")
        print("="*70)
        
        features = result['features']
        
        # Query statistics
        print(f"\n📊 Query Statistics:")
        print(f"   Total Queries: {features['total_queries']:,}")
        print(f"   Unique Domains: {features['unique_domains']:,}")
        print(f"   Session Duration: {features['session_duration']:.1f} minutes")
        print(f"   Queries per Minute: {features['queries_per_minute']:.2f}")
        print(f"   Domain Entropy: {features['domain_entropy']:.2f}")
        print(f"   Avg Query Length: {features['avg_query_length']:.1f} characters")
        
        # Category breakdown
        print(f"\n📋 Category Breakdown:")
        total = features['total_queries']
        for category, count in sorted(features['category_counts'].items(), 
                                      key=lambda x: x[1], reverse=True):
            percentage = (count / total * 100) if total > 0 else 0
            bar = '█' * int(percentage / 2)
            print(f"   {category.title():<20} {count:>6} ({percentage:>5.1f}%) {bar}")
        
        # Category percentages
        print(f"\n🎨 Category Percentages:")
        print(f"   Entertainment: {features['entertainment_pct']:.1%}")
        if 'pure_entertainment_pct' in features:
            print(f"      ├─ Pure Entertainment: {features['pure_entertainment_pct']:.1%}")
            print(f"      └─ Entertainment Tracking: {features['entertainment_tracking_pct']:.1%}")
        print(f"   Work-Related: {features['work_pct']:.1%}")
        print(f"   Unethical/Job Hunting: {features['unethical_pct']:.1%}")
        print(f"   Shopping: {features.get('shopping_pct', 0):.1%}")
        print(f"   Neutral: {features['neutral_pct']:.1%}")
        
        if 'social_media_pct' in features:
            print(f"   Social Media: {features['social_media_pct']:.1%}")
        if 'streaming_pct' in features:
            print(f"   Streaming: {features['streaming_pct']:.1%}")
        
        # Top domains
        if features.get('top_domains'):
            print(f"\n🔝 Top 10 Most Accessed Domains:")
            for idx, (domain, count) in enumerate(features['top_domains'].items(), 1):
                if idx > 10:
                    break
                category = self.parser.feature_extractor.categorizer.categorize_domain(domain)
                percentage = (count / total * 100) if total > 0 else 0
                print(f"   {idx:2}. {domain:<50} ({category:<15}) {count:>5} queries ({percentage:.1f}%)")
    
    def _print_recommendations(self, result: Dict):
        """Print actionable recommendations"""
        print("\n" + "="*70)
        print("💡 RECOMMENDATIONS")
        print("="*70)
        
        behavior = result['behavior']
        features = result['features']
        is_anomaly = result['is_anomaly']
        
        print()
        
        if behavior == 'unethical' or features['unethical_pct'] > 0.1:
            print("🚨 HIGH PRIORITY:")
            print("   • Employee showing job hunting behavior")
            print("   • Accessing career websites during work hours")
            print("   • Recommended: Schedule check-in meeting")
            print("   • Consider: Employee satisfaction survey")
        
        if behavior == 'idle' or features['entertainment_pct'] > 0.5:
            print("⚠️  MEDIUM PRIORITY:")
            print("   • High entertainment/social media usage detected")
            print("   • Productivity may be impacted")
            print("   • Recommended: Review workload and engagement")
            print("   • Consider: Time management coaching")
        
        if is_anomaly:
            print("⚠️  ANOMALY DETECTED:")
            print("   • Unusual behavior pattern identified")
            print("   • Deviates from normal usage patterns")
            print("   • Recommended: Further investigation")
            print("   • Check: Security implications")
        
        if behavior == 'active':
            print("✅ POSITIVE INDICATORS:")
            print("   • Employee showing productive work behavior")
            print("   • Good balance between work and breaks")
            print("   • No immediate concerns")
        
        if behavior == 'neutral':
            print("ℹ️  NEUTRAL BEHAVIOR:")
            print("   • Normal baseline activity detected")
            print("   • No specific action required")
            print("   • Continue monitoring")
    
    def step4_save_detailed_report(self, result: Dict):
        """Step 4: Save detailed report to file"""
        print("\n" + "="*70)
        print("💾 STEP 4: SAVING REPORTS")
        print("="*70)
        
        try:
            # Create report filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"analysis_report_{timestamp}.txt"
            
            with open(report_file, 'w') as f:
                f.write("="*70 + "\n")
                f.write("INSIGHTNET - NETWORK BEHAVIOR ANALYSIS REPORT\n")
                f.write("="*70 + "\n")
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Source File: {self.csv_file}\n")
                f.write(f"User ID: {result['user_id']}\n")
                f.write("="*70 + "\n\n")
                
                # Summary
                f.write("SUMMARY\n")
                f.write("-"*70 + "\n")
                f.write(f"Behavior: {result['behavior'].upper()}\n")
                f.write(f"Confidence: {result['confidence']:.1%}\n")
                f.write(f"Anomaly: {'YES' if result['is_anomaly'] else 'NO'}\n")
                f.write(f"Summary: {result.get('summary', 'N/A')}\n\n")
                
                # Features
                f.write("DETAILED METRICS\n")
                f.write("-"*70 + "\n")
                features = result['features']
                f.write(f"Total Queries: {features['total_queries']:,}\n")
                f.write(f"Unique Domains: {features['unique_domains']:,}\n")
                f.write(f"Session Duration: {features['session_duration']:.1f} minutes\n")
                f.write(f"Entertainment: {features['entertainment_pct']:.1%}\n")
                f.write(f"Work: {features['work_pct']:.1%}\n")
                f.write(f"Unethical: {features['unethical_pct']:.1%}\n")
                f.write(f"Shopping: {features.get('shopping_pct', 0):.1%}\n")
                f.write(f"Neutral: {features['neutral_pct']:.1%}\n\n")
                
                # Top domains
                f.write("TOP DOMAINS\n")
                f.write("-"*70 + "\n")
                for domain, count in features['top_domains'].items():
                    category = self.parser.feature_extractor.categorizer.categorize_domain(domain)
                    f.write(f"{domain} - {category} ({count} queries)\n")
            
            print(f"✅ Detailed report saved: {report_file}")
            print(f"✅ JSON results saved: {self.results_file}")
            print(f"✅ Log file: analysis_pipeline.log")
            
        except Exception as e:
            logger.error(f"Error saving report: {e}")
            print(f"❌ Error saving report: {e}")
    
    def run(self):
        """Run complete analysis pipeline"""
        print("\n" + "="*70)
        print("🚀 INSIGHTNET - NETWORK BEHAVIOR ANALYSIS PIPELINE")
        print("="*70)
        print(f"📅 Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📁 Input File: {self.csv_file}")
        
        # Validate files
        if not self.validate_files():
            print("\n❌ File validation failed!")
            return False
        
        # Step 1: Convert CSV to JSON
        if not self.step1_convert_csv_to_json():
            print("\n❌ Pipeline failed at Step 1: CSV Conversion")
            return False
        
        # Step 2: Analyze behavior
        result = self.step2_analyze_behavior()
        if not result:
            print("\n❌ Pipeline failed at Step 2: Behavior Analysis")
            return False
        
        # Step 3: Generate report
        self.step3_generate_report(result)
        
        # Step 4: Save detailed report
        self.step4_save_detailed_report(result)
        
        # Final summary
        print("\n" + "="*70)
        print("✅ PIPELINE COMPLETED SUCCESSFULLY!")
        print("="*70)
        print(f"📅 End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"\n📁 Generated Files:")
        print(f"   • {self.json_file} - Converted network logs")
        print(f"   • {self.results_file} - Analysis results (JSON)")
        print(f"   • analysis_report_*.txt - Detailed text report")
        print(f"   • analysis_pipeline.log - Execution log")
        print("\n🎯 Next Steps:")
        print("   • Review the generated reports")
        print("   • Check recommendations section")
        print("   • Take appropriate action based on behavior classification")
        
        return True

def main():
    """Main entry point"""
    print("=" * 70)
    print("InsightNet - Network Behavior Analysis System")
    print("Converting network logs into actionable insights")
    print("=" * 70)
    
    # Check if CSV file exists
    csv_file = '6a9666.csv'
    
    if len(sys.argv) > 1:
        csv_file = sys.argv[1]
    
    if not os.path.exists(csv_file):
        print(f"\n❌ Error: CSV file '{csv_file}' not found!")
        print("\nUsage:")
        print(f"   python run_analysis.py [csv_file]")
        print(f"\nExample:")
        print(f"   python run_analysis.py 6a9666.csv")
        return
    
    # Create and run pipeline
    pipeline = AnalysisPipeline(csv_file)
    success = pipeline.run()
    
    if success:
        print("\n✅ Analysis completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Analysis failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
