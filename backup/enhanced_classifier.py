#!/usr/bin/env python3
"""
Enhanced Feature Extractor and Classifier with improved accuracy and overfitting prevention
Now integrated with Domain Intelligence for superior categorization
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import json
import logging
from collections import defaultdict, Counter
from datetime import datetime
import joblib

# Import domain intelligence
# Domain intelligence is now integrated directly
DOMAIN_INTELLIGENCE_AVAILABLE = True

logger = logging.getLogger(__name__)

class EnhancedFeatureExtractor:
    """Enhanced feature extraction with domain intelligence integration"""
    
    def __init__(self, domain_categories_file: str = 'domain_categories.json'):
        self.domain_categories = {}
        self.load_domain_categories(domain_categories_file)
        # For compatibility with main.py
        self.categorizer = self
        
        # Domain intelligence is now integrated directly
        self.domain_intelligence = self  # Use self for domain intelligence methods
        logger.info("Domain Intelligence System integrated successfully")
    
    def load_domain_categories(self, domain_categories_file):
        """Load domain categories"""
        try:
            with open(domain_categories_file, 'r') as f:
                self.domain_categories = json.load(f)
            logger.info(f"Loaded {len(self.domain_categories)} domain categories")
        except Exception as e:
            logger.error(f"Error loading domain categories: {e}")
            self.domain_categories = {}
    
    def categorize_domain(self, domain: str, context_domains=None) -> str:
        """Categorize domain into behavior types"""
        if not domain:
            return 'neutral'
        
        # Check domain categories first
        if domain in self.domain_categories:
            return self.domain_categories[domain]
        
        # Basic pattern matching fallback
        domain_lower = domain.lower()
        
        # Remove common prefixes for better matching
        for prefix in ['www.', 'api.', 'cdn.', 'm.', 'mobile.', 'app.']:
            if domain_lower.startswith(prefix):
                domain_lower = domain_lower[len(prefix):]
                break
        
        if any(pattern in domain_lower for pattern in ['facebook', 'instagram', 'youtube', 'whatsapp', 'tiktok']):
            return 'entertainment'
        elif any(pattern in domain_lower for pattern in ['github', 'stackoverflow', 'aws', 'cloud', 'docker']):
            return 'work'
        elif any(pattern in domain_lower for pattern in ['linkedin', 'indeed', 'naukri', 'job']):
            return 'unethical'
        elif any(pattern in domain_lower for pattern in ['amazon', 'ebay', 'shop', 'store']):
            return 'shopping'
        elif any(pattern in domain_lower for pattern in ['tracking', 'analytics', 'ads', 'doubleclick']):
            return 'neutral'
        
        return 'neutral'
    
    def enhanced_categorize_domain(self, domain: str, context_domains=None):
        """Enhanced domain categorization with context awareness"""
        if not domain:
            return 'neutral', 'pure'
            
        # Remove common prefixes for better matching
        clean_domain = domain
        prefixes = ['www.', 'api.', 'cdn.', 'm.', 'mobile.', 'app.', 'static.', 'assets.']
        for prefix in prefixes:
            if clean_domain.startswith(prefix):
                clean_domain = clean_domain[len(prefix):]
                break
        
        # Check domain categories first (this gives us the most accurate categorization)
        category = None
        if clean_domain in self.domain_categories:
            category = self.domain_categories[clean_domain]
        elif domain in self.domain_categories:
            category = self.domain_categories[domain]
        else:
            # Enhanced pattern matching for domains not in our database
            domain_lower = domain.lower()
            
            # Entertainment patterns (more comprehensive)
            entertainment_patterns = [
                'facebook', 'instagram', 'youtube', 'whatsapp', 'tiktok', 'snapchat', 'twitter',
                'netflix', 'hulu', 'disney', 'prime', 'spotify', 'soundcloud', 'twitch',
                'gaming', 'game', 'steam', 'xbox', 'playstation', 'nintendo',
                'entertainment', 'media', 'video', 'music', 'streaming'
            ]
            
            # Work patterns
            work_patterns = [
                'github', 'stackoverflow', 'aws', 'cloud', 'docker', 'microsoft', 'office',
                'slack', 'zoom', 'teams', 'confluence', 'jira', 'gitlab', 'bitbucket',
                'developer', 'dev', 'api', 'tech', 'programming', 'code'
            ]
            
            # Shopping patterns
            shopping_patterns = [
                'amazon', 'ebay', 'shop', 'store', 'cart', 'buy', 'purchase', 'retail',
                'commerce', 'market', 'mall', 'shopping'
            ]
            
            # Unethical patterns (job hunting, etc.)
            unethical_patterns = [
                'linkedin', 'indeed', 'naukri', 'job', 'career', 'resume', 'recruitment'
            ]
            
            if any(pattern in domain_lower for pattern in entertainment_patterns):
                category = 'entertainment'
            elif any(pattern in domain_lower for pattern in work_patterns):
                category = 'work'
            elif any(pattern in domain_lower for pattern in shopping_patterns):
                category = 'shopping'
            elif any(pattern in domain_lower for pattern in unethical_patterns):
                category = 'unethical'
            else:
                category = 'neutral'
        
        # Enhanced tracking detection
        tracking_patterns = [
            'tracking', 'analytics', 'ads', 'doubleclick', 'googletagmanager', 
            'google-analytics', 'facebook.com/tr', 'googleads', 'adsystem',
            'googlesyndication', 'adsense', 'adnxs', 'adsystem', 'amazon-adsystem',
            'facebook.com/plugins', 'connect.facebook.net', 'scorecardresearch',
            'quantserve', 'outbrain', 'taboola'
        ]
        
        # Context-aware tracking attribution
        is_tracking = any(pattern in domain.lower() for pattern in tracking_patterns)
        
        # If it's a tracking domain, try to attribute it to the parent service
        if is_tracking and context_domains:
            # Look for entertainment domains in the context
            # Use basic categorization to avoid recursion
            entertainment_context = any(
                self.categorize_domain(ctx_domain) == 'entertainment' 
                for ctx_domain in context_domains[:10]  # Check recent domains
                if ctx_domain != domain
            )
            if entertainment_context:
                category = 'entertainment'
        
        subcategory = "tracking" if is_tracking else "pure"
        return category, subcategory
    
    def analyze_user_behavior_with_intelligence(self, dns_logs):
        """Analyze user behavior with domain intelligence"""
        if not dns_logs:
            return {
                'percentages': {'entertainment': 0, 'work': 0, 'unethical': 0, 'neutral': 0, 'shopping': 0},
                'detailed_breakdown': {'entertainment': {'pure': 0, 'tracking': 0}}
            }
        
        # Categorize all domains with enhanced intelligence
        total_queries = len(dns_logs)
        category_counts = {'entertainment': 0, 'work': 0, 'unethical': 0, 'neutral': 0, 'shopping': 0}
        detailed_breakdown = {
            'entertainment': {'pure': 0, 'tracking': 0},
            'work': {'pure': 0, 'tracking': 0},
            'unethical': {'pure': 0, 'tracking': 0},
            'neutral': {'pure': 0, 'tracking': 0},
            'shopping': {'pure': 0, 'tracking': 0}
        }
        
        for i, log in enumerate(dns_logs):
            domain = log.get('domain', '')
            if domain:
                # Get context from surrounding domains for better tracking attribution
                context_domains = []
                context_range = 5  # Look at 5 domains before and after
                start_idx = max(0, i - context_range)
                end_idx = min(len(dns_logs), i + context_range + 1)
                
                for j in range(start_idx, end_idx):
                    if j != i and j < len(dns_logs):
                        ctx_domain = dns_logs[j].get('domain', '')
                        if ctx_domain:
                            context_domains.append(ctx_domain)
                
                category, subcategory = self.enhanced_categorize_domain(domain, context_domains)
                category_counts[category] += 1
                detailed_breakdown[category][subcategory] += 1
        
        # Calculate percentages
        percentages = {}
        for cat in category_counts:
            percentages[cat] = category_counts[cat] / total_queries if total_queries > 0 else 0
        
        return {
            'percentages': percentages,
            'detailed_breakdown': detailed_breakdown
        }
    
    def extract_enhanced_features(self, dns_logs, window_minutes=30):
        """Extract enhanced features with domain intelligence integration"""
        if not dns_logs:
            return self._empty_features()
        
        total_queries = len(dns_logs)
        
        # Get all domains for context
        all_domains = [log.get('domain', '') for log in dns_logs if log.get('domain')]
        
        # Use domain intelligence for comprehensive analysis if available
        if self.domain_intelligence:
            try:
                intelligence_result = self.domain_intelligence.analyze_user_behavior_with_intelligence(dns_logs)
                
                # Extract enhanced percentages from domain intelligence
                entertainment_pct = intelligence_result['percentages']['entertainment']
                work_pct = intelligence_result['percentages']['work']
                unethical_pct = intelligence_result['percentages']['unethical']
                neutral_pct = intelligence_result['percentages']['neutral']
                shopping_pct = intelligence_result['percentages']['shopping']
                
                # Get detailed breakdown
                detailed_breakdown = intelligence_result['detailed_breakdown']
                
                # Additional intelligence metrics
                pure_entertainment_pct = detailed_breakdown['entertainment']['pure'] / total_queries if total_queries > 0 else 0
                entertainment_tracking_pct = detailed_breakdown['entertainment']['tracking'] / total_queries if total_queries > 0 else 0
                
            except Exception as e:
                logger.warning(f"Domain intelligence analysis failed: {e}")
                # Fall back to basic analysis
                entertainment_pct, work_pct, unethical_pct, neutral_pct, shopping_pct = self._basic_categorization(dns_logs)
                pure_entertainment_pct = entertainment_tracking_pct = 0
        else:
            # Basic categorization fallback
            entertainment_pct, work_pct, unethical_pct, neutral_pct, shopping_pct = self._basic_categorization(dns_logs)
            pure_entertainment_pct = entertainment_tracking_pct = 0
        
        # Domain analysis
        domain_counts = Counter()
        blocked_count = 0
        
        for log in dns_logs:
            domain = log.get('domain', '')
            if domain:
                domain_counts[domain] += 1
                
                # Count blocked queries
                if log.get('status') == 'blocked' or log.get('response_code') == 'BLOCKED':
                    blocked_count += 1
        
        # Basic metrics
        unique_domains = len(domain_counts)
        top_domain_concentration = max(domain_counts.values()) / total_queries if domain_counts else 0
        blocked_queries_pct = blocked_count / total_queries if total_queries > 0 else 0
        
        # Temporal features
        timestamps = [log.get('timestamp', '') for log in dns_logs if log.get('timestamp')]
        session_duration = self._calculate_session_duration(timestamps)
        queries_per_minute = total_queries / max(session_duration, 1) if session_duration > 0 else total_queries
        
        # Diversity metrics
        domain_entropy = self._calculate_entropy(list(domain_counts.values()))
        category_diversity = len(set([self.categorize_domain(domain, all_domains) for domain in domain_counts.keys()]))
        
        # Behavioral patterns
        peak_hour = self._extract_peak_activity_hour(timestamps)
        weekend_activity = self._calculate_weekend_activity(timestamps)
        
        # Query patterns
        query_lengths = [len(log.get('domain', '')) for log in dns_logs]
        avg_query_length = np.mean(query_lengths) if query_lengths else 0
        query_length_variance = np.var(query_lengths) if query_lengths else 0
        
        # Enhanced specific indicators
        social_media_pct = self._calculate_social_media_percentage(dns_logs)
        streaming_pct = self._calculate_streaming_percentage(dns_logs)
        dev_tools_pct = self._calculate_dev_tools_percentage(dns_logs)
        cloud_services_pct = self._calculate_cloud_services_percentage(dns_logs)
        
        return {
            # Basic features (now enhanced with domain intelligence)
            'total_queries': total_queries,
            'unique_domains': unique_domains,
            'entertainment_pct': entertainment_pct,
            'work_pct': work_pct,
            'unethical_pct': unethical_pct,
            'neutral_pct': neutral_pct,
            'shopping_pct': shopping_pct,
            
            # Domain Intelligence enhanced features
            'pure_entertainment_pct': pure_entertainment_pct,
            'entertainment_tracking_pct': entertainment_tracking_pct,
            
            # Advanced features
            'session_duration': session_duration,
            'queries_per_minute': queries_per_minute,
            'domain_entropy': domain_entropy,
            'top_domain_concentration': top_domain_concentration,
            'blocked_queries_pct': blocked_queries_pct,
            'category_diversity': category_diversity,
            
            # Temporal features
            'peak_activity_hour': peak_hour,
            'weekend_activity': weekend_activity,
            
            # Query patterns
            'avg_query_length': avg_query_length,
            'query_length_variance': query_length_variance,
            
            # Specific indicators
            'social_media_pct': social_media_pct,
            'streaming_pct': streaming_pct,
            'dev_tools_pct': dev_tools_pct,
            'cloud_services_pct': cloud_services_pct,
            
            # Metadata (enhanced with domain intelligence if available)
            'category_counts': self._get_category_counts(dns_logs, all_domains),
            'top_domains': dict(domain_counts.most_common(5))
        }
    
    def _calculate_social_media_percentage(self, dns_logs):
        """Calculate percentage of social media queries"""
        social_media_domains = ['facebook', 'instagram', 'twitter', 'x.com', 'tiktok', 'snapchat', 'linkedin']
        social_count = 0
        total = len(dns_logs)
        
        for log in dns_logs:
            domain = log.get('domain', '').lower()
            if any(sm in domain for sm in social_media_domains):
                social_count += 1
        
        return social_count / total if total > 0 else 0
    
    def _calculate_streaming_percentage(self, dns_logs):
        """Calculate percentage of streaming queries"""
        streaming_domains = ['youtube', 'netflix', 'primevideo', 'hotstar', 'disney', 'hulu', 'spotify']
        streaming_count = 0
        total = len(dns_logs)
        
        for log in dns_logs:
            domain = log.get('domain', '').lower()
            if any(stream in domain for stream in streaming_domains):
                streaming_count += 1
        
        return streaming_count / total if total > 0 else 0
    
    def _calculate_dev_tools_percentage(self, dns_logs):
        """Calculate percentage of development tools queries"""
        dev_domains = ['github', 'stackoverflow', 'gitlab', 'docker', 'npm', 'maven', 'gradle']
        dev_count = 0
        total = len(dns_logs)
        
        for log in dns_logs:
            domain = log.get('domain', '').lower()
            if any(dev in domain for dev in dev_domains):
                dev_count += 1
        
        return dev_count / total if total > 0 else 0
    
    def _calculate_cloud_services_percentage(self, dns_logs):
        """Calculate percentage of cloud services queries"""
        cloud_domains = ['aws', 'azure', 'gcp', 'cloud.google', 'herokuapp', 'netlify', 'vercel']
        cloud_count = 0
        total = len(dns_logs)
        
        for log in dns_logs:
            domain = log.get('domain', '').lower()
            if any(cloud in domain for cloud in cloud_domains):
                cloud_count += 1
        
        return cloud_count / total if total > 0 else 0
    
    def _extract_peak_activity_hour(self, timestamps):
        """Extract peak activity hour"""
        if not timestamps:
            return 12  # Default to noon
        
        try:
            hours = []
            for ts in timestamps:
                if ts:
                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    hours.append(dt.hour)
            
            if hours:
                return Counter(hours).most_common(1)[0][0]
        except Exception as e:
            logger.debug(f"Error extracting peak hour: {e}")
        
        return 12
    
    def _calculate_weekend_activity(self, timestamps):
        """Calculate weekend activity ratio"""
        if not timestamps:
            return 0.5
        
        try:
            weekend_count = 0
            weekday_count = 0
            
            for ts in timestamps:
                if ts:
                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    if dt.weekday() >= 5:  # Saturday=5, Sunday=6
                        weekend_count += 1
                    else:
                        weekday_count += 1
            
            total = weekend_count + weekday_count
            return weekend_count / total if total > 0 else 0.5
        except Exception as e:
            logger.debug(f"Error calculating weekend activity: {e}")
        
        return 0.5
    
    def _calculate_session_duration(self, timestamps):
        """Calculate session duration in minutes"""
        if len(timestamps) < 2:
            return 1.0
        
        try:
            times = []
            for ts in timestamps:
                if ts:
                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    times.append(dt)
            
            if len(times) >= 2:
                duration = (max(times) - min(times)).total_seconds() / 60
                return max(duration, 1.0)  # Minimum 1 minute
        except Exception as e:
            logger.debug(f"Error calculating session duration: {e}")
        
        return 1.0
    
    def _basic_categorization(self, dns_logs):
        """Basic categorization fallback when domain intelligence is not available"""
        category_counts = defaultdict(int)
        total_queries = len(dns_logs)
        
        for log in dns_logs:
            domain = log.get('domain', '')
            if domain:
                category = self.categorize_domain(domain)
                category_counts[category] += 1
        
        entertainment_pct = category_counts['entertainment'] / total_queries if total_queries > 0 else 0
        work_pct = category_counts['work'] / total_queries if total_queries > 0 else 0
        unethical_pct = category_counts['unethical'] / total_queries if total_queries > 0 else 0
        neutral_pct = category_counts['neutral'] / total_queries if total_queries > 0 else 0
        shopping_pct = category_counts.get('shopping', 0) / total_queries if total_queries > 0 else 0
        
        return entertainment_pct, work_pct, unethical_pct, neutral_pct, shopping_pct
    
    def _get_category_counts(self, dns_logs, all_domains):
        """Get category counts using enhanced categorization"""
        category_counts = defaultdict(int)
        
        for log in dns_logs:
            domain = log.get('domain', '')
            if domain:
                category = self.categorize_domain(domain, all_domains)
                category_counts[category] += 1
        
        return dict(category_counts)
    
    def _calculate_entropy(self, values):
        """Calculate Shannon entropy"""
        if not values:
            return 0.0
        
        total = sum(values)
        if total == 0:
            return 0.0
        
        probabilities = [v / total for v in values if v > 0]
        entropy = -sum(p * np.log2(p) for p in probabilities if p > 0)
        return entropy
    
    def _empty_features(self):
        """Return empty feature set"""
        return {
            'total_queries': 0, 'unique_domains': 0, 'entertainment_pct': 0, 'work_pct': 0,
            'unethical_pct': 0, 'neutral_pct': 0, 'shopping_pct': 0, 'session_duration': 1,
            'queries_per_minute': 0, 'domain_entropy': 0, 'top_domain_concentration': 0,
            'blocked_queries_pct': 0, 'category_diversity': 0, 'peak_activity_hour': 12,
            'weekend_activity': 0.5, 'avg_query_length': 0, 'query_length_variance': 0,
            'social_media_pct': 0, 'streaming_pct': 0, 'dev_tools_pct': 0, 'cloud_services_pct': 0,
            'category_counts': {}, 'top_domains': {}
        }

class EnhancedBehaviorClassifier:
    """Enhanced classifier with overfitting prevention"""
    
    def __init__(self, training_data_file='training_data.json'):
        # Prevent overfitting with conservative parameters
        self.model = RandomForestClassifier(
            n_estimators=50,          # Reduced from 100
            max_depth=8,              # Reduced from 10
            min_samples_split=10,     # Increased from default 2
            min_samples_leaf=5,       # Increased from default 1
            max_features='sqrt',      # Use sqrt instead of 'auto'
            random_state=42,
            class_weight='balanced',
            bootstrap=True,
            oob_score=True            # Out-of-bag scoring
        )
        
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_columns = [
            'total_queries', 'unique_domains', 'entertainment_pct', 'work_pct',
            'unethical_pct', 'neutral_pct', 'shopping_pct', 'session_duration',
            'queries_per_minute', 'domain_entropy', 'top_domain_concentration',
            'blocked_queries_pct', 'category_diversity', 'peak_activity_hour',
            'weekend_activity', 'avg_query_length', 'query_length_variance',
            'social_media_pct', 'streaming_pct', 'dev_tools_pct', 'cloud_services_pct',
            'pure_entertainment_pct', 'entertainment_tracking_pct'  # New domain intelligence features
        ]
        self.is_trained = False
        self.training_data_file = training_data_file
        self.cv_scores = None
    
    def train_with_validation(self):
        """Train model with cross-validation to prevent overfitting"""
        X, y = self.load_training_data()
        
        if len(X) == 0:
            logger.error("No training data available")
            return
        
        # Prepare features
        X_processed = X[self.feature_columns].fillna(0)
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X_processed)
        
        # Cross-validation to check for overfitting
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(self.model, X_scaled, y_encoded, cv=cv, scoring='accuracy')
        
        self.cv_scores = cv_scores
        logger.info(f"Cross-validation scores: {cv_scores}")
        logger.info(f"Mean CV accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
        
        # Train final model
        self.model.fit(X_scaled, y_encoded)
        
        # Check feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        logger.info("Top 10 feature importances:")
        for _, row in feature_importance.head(10).iterrows():
            logger.info(f"  {row['feature']}: {row['importance']:.3f}")
        
        # Check for overfitting with OOB score
        if hasattr(self.model, 'oob_score_'):
            logger.info(f"Out-of-bag score: {self.model.oob_score_:.3f}")
        
        self.is_trained = True
        logger.info("Enhanced model training completed")
    
    def load_training_data(self):
        """Load training data from JSON file"""
        try:
            with open(self.training_data_file, 'r') as f:
                training_data = json.load(f)
            
            df = pd.DataFrame(training_data)
            labels = df['label'].values
            
            logger.info(f"Loaded {len(training_data)} training samples")
            logger.info(f"Label distribution: {Counter(labels)}")
            
            return df, labels
            
        except Exception as e:
            logger.error(f"Error loading training data: {e}")
            return pd.DataFrame(), np.array([])
    
    def predict_enhanced(self, features):
        """Enhanced prediction with confidence and validation"""
        if not self.is_trained:
            logger.error("Model not trained yet")
            return 'neutral', 0.0, False
        
        try:
            # Prepare features
            feature_vector = []
            for col in self.feature_columns:
                feature_vector.append(features.get(col, 0))
            
            feature_array = np.array(feature_vector).reshape(1, -1)
            feature_scaled = self.scaler.transform(feature_array)
            
            # Predict
            prediction = self.model.predict(feature_scaled)[0]
            probabilities = self.model.predict_proba(feature_scaled)[0]
            
            # Get behavior label and confidence
            behavior = self.label_encoder.inverse_transform([prediction])[0]
            confidence = np.max(probabilities)
            
            # Enhanced anomaly detection based on feature patterns
            is_anomaly = self._detect_anomaly(features)
            
            logger.info(f"Prediction: {behavior} (confidence: {confidence:.3f})")
            
            return behavior, confidence, is_anomaly
            
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            return 'neutral', 0.0, False
    
    def _detect_anomaly(self, features):
        """Enhanced anomaly detection"""
        # Define normal ranges based on training data
        anomaly_indicators = []
        
        # Check for extremely high entertainment percentage
        if features.get('entertainment_pct', 0) > 0.8:
            anomaly_indicators.append('Very high entertainment usage')
        
        # Check for high unethical percentage
        if features.get('unethical_pct', 0) > 0.3:
            anomaly_indicators.append('High unethical activity')
        
        # Check for unusual query patterns
        if features.get('queries_per_minute', 0) > 30:
            anomaly_indicators.append('Unusually high query rate')
        
        # Check for very low diversity (potential bot)
        if features.get('domain_entropy', 0) < 1.0 and features.get('total_queries', 0) > 100:
            anomaly_indicators.append('Very low domain diversity')
        
        # Check for off-hours activity
        peak_hour = features.get('peak_activity_hour', 12)
        if peak_hour < 6 or peak_hour > 23:
            anomaly_indicators.append('Off-hours peak activity')
        
        return len(anomaly_indicators) > 0
    
    def save_model(self, filepath='behavior_model.pkl'):
        """Save trained model"""
        if self.is_trained:
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'label_encoder': self.label_encoder,
                'feature_columns': self.feature_columns,
                'cv_scores': self.cv_scores
            }
            joblib.dump(model_data, filepath)
            logger.info(f"Enhanced model saved to {filepath}")
    
    def load_model(self, filepath='behavior_model.pkl'):
        """Load trained model"""
        try:
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.label_encoder = model_data['label_encoder']
            self.feature_columns = model_data['feature_columns']
            self.cv_scores = model_data.get('cv_scores')
            self.is_trained = True
            logger.info(f"Enhanced model loaded from {filepath}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
