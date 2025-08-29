#!/usr/bin/env python3
"""
Network Behavior Parser - ML-based DNS log analysis for employee behavior classification
Author: AI Assistant
Version: 1.0
"""

import json
import logging
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
import threading
import time
from typing import Dict, List, Tuple, Optional
import hashlib
from collections import Counter, defaultdict
import joblib
import warnings
warnings.filterwarnings('ignore')

# ML imports
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

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

# Import enhanced classes
try:
    from enhanced_classifier import EnhancedFeatureExtractor, EnhancedBehaviorClassifier
    ENHANCED_AVAILABLE = True
    logger.info("Enhanced classifier available")
except ImportError:
    ENHANCED_AVAILABLE = False
    logger.warning("Enhanced classifier not available, using basic version")

class DomainCategorizer:
    """Domain categorization with external domain database"""
    
    def __init__(self, domain_categories_file: str = 'domain_categories.json'):
        self.domain_categories = {}
        self.domain_categories_file = domain_categories_file
        self.load_domain_categories()
    
    def load_domain_categories(self):
        """Load domain categories from external JSON file"""
        try:
            with open(self.domain_categories_file, 'r') as f:
                self.domain_categories = json.load(f)
            logger.info(f"Loaded {len(self.domain_categories)} domain categories from {self.domain_categories_file}")
        except FileNotFoundError:
            logger.warning(f"Domain categories file {self.domain_categories_file} not found. Creating default categories.")
            self.create_default_categories()
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing domain categories file: {e}")
            self.create_default_categories()
    
    def create_default_categories(self):
        """Create default domain categories and save to file"""
        default_categories = {
            # Entertainment domains
            'youtube.com': 'entertainment',
            'netflix.com': 'entertainment',
            'tiktok.com': 'entertainment',
            'twitch.tv': 'entertainment',
            'spotify.com': 'entertainment',
            'instagram.com': 'entertainment',
            'facebook.com': 'entertainment',
            'twitter.com': 'entertainment',
            'reddit.com': 'entertainment',
            'steam.com': 'entertainment',
            'discord.com': 'entertainment',
            'snapchat.com': 'entertainment',
            'pinterest.com': 'entertainment',
            'hulu.com': 'entertainment',
            'disneyplus.com': 'entertainment',
            'primevideo.com': 'entertainment',
            'gaming.youtube.com': 'entertainment',
            'epicgames.com': 'entertainment',
            'battle.net': 'entertainment',
            'twitch.tv': 'entertainment',
            'origin.com': 'entertainment',
            'ubisoft.com': 'entertainment',
            'rockstargames.com': 'entertainment',
            'ea.com': 'entertainment',
            'riotgames.com': 'entertainment',
            
            # Work-related domains
            'github.com': 'work',
            'stackoverflow.com': 'work',
            'aws.amazon.com': 'work',
            'console.aws.amazon.com': 'work',
            'azure.microsoft.com': 'work',
            'cloud.google.com': 'work',
            'docs.google.com': 'work',
            'drive.google.com': 'work',
            'gmail.com': 'work',
            'outlook.com': 'work',
            'slack.com': 'work',
            'teams.microsoft.com': 'work',
            'zoom.us': 'work',
            'atlassian.com': 'work',
            'jira.com': 'work',
            'confluence.com': 'work',
            'docker.com': 'work',
            'jenkins.io': 'work',
            'kubernetes.io': 'work',
            'apache.org': 'work',
            'mongodb.com': 'work',
            'postgresql.org': 'work',
            'mysql.com': 'work',
            'npmjs.com': 'work',
            'pypi.org': 'work',
            'maven.apache.org': 'work',
            'bitbucket.org': 'work',
            'gitlab.com': 'work',
            'codepen.io': 'work',
            'replit.com': 'work',
            'heroku.com': 'work',
            'vercel.com': 'work',
            'netlify.com': 'work',
            'digitalocean.com': 'work',
            
            # Unethical/Job hunting domains
            'indeed.com': 'unethical',
            'linkedin.com': 'unethical',
            'monster.com': 'unethical',
            'glassdoor.com': 'unethical',
            'dice.com': 'unethical',
            'careerbuilder.com': 'unethical',
            'ziprecruiter.com': 'unethical',
            'simplyhired.com': 'unethical',
            'angel.co': 'unethical',
            'upwork.com': 'unethical',
            'freelancer.com': 'unethical',
            'fiverr.com': 'unethical',
            'toptal.com': 'unethical',
            'remotework.com': 'unethical',
            'weworkremotely.com': 'unethical',
            'jobs.com': 'unethical',
            'careerjet.com': 'unethical',
            'jobstreet.com': 'unethical',
            'seek.com': 'unethical',
            'workable.com': 'unethical',
            'lever.co': 'unethical',
            'greenhouse.io': 'unethical',
            'bamboohr.com': 'unethical',
            '99designs.com': 'unethical',
            'peopleperhour.com': 'unethical',
            
            # Neutral domains
            'google.com': 'neutral',
            'bing.com': 'neutral',
            'yahoo.com': 'neutral',
            'wikipedia.org': 'neutral',
            'weather.com': 'neutral',
            'cnn.com': 'neutral',
            'bbc.com': 'neutral',
            'microsoft.com': 'neutral',
            'apple.com': 'neutral',
            'amazon.com': 'neutral',
            'news.google.com': 'neutral',
            'reuters.com': 'neutral',
            'npr.org': 'neutral',
            'techcrunch.com': 'neutral',
            'arstechnica.com': 'neutral',
            'medium.com': 'neutral',
            'dropbox.com': 'neutral',
            'onedrive.live.com': 'neutral',
            'icloud.com': 'neutral',
            'duckduckgo.com': 'neutral'
        }
        
        self.domain_categories = default_categories
        
        # Save to file
        with open(self.domain_categories_file, 'w') as f:
            json.dump(default_categories, f, indent=2)
        logger.info(f"Created default domain categories file: {self.domain_categories_file}")
    
    def add_domain(self, domain: str, category: str):
        """Add a domain to the categorization database"""
        self.domain_categories[domain.lower()] = category
        self.save_domain_categories()
    
    def save_domain_categories(self):
        """Save current domain categories to file"""
        with open(self.domain_categories_file, 'w') as f:
            json.dump(self.domain_categories, f, indent=2)
        logger.info(f"Saved domain categories to {self.domain_categories_file}")
    def categorize_domain(self, domain: str) -> str:
        """Categorize a domain into predefined categories with enhanced matching"""
        domain = domain.lower().strip()
        
        # Remove common prefixes
        prefixes_to_remove = ['www.', 'api.', 'cdn.', 'm.', 'mobile.', 'app.']
        for prefix in prefixes_to_remove:
            if domain.startswith(prefix):
                domain = domain[len(prefix):]
        
        # Direct match
        if domain in self.domain_categories:
            return self.domain_categories[domain]
        
        # Enhanced subdomain matching - check up to 3 levels deep
        domain_parts = domain.split('.')
        for i in range(len(domain_parts)):
            candidate = '.'.join(domain_parts[i:])
            if candidate in self.domain_categories:
                return self.domain_categories[candidate]
        
        # Partial matching for known patterns
        for known_domain, category in self.domain_categories.items():
            if known_domain in domain or domain in known_domain:
                return category
        
        return 'neutral'

class FeatureExtractor:
    """Extract behavioral features from DNS logs"""
    
    def __init__(self, domain_categories_file: str = 'domain_categories.json'):
        self.categorizer = DomainCategorizer(domain_categories_file)
    
    def extract_features(self, dns_logs: List[Dict], window_minutes: int = 30) -> Dict:
        """Extract features from DNS logs for ML classification"""
        if not dns_logs:
            return self._empty_features()
        
        # Basic statistics
        total_queries = len(dns_logs)
        unique_domains = len(set(log.get('domain', '') for log in dns_logs))
        
        # Categorize domains
        category_counts = defaultdict(int)
        domain_counts = Counter()
        
        for log in dns_logs:
            domain = log.get('domain', '')
            if domain:
                category = self.categorizer.categorize_domain(domain)
                category_counts[category] += 1
                domain_counts[domain] += 1
        
        # Calculate percentages
        entertainment_pct = category_counts['entertainment'] / total_queries if total_queries > 0 else 0
        work_pct = category_counts['work'] / total_queries if total_queries > 0 else 0
        unethical_pct = category_counts['unethical'] / total_queries if total_queries > 0 else 0
        neutral_pct = category_counts['neutral'] / total_queries if total_queries > 0 else 0
        
        # Temporal features
        timestamps = [log.get('timestamp', '') for log in dns_logs if log.get('timestamp')]
        session_duration = self._calculate_session_duration(timestamps)
        queries_per_minute = total_queries / max(window_minutes, 1)
        
        # Top domains
        top_domains = dict(domain_counts.most_common(5))
        
        # Entropy (diversity of queries)
        domain_entropy = self._calculate_entropy(list(domain_counts.values()))
        
        # Anomaly features
        query_lengths = [len(log.get('domain', '')) for log in dns_logs]
        avg_query_length = np.mean(query_lengths) if query_lengths else 0
        
        return {
            'total_queries': total_queries,
            'unique_domains': unique_domains,
            'entertainment_pct': entertainment_pct,
            'work_pct': work_pct,
            'unethical_pct': unethical_pct,
            'neutral_pct': neutral_pct,
            'session_duration': session_duration,
            'queries_per_minute': queries_per_minute,
            'domain_entropy': domain_entropy,
            'avg_query_length': avg_query_length,
            'top_domains': top_domains,
            'category_counts': dict(category_counts)
        }
    
    def _empty_features(self) -> Dict:
        """Return empty feature set"""
        return {
            'total_queries': 0,
            'unique_domains': 0,
            'entertainment_pct': 0,
            'work_pct': 0,
            'unethical_pct': 0,
            'neutral_pct': 0,
            'session_duration': 0,
            'queries_per_minute': 0,
            'domain_entropy': 0,
            'avg_query_length': 0,
            'top_domains': {},
            'category_counts': {}
        }
    
    def _calculate_session_duration(self, timestamps: List[str]) -> float:
        """Calculate session duration in minutes"""
        if len(timestamps) < 2:
            return 0.0
        
        try:
            # Assume ISO format timestamps
            times = [datetime.fromisoformat(ts.replace('Z', '+00:00')) for ts in timestamps if ts]
            if times:
                duration = (max(times) - min(times)).total_seconds() / 60
                return duration
        except Exception as e:
            logger.warning(f"Could not parse timestamps: {e}")
        
        return 0.0
    
    def _calculate_entropy(self, values: List[int]) -> float:
        """Calculate Shannon entropy of domain query counts"""
        if not values:
            return 0.0
        
        total = sum(values)
        if total == 0:
            return 0.0
        
        probabilities = [v / total for v in values]
        entropy = -sum(p * np.log2(p) for p in probabilities if p > 0)
        return entropy

