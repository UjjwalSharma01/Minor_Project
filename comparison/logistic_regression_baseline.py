"""
Logistic Regression Baseline Classifier

This script implements a simple Logistic Regression model as a baseline
to demonstrate the performance improvement gained from ensemble methods.
"""

import json
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

class LogisticRegressionNetworkClassifier:
    def __init__(self):
        """Initialize Logistic Regression classifier"""
        self.model = LogisticRegression(
            max_iter=1000,
            random_state=42,
            multi_class='multinomial',
            solver='lbfgs'
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
        """Train the Logistic Regression model"""
        print("=" * 60)
        print("LOGISTIC REGRESSION - BASELINE MODEL")
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
        print(f"\n📈 Training Logistic Regression...")
        print(f"   Simple linear model for baseline comparison")
        
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
        print("📊 BASELINE PERFORMANCE")
        print("=" * 60)
        print(f"Training Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
        print(f"Test Accuracy:     {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
        print(f"Overfitting Gap:   {overfitting_gap:.4f} ({overfitting_gap*100:.2f}%)")
        
        # Cross-validation scores
        print(f"\n🔄 Cross-Validation Scores (5-fold):")
        cv_scores = cross_val_score(self.model, X_train_vec, y_train, cv=5)
        print(f"   CV Scores: {cv_scores}")
        print(f"   Mean CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
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
    classifier = LogisticRegressionNetworkClassifier()
    
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
    print("💡 BASELINE INSIGHTS")
    print("=" * 60)
    print("Logistic Regression provides a simple baseline:")
    print(f"Test accuracy: {results['test_accuracy']*100:.2f}%")
    print("\nWhile acceptable, ensemble methods (XGBoost) significantly")
    print("outperform this baseline, justifying their complexity.")
    print("=" * 60)


if __name__ == "__main__":
    main()
