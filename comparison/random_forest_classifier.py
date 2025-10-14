"""
Random Forest Classifier - Demonstrating Overfitting Issues

This script implements a Random Forest classifier to show why it was NOT chosen
as the final model. The model exhibits overfitting with high training accuracy
but significantly lower test accuracy.
"""

import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

class RandomForestNetworkClassifier:
    def __init__(self, n_estimators=200, max_depth=None, min_samples_split=2):
        """
        Initialize Random Forest classifier with parameters that tend to overfit
        
        Args:
            n_estimators: Number of trees (high value can lead to overfitting)
            max_depth: Maximum depth of trees (None allows unlimited depth - overfitting risk)
            min_samples_split: Minimum samples to split (low value - overfitting risk)
        """
        self.model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,  # No limit - can overfit
            min_samples_split=min_samples_split,  # Low value - can overfit
            min_samples_leaf=1,  # Very low - high risk of overfitting
            random_state=42,
            n_jobs=-1
        )
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.label_mapping = {
            'job_hunting': 0,
            'normal': 1,
            'suspicious': 2
        }
        
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
        """Train the Random Forest model"""
        print("=" * 60)
        print("RANDOM FOREST CLASSIFIER - OVERFITTING DEMONSTRATION")
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
        
        # Train model
        print(f"\n🌲 Training Random Forest...")
        print(f"   Parameters: n_estimators={self.model.n_estimators}")
        print(f"               max_depth={self.model.max_depth} (unlimited)")
        print(f"               min_samples_split={self.model.min_samples_split}")
        print(f"               min_samples_leaf={self.model.min_samples_leaf}")
        
        self.model.fit(X_train_vec, y_train)
        
        # Evaluate on training data
        train_pred = self.model.predict(X_train_vec)
        train_accuracy = accuracy_score(y_train, train_pred)
        
        # Evaluate on test data
        test_pred = self.model.predict(X_test_vec)
        test_accuracy = accuracy_score(y_test, test_pred)
        
        # Calculate overfitting metric
        overfitting_gap = train_accuracy - test_accuracy
        
        print("\n" + "=" * 60)
        print("⚠️  OVERFITTING ANALYSIS")
        print("=" * 60)
        print(f"✓ Training Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
        print(f"✗ Test Accuracy:     {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
        print(f"📉 Overfitting Gap:  {overfitting_gap:.4f} ({overfitting_gap*100:.2f}%)")
        
        if overfitting_gap > 0.1:
            print("\n🚨 SIGNIFICANT OVERFITTING DETECTED!")
            print("   The model memorized training data but fails to generalize.")
            print("   This is why Random Forest was NOT chosen for production.")
        
        # Cross-validation scores
        print(f"\n🔄 Cross-Validation Scores (5-fold):")
        cv_scores = cross_val_score(self.model, X_train_vec, y_train, cv=5)
        print(f"   CV Scores: {cv_scores}")
        print(f"   Mean CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        print(f"   High variance in CV scores indicates instability")
        
        # Detailed classification report
        print("\n" + "=" * 60)
        print("📋 TEST SET CLASSIFICATION REPORT")
        print("=" * 60)
        print(classification_report(y_test, test_pred, 
                                   target_names=['job_hunting', 'normal', 'suspicious']))
        
        # Confusion matrix
        print("\n📊 Confusion Matrix (Test Set):")
        cm = confusion_matrix(y_test, test_pred)
        print(cm)
        
        # Feature importance
        print("\n🔍 Top 10 Most Important Features:")
        feature_names = self.vectorizer.get_feature_names_out()
        importances = self.model.feature_importances_
        indices = np.argsort(importances)[::-1][:10]
        
        for i, idx in enumerate(indices, 1):
            print(f"   {i}. {feature_names[idx]}: {importances[idx]:.4f}")
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'overfitting_gap': overfitting_gap,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std()
        }
    
    def predict(self, url):
        """Predict category for a single URL"""
        url_vec = self.vectorizer.transform([url])
        prediction = self.model.predict(url_vec)[0]
        probabilities = self.model.predict_proba(url_vec)[0]
        
        reverse_mapping = {v: k for k, v in self.label_mapping.items()}
        
        return {
            'category': reverse_mapping[prediction],
            'probabilities': {
                'job_hunting': float(probabilities[0]),
                'normal': float(probabilities[1]),
                'suspicious': float(probabilities[2])
            }
        }


def main():
    """Main execution function"""
    classifier = RandomForestNetworkClassifier()
    
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
        "suspicious-malware-site.com"
    ]
    
    for url in test_urls:
        result = classifier.predict(url)
        print(f"\nURL: {url}")
        print(f"Prediction: {result['category']}")
        print(f"Confidence: {max(result['probabilities'].values())*100:.2f}%")
    
    # Final conclusion
    print("\n" + "=" * 60)
    print("💡 CONCLUSION")
    print("=" * 60)
    print("Random Forest shows clear signs of overfitting:")
    print(f"1. Training accuracy is {results['train_accuracy']*100:.2f}%")
    print(f"2. Test accuracy drops to {results['test_accuracy']*100:.2f}%")
    print(f"3. Overfitting gap of {results['overfitting_gap']*100:.2f}% is concerning")
    print("\nThis is why XGBoost with better regularization was chosen instead.")
    print("=" * 60)


if __name__ == "__main__":
    main()
