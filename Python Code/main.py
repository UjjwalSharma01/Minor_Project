#!/usr/bin/env python3
"""
InsightNet - Network Behavior Analysis System
ML-based DNS log analysis for employee behavior classification

Author: Ujjwal Sharma
Project: InsightNet - Converting network logs into actionable insights
Version: 1.0
"""

import json
import logging
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
import hashlib
from collections import Counter, defaultdict
import joblib
import warnings
warnings.filterwarnings('ignore')

# ML imports
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import xgboost as xgb

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('network_behavior.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Import enhanced classes (REQUIRED - no fallback)
from enhanced_classifier import EnhancedFeatureExtractor, EnhancedBehaviorClassifier

# NOTE: All basic classifier classes (DomainCategorizer, FeatureExtractor, BehaviorClassifier) 
# have been removed. We exclusively use the enhanced classifier with XGBoost for consistency.
# The enhanced classifier provides all features with better accuracy and domain intelligence.

class NetworkBehaviorParser:
    """Main class for network behavior analysis with enhanced XGBoost classifier"""
    
    def __init__(self, network_logs_file: str = 'networkLogs.json',
                 domain_categories_file: str = 'domain_categories.json',
                 training_data_file: str = 'training_data.json'):
        
        # Always use enhanced classifier with XGBoost
        self.feature_extractor = EnhancedFeatureExtractor(domain_categories_file)
        self.classifier = EnhancedBehaviorClassifier(training_data_file)
        logger.info("Using Enhanced XGBoost Classifier with Domain Intelligence")
            
        self.network_logs_file = network_logs_file
        self.results_history = []
    
    def initialize(self):
        """Initialize the system - train model if not exists"""
        try:
            self.classifier.load_model()
            logger.info("Loaded existing enhanced model")
        except:
            logger.info("Training new enhanced XGBoost model...")
            self.classifier.train_with_validation()
            self.classifier.save_model()
    
    def analyze_logs(self, dns_logs: List[Dict], window_minutes: int = 30) -> Dict:
        """Analyze DNS logs and classify behavior using enhanced XGBoost"""
        # Extract enhanced features with domain intelligence
        features = self.feature_extractor.extract_enhanced_features(dns_logs, window_minutes)
        
        # Classify behavior using enhanced XGBoost predictor
        behavior, confidence, is_anomaly = self.classifier.predict_enhanced(features)
        
        # Anonymize user data
        user_hash = self._anonymize_user(dns_logs)
        
        result = {
            'timestamp': datetime.now().isoformat(),
            'user_id': user_hash,
            'behavior': behavior,
            'confidence': confidence,
            'is_anomaly': is_anomaly,
            'features': features,
            'summary': self._generate_summary(features, behavior, confidence)
        }
        
        self.results_history.append(result)
        return result
    
    def _anonymize_user(self, dns_logs: List[Dict]) -> str:
        """Create anonymous hash for user identification"""
        # Use first IP or device identifier to create hash
        identifier = "unknown"
        if dns_logs:
            identifier = dns_logs[0].get('client_ip', dns_logs[0].get('device', 'unknown'))
        
        return hashlib.md5(str(identifier).encode()).hexdigest()[:8]
    
    def _generate_summary(self, features: Dict, behavior: str, confidence: float) -> str:
        """Generate human-readable summary"""
        top_domains = features.get('top_domains', {})
        top_domain_list = ", ".join([d for d, c in list(top_domains.items())[:3]])
        
        summary = f"User behavior classified as '{behavior}' with {confidence:.1%} confidence"
        if top_domain_list:
            summary += f" - Top domains: {top_domain_list}"
        
        return summary
    
    def load_network_logs(self) -> List[Dict]:
        """Load network logs from JSON file"""
        try:
            with open(self.network_logs_file, 'r') as f:
                logs = json.load(f)
            
            if isinstance(logs, dict) and 'logs' in logs:
                logs = logs['logs']
            elif isinstance(logs, dict) and 'data' in logs:
                logs = logs['data']
            
            logger.info(f"Loaded {len(logs)} network logs from {self.network_logs_file}")
            return logs
            
        except FileNotFoundError:
            logger.error(f"Network logs file {self.network_logs_file} not found.")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing network logs file: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error loading network logs: {e}")
            return []
    
    def save_results(self, filepath: str = 'behavior_results.json'):
        """Save analysis results to file"""
        with open(filepath, 'w') as f:
            json.dump(self.results_history, f, indent=2, default=str)
        logger.info(f"Results saved to {filepath}")

def main():
    """Main function for testing and demo with file-based input"""
    # Initialize parser with file paths
    parser = NetworkBehaviorParser(
        network_logs_file='networkLogs.json',
        domain_categories_file='domain_categories.json',
        training_data_file='training_data.json'
    )
    
    # Train model
    logger.info("Initializing Network Behavior Parser...")
    parser.initialize()
    
    # Load network logs from file
    logger.info("Loading network logs from file...")
    network_logs = parser.load_network_logs()
    
    if not network_logs:
        logger.error("No network logs found. Please provide networkLogs.json file.")
        return
    
    # Analyze behavior
    logger.info("Analyzing behavior...")
    result = parser.analyze_logs(network_logs)
    
    # Display results
    print("\n" + "="*50)
    print("NETWORK BEHAVIOR ANALYSIS RESULTS")
    print("="*50)
    print(f"User ID: {result['user_id']}")
    print(f"Behavior: {result['behavior']}")
    print(f"Confidence: {result['confidence']:.1%}")
    print(f"Anomaly: {'Yes' if result['is_anomaly'] else 'No'}")
    print(f"\nSummary: {result['summary']}")
    
    print(f"\nFeature Details:")
    features = result['features']
    print(f"- Total Queries: {features['total_queries']}")
    print(f"- Unique Domains: {features['unique_domains']}")
    print(f"- Entertainment: {features['entertainment_pct']:.1%}")
    if 'pure_entertainment_pct' in features:
        print(f"  - Pure Entertainment: {features['pure_entertainment_pct']:.1%}")
        print(f"  - Entertainment Tracking: {features['entertainment_tracking_pct']:.1%}")
    print(f"- Work: {features['work_pct']:.1%}")
    print(f"- Unethical: {features['unethical_pct']:.1%}")
    print(f"- Shopping: {features.get('shopping_pct', 0):.1%}")
    print(f"- Neutral: {features['neutral_pct']:.1%}")
    print(f"- Session Duration: {features['session_duration']:.1f} minutes")
    print(f"- Domain Entropy: {features['domain_entropy']:.2f}")
    if 'social_media_pct' in features:
        print(f"- Social Media Usage: {features['social_media_pct']:.1%}")
    if 'streaming_pct' in features:
        print(f"- Streaming Usage: {features['streaming_pct']:.1%}")
    
    print(f"\nCategory Breakdown:")
    for category, count in features['category_counts'].items():
        percentage = (count / features['total_queries']) * 100 if features['total_queries'] > 0 else 0
        print(f"- {category.title()}: {count} queries ({percentage:.1f}%)")
    
    # Display top domains
    if features['top_domains']:
        print(f"\nTop Domains:")
        for domain, count in features['top_domains'].items():
            category = parser.feature_extractor.categorizer.categorize_domain(domain)
            print(f"- {domain} ({category})")
    
    # Save results
    parser.save_results()
    
    print("\n" + "="*50)
    print("Analysis completed!")
    print(f"Results saved to 'behavior_results.json'")
    print(f"Domain categories: {len(parser.feature_extractor.categorizer.domain_categories)} domains loaded")
    print("To analyze your own data, place logs in 'networkLogs.json'")
    print("To customize categories, edit 'domain_categories.json'")
    print("To use custom training data, edit 'training_data.json'")

if __name__ == "__main__":
    main()