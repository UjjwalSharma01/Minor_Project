"""
Isolation Forest - Unsupervised Anomaly Detection

This script implements Isolation Forest to demonstrate an unsupervised anomaly
detection approach. It's designed to identify outliers (suspicious/job-hunting)
from normal behavior without labeled training data.
"""

import json
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

class IsolationForestNetworkClassifier:
    def __init__(self, contamination=0.3):
        """
        Initialize Isolation Forest classifier
        
        Args:
            contamination: Expected proportion of outliers (suspicious + job_hunting)
        """
        self.model = IsolationForest(
            n_estimators=100,
            contamination=contamination,  # Expected anomaly rate
            random_state=42,
            n_jobs=-1
        )
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.label_mapping = {
            'job_hunting': 0,
            'normal': 1,
            'suspicious': 2
        }
        # Isolation Forest returns: 1 for inliers, -1 for outliers
        # We map: 1 → normal, -1 → suspicious (or job_hunting)
        
    def load_training_data(self, filepath='../Python Code/training_data.json'):
        """Load training data from JSON file"""
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        urls = []
        labels = []
        
        for category, entries in data.items():
            label = self.label_mapping[category]
            for entry in entries:
                urls.append(entry['url'])
                labels.append(label)
        
        return urls, labels
    
    def train(self, urls, labels):
        """Train the Isolation Forest model"""
        print("=" * 60)
        print("ISOLATION FOREST - ANOMALY DETECTION")
        print("=" * 60)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            urls, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        # Vectorize
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print(f"\n📊 Dataset Split:")
        print(f"   Training samples: {len(X_train)}")
        print(f"   Test samples: {len(X_test)}")
        
        # Train model (unsupervised - doesn't use y_train)
        print(f"\n🌲 Training Isolation Forest...")
        print(f"   Parameters:")
        print(f"      n_estimators={self.model.n_estimators}")
        print(f"      contamination={self.model.contamination}")
        print(f"   Note: Algorithm detects anomalies without labels!")
        
        self.model.fit(X_train_vec)
        
        # Get predictions (1 = inlier/normal, -1 = outlier/anomaly)
        train_anomalies = self.model.predict(X_train_vec)
        test_anomalies = self.model.predict(X_test_vec)
        
        # Get anomaly scores (lower = more anomalous)
        train_scores = self.model.score_samples(X_train_vec)
        test_scores = self.model.score_samples(X_test_vec)
        
        # Convert to binary classification: normal (1) vs anomaly (0 or 2)
        # For evaluation, we'll consider job_hunting and suspicious as anomalies
        y_train_binary = np.array([1 if label == 1 else 0 for label in y_train])
        y_test_binary = np.array([1 if label == 1 else 0 for label in y_test])
        
        train_pred_binary = np.array([1 if pred == 1 else 0 for pred in train_anomalies])
        test_pred_binary = np.array([1 if pred == 1 else 0 for pred in test_anomalies])
        
        # Evaluate performance
        train_accuracy = accuracy_score(y_train_binary, train_pred_binary)
        test_accuracy = accuracy_score(y_test_binary, test_pred_binary)
        overfitting_gap = train_accuracy - test_accuracy
        
        # Count inliers and outliers
        train_inliers = np.sum(train_anomalies == 1)
        train_outliers = np.sum(train_anomalies == -1)
        test_inliers = np.sum(test_anomalies == 1)
        test_outliers = np.sum(test_anomalies == -1)
        
        print("\n" + "=" * 60)
        print("🔍 ANOMALY DETECTION RESULTS")
        print("=" * 60)
        print(f"Training Set:")
        print(f"   Inliers (Normal):    {train_inliers} samples")
        print(f"   Outliers (Anomaly):  {train_outliers} samples")
        print(f"   Detection Rate: {train_outliers/len(y_train)*100:.2f}%")
        
        print(f"\nTest Set:")
        print(f"   Inliers (Normal):    {test_inliers} samples")
        print(f"   Outliers (Anomaly):  {test_outliers} samples")
        print(f"   Detection Rate: {test_outliers/len(y_test)*100:.2f}%")
        
        print(f"\n📊 Binary Classification Performance:")
        print(f"   Training Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
        print(f"   Test Accuracy:     {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
        print(f"   Overfitting Gap:   {overfitting_gap:.4f} ({overfitting_gap*100:.2f}%)")
        
        # Detailed classification report (binary)
        print("\n" + "=" * 60)
        print("📋 BINARY CLASSIFICATION REPORT (Normal vs Anomaly)")
        print("=" * 60)
        print(classification_report(y_test_binary, test_pred_binary, 
                                   target_names=['Anomaly (Job Hunt/Suspicious)', 'Normal']))
        
        # Confusion matrix
        print("\n📊 Confusion Matrix (Test Set):")
        cm = confusion_matrix(y_test_binary, test_pred_binary)
        print(cm)
        print("   [[Anomaly→Anomaly, Anomaly→Normal],")
        print("    [Normal→Anomaly,  Normal→Normal]]")
        
        # Anomaly score distribution
        print("\n📈 Anomaly Score Distribution:")
        print(f"   Training scores - Mean: {train_scores.mean():.4f}, Std: {train_scores.std():.4f}")
        print(f"   Test scores - Mean: {test_scores.mean():.4f}, Std: {test_scores.std():.4f}")
        print(f"   (Lower scores = more anomalous)")
        
        if test_accuracy < 0.7:
            print("\n⚠️  LIMITATION DETECTED!")
            print("   Isolation Forest detects outliers but cannot distinguish")
            print("   between different types of anomalies (job hunting vs suspicious).")
            print("   Supervised methods provide more granular classification.")
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'overfitting_gap': overfitting_gap,
            'train_outliers': int(train_outliers),
            'test_outliers': int(test_outliers)
        }
    
    def predict(self, url):
        """Predict if URL is anomaly"""
        url_vec = self.vectorizer.transform([url])
        prediction = self.model.predict(url_vec)[0]
        anomaly_score = self.model.score_samples(url_vec)[0]
        
        is_anomaly = prediction == -1
        category = "Anomaly (Suspicious/Job Hunting)" if is_anomaly else "Normal"
        
        return {
            'category': category,
            'is_anomaly': bool(is_anomaly),
            'anomaly_score': float(anomaly_score),
            'confidence': float(abs(anomaly_score))  # Absolute score as confidence
        }


def main():
    """Main execution function"""
    classifier = IsolationForestNetworkClassifier()
    
    # Load training data
    print("📁 Loading training data...")
    urls, labels = classifier.load_training_data()
    print(f"   Loaded {len(urls)} samples")
    
    # Train and evaluate
    results = classifier.train(urls, labels)
    
    # Test predictions
    print("\n" + "=" * 60)
    print("🧪 SAMPLE PREDICTIONS")
    print("=" * 60)
    
    test_urls = [
        "linkedin.com/jobs",
        "google.com/search",
        "suspicious-malware-site.com",
        "indeed.com/career"
    ]
    
    for url in test_urls:
        result = classifier.predict(url)
        print(f"\nURL: {url}")
        print(f"Classification: {result['category']}")
        print(f"Anomaly Score: {result['anomaly_score']:.4f} (lower = more anomalous)")
        print(f"Is Anomaly: {result['is_anomaly']}")
    
    # Final conclusion
    print("\n" + "=" * 60)
    print("💡 ISOLATION FOREST INSIGHTS")
    print("=" * 60)
    print("Anomaly detection approach for unsupervised learning:")
    print(f"1. Binary classification accuracy: {results['test_accuracy']*100:.2f}%")
    print(f"2. Detected {results['test_outliers']} anomalies in test set")
    print("3. No labeled training data required")
    print("4. Good for detecting 'different' patterns")
    print("\n⚠️  Limitations:")
    print("   - Cannot distinguish between anomaly types")
    print("   - Only binary classification (normal vs anomaly)")
    print("   - May miss subtle job hunting patterns")
    print("   - Contamination parameter needs tuning")
    print("\n✅ When multi-class labels are available, supervised methods")
    print("   (XGBoost) provide superior granular classification.")
    print("=" * 60)


if __name__ == "__main__":
    main()