class BehaviorClassifier:
    """ML-based behavior classifier with external training data"""
    
    def __init__(self, training_data_file: str = 'training_data.json'):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.feature_columns = [
            'total_queries', 'unique_domains', 'entertainment_pct', 'work_pct',
            'unethical_pct', 'neutral_pct', 'session_duration', 'queries_per_minute',
            'domain_entropy', 'avg_query_length'
        ]
        self.is_trained = False
        self.training_data_file = training_data_file
    
    def load_training_data(self) -> Tuple[pd.DataFrame, np.ndarray]:
        """Load training data from external JSON file"""
        try:
            with open(self.training_data_file, 'r') as f:
                training_data = json.load(f)
            
            features_list = []
            labels_list = []
            
            for sample in training_data:
                # Extract features
                features = {}
                for col in self.feature_columns:
                    features[col] = sample.get(col, 0)
                features_list.append(features)
                
                # Extract label
                labels_list.append(sample.get('label', 'neutral'))
            
            df = pd.DataFrame(features_list)
            labels = np.array(labels_list)
            
            logger.info(f"Loaded {len(training_data)} training samples from {self.training_data_file}")
            return df, labels
            
        except FileNotFoundError:
            logger.warning(f"Training data file {self.training_data_file} not found. Creating default training data.")
            return self.generate_training_data()
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Error loading training data: {e}. Using generated data.")
            return self.generate_training_data()
    
    def create_default_training_data(self):
        """Create default training data file"""
        training_samples = []
        
        # Generate samples for each behavior category
        behavior_patterns = {
            'entertainment': {
                'count': 200,
                'entertainment_pct': (0.6, 0.9),
                'work_pct': (0.0, 0.2),
                'unethical_pct': (0.0, 0.1),
                'queries_per_minute': (8, 15),
                'domain_entropy': (2, 4)
            },
            'work': {
                'count': 250,
                'entertainment_pct': (0.0, 0.2),
                'work_pct': (0.6, 0.9),
                'unethical_pct': (0.0, 0.1),
                'queries_per_minute': (5, 12),
                'domain_entropy': (1.5, 3.5)
            },
            'unethical': {
                'count': 150,
                'entertainment_pct': (0.0, 0.3),
                'work_pct': (0.0, 0.4),
                'unethical_pct': (0.2, 0.8),
                'queries_per_minute': (3, 8),
                'domain_entropy': (1, 3)
            },
            'neutral': {
                'count': 200,
                'entertainment_pct': (0.1, 0.4),
                'work_pct': (0.1, 0.4),
                'unethical_pct': (0.0, 0.1),
                'queries_per_minute': (2, 8),
                'domain_entropy': (1, 2.5)
            },
            'mixed': {
                'count': 200,
                'entertainment_pct': (0.2, 0.5),
                'work_pct': (0.2, 0.5),
                'unethical_pct': (0.0, 0.2),
                'queries_per_minute': (4, 10),
                'domain_entropy': (2, 4)
            }
        }
        
        np.random.seed(42)
        
        for behavior, pattern in behavior_patterns.items():
            for _ in range(pattern['count']):
                # Generate features based on pattern
                sample = {'label': behavior}
                
                # Core percentages
                ent_pct = np.random.uniform(*pattern['entertainment_pct'])
                work_pct = np.random.uniform(*pattern['work_pct'])
                uneth_pct = np.random.uniform(*pattern['unethical_pct'])
                
                # Normalize percentages
                total_pct = ent_pct + work_pct + uneth_pct
                if total_pct > 1.0:
                    ent_pct /= total_pct
                    work_pct /= total_pct
                    uneth_pct /= total_pct
                
                neutral_pct = 1.0 - (ent_pct + work_pct + uneth_pct)
                neutral_pct = max(0, neutral_pct)
                
                sample['entertainment_pct'] = ent_pct
                sample['work_pct'] = work_pct
                sample['unethical_pct'] = uneth_pct
                sample['neutral_pct'] = neutral_pct
                
                # Other features
                sample['queries_per_minute'] = np.random.uniform(*pattern['queries_per_minute'])
                sample['domain_entropy'] = np.random.uniform(*pattern['domain_entropy'])
                sample['total_queries'] = int(sample['queries_per_minute'] * np.random.uniform(15, 45))
                sample['unique_domains'] = int(sample['total_queries'] * np.random.uniform(0.3, 0.8))
                sample['session_duration'] = np.random.uniform(10, 60)
                sample['avg_query_length'] = np.random.uniform(8, 25)
                
                training_samples.append(sample)
        
        # Save to file
        with open(self.training_data_file, 'w') as f:
            json.dump(training_samples, f, indent=2)
        
        logger.info(f"Created default training data with {len(training_samples)} samples: {self.training_data_file}")
        
        # Convert to required format
        features_list = []
        labels_list = []
        
        for sample in training_samples:
            features = {col: sample[col] for col in self.feature_columns}
            features_list.append(features)
            labels_list.append(sample['label'])
        
        return pd.DataFrame(features_list), np.array(labels_list)
    def generate_training_data(self, n_samples: int = 1000) -> Tuple[pd.DataFrame, np.ndarray]:
        """Fallback method to generate training data if external file fails"""
        return self.create_default_training_data()
    
    def train(self, features_df: Optional[pd.DataFrame] = None, labels: Optional[np.ndarray] = None):
        """Train the behavior classification model using external or generated data"""
        if features_df is None or labels is None:
            logger.info("Loading training data from external file...")
            try:
                features_df, labels = self.load_training_data()
            except Exception as e:
                logger.error(f"Failed to load training data: {e}")
                logger.info("Generating fallback training data...")
                features_df, labels = self.create_default_training_data()
        
        # Prepare data
        X = features_df[self.feature_columns].fillna(0)
        y = labels
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Encode labels
        y_train_encoded = self.label_encoder.fit_transform(y_train)
        y_test_encoded = self.label_encoder.transform(y_test)
        
        # Train classifier
        logger.info("Training behavior classifier...")
        self.model.fit(X_train_scaled, y_train_encoded)
        
        # Train anomaly detector
        self.anomaly_detector.fit(X_train_scaled)
        
        # Evaluate model
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test_encoded, y_pred)
        
        logger.info(f"Model trained with accuracy: {accuracy:.3f}")
        logger.info("\nClassification Report:")
        print(classification_report(y_test_encoded, y_pred, 
                                   target_names=self.label_encoder.classes_))
        
        self.is_trained = True
    
    def predict(self, features: Dict) -> Tuple[str, float, bool]:
        """Predict behavior category with confidence and anomaly flag"""
        if not self.is_trained:
            raise ValueError("Model not trained yet. Call train() first.")
        
        # Convert features to DataFrame
        feature_vector = [features.get(col, 0) for col in self.feature_columns]
        X = np.array(feature_vector).reshape(1, -1)
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Predict class and probability
        prediction = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]
        confidence = max(probabilities)
        
        # Debug: Show all class probabilities
        classes = self.label_encoder.classes_
        prob_dict = dict(zip(classes, probabilities))
        logger.info(f"Class probabilities: {prob_dict}")
        logger.info(f"Predicted class: {self.label_encoder.inverse_transform([prediction])[0]} with confidence: {confidence:.3f}")
        
        # Decode label
        behavior = self.label_encoder.inverse_transform([prediction])[0]
        
        # Check for anomaly
        anomaly_score = self.anomaly_detector.decision_function(X_scaled)[0]
        is_anomaly = self.anomaly_detector.predict(X_scaled)[0] == -1
        
        return behavior, confidence, is_anomaly
    
    def save_model(self, filepath: str = 'behavior_model.pkl'):
        """Save trained model to disk"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoder': self.label_encoder,
            'anomaly_detector': self.anomaly_detector,
            'feature_columns': self.feature_columns,
            'is_trained': self.is_trained
        }
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str = 'behavior_model.pkl'):
        """Load trained model from disk"""
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoder = model_data['label_encoder']
        self.anomaly_detector = model_data['anomaly_detector']
        self.feature_columns = model_data['feature_columns']
        self.is_trained = model_data['is_trained']
        logger.info(f"Model loaded from {filepath}")

class NextDNSClient:
    """Client for NextDNS API integration"""
    
    def __init__(self, api_key: str, profile_id: str):
        self.api_key = api_key
        self.profile_id = profile_id
        self.base_url = "https://api.nextdns.io"
        self.session = requests.Session()
        self.session.headers.update({
            'X-Api-Key': api_key,
            'Content-Type': 'application/json'
        })
    
    def get_logs(self, limit: int = 1000, since: Optional[str] = None) -> List[Dict]:
        """Fetch DNS logs from NextDNS API"""
        try:
            url = f"{self.base_url}/profiles/{self.profile_id}/logs"
            params = {'limit': limit}
            if since:
                params['since'] = since
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            logs = response.json().get('data', [])
            logger.info(f"Fetched {len(logs)} DNS logs from NextDNS")
            return logs
            
        except Exception as e:
            logger.error(f"Failed to fetch NextDNS logs: {e}")
            return []

class NetworkBehaviorParser:
    """Main class for network behavior analysis with file-based input"""
    
    def __init__(self, nextdns_api_key: str = None, nextdns_profile_id: str = None,
                 network_logs_file: str = 'networkLogs.json',
                 domain_categories_file: str = 'domain_categories.json',
                 training_data_file: str = 'training_data.json'):
        
        # Use enhanced classes if available
        if ENHANCED_AVAILABLE:
            self.feature_extractor = EnhancedFeatureExtractor(domain_categories_file)
            self.classifier = EnhancedBehaviorClassifier(training_data_file)
            logger.info("Using enhanced feature extractor and classifier")
        else:
            self.feature_extractor = FeatureExtractor(domain_categories_file)
            self.classifier = BehaviorClassifier(training_data_file)
            logger.info("Using basic feature extractor and classifier")
            
        self.nextdns_client = None
        self.network_logs_file = network_logs_file
        
        if nextdns_api_key and nextdns_profile_id:
            self.nextdns_client = NextDNSClient(nextdns_api_key, nextdns_profile_id)
        
        self.running = False
        self.results_history = []
    
    def initialize(self):
        """Initialize the system - train model if not exists"""
        try:
            self.classifier.load_model()
            logger.info("Loaded existing model")
        except:
            logger.info("Training new model...")
            if ENHANCED_AVAILABLE and hasattr(self.classifier, 'train_with_validation'):
                self.classifier.train_with_validation()
            else:
                self.classifier.train()
            self.classifier.save_model()
    
    def analyze_logs(self, dns_logs: List[Dict], window_minutes: int = 30) -> Dict:
        """Analyze DNS logs and classify behavior"""
        # Extract features (use enhanced if available)
        if ENHANCED_AVAILABLE and hasattr(self.feature_extractor, 'extract_enhanced_features'):
            features = self.feature_extractor.extract_enhanced_features(dns_logs, window_minutes)
        else:
            features = self.feature_extractor.extract_features(dns_logs, window_minutes)
        
        # Classify behavior (use enhanced if available)
        if ENHANCED_AVAILABLE and hasattr(self.classifier, 'predict_enhanced'):
            behavior, confidence, is_anomaly = self.classifier.predict_enhanced(features)
        else:
            behavior, confidence, is_anomaly = self.classifier.predict(features)
        
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
        top_domain_list = ", ".join([f"{d} ({c} queries)" for d, c in list(top_domains.items())[:3]])
        
        summary = f"User behavior classified as '{behavior}' with {confidence:.1%} confidence"
        if top_domain_list:
            summary += f" - Top domains: {top_domain_list}"
        
        return summary
    
    def start_monitoring(self, interval_minutes: int = 5):
        """Start real-time monitoring"""
        if not self.nextdns_client:
            logger.error("NextDNS client not configured")
            return
        
        self.running = True
        logger.info(f"Starting monitoring with {interval_minutes}-minute intervals")
        
        last_check = datetime.now() - timedelta(minutes=interval_minutes)
        
        while self.running:
            try:
                # Fetch recent logs
                since = last_check.isoformat()
                logs = self.nextdns_client.get_logs(limit=1000, since=since)
                
                if logs:
                    # Group logs by user/IP
                    user_logs = defaultdict(list)
                    for log in logs:
                        user_id = log.get('client_ip', 'unknown')
                        user_logs[user_id].append(log)
                    
                    # Analyze each user's behavior
                    for user_id, user_log_list in user_logs.items():
                        if len(user_log_list) > 5:  # Minimum threshold
                            result = self.analyze_logs(user_log_list, interval_minutes)
                            logger.info(f"User {result['user_id']}: {result['summary']}")
                            
                            # Log alerts for concerning behavior
                            if result['behavior'] == 'unethical' or result['is_anomaly']:
                                logger.warning(f"ALERT - {result['summary']}")
                
                last_check = datetime.now()
                time.sleep(interval_minutes * 60)
                
            except KeyboardInterrupt:
                logger.info("Monitoring stopped by user")
                break
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                time.sleep(30)
        
        self.running = False
    
    def stop_monitoring(self):
        """Stop monitoring"""
        self.running = False
    
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
    def generate_sample_logs(self, n_logs: int = 100) -> List[Dict]:
        """Generate sample DNS logs for testing (fallback method)"""
        np.random.seed(42)
        
        # Sample domains from our categorizer
        domains = list(self.feature_extractor.categorizer.domain_categories.keys())
        
        logs = []
        base_time = datetime.now()
        
        for i in range(n_logs):
            log = {
                'timestamp': (base_time + timedelta(seconds=i*30)).isoformat(),
                'domain': np.random.choice(domains),
                'client_ip': f"192.168.1.{np.random.randint(10, 50)}",
                'query_type': 'A',
                'response_code': 'NOERROR'
            }
            logs.append(log)
        
        return logs
    
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
        logger.warning("No network logs found. Generating sample logs for demo...")
        network_logs = parser.generate_sample_logs(150)
    
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
            print(f"- {domain}: {count} queries ({category})")
    
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