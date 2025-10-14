"""
K-Means Clustering - Unsupervised Learning Approach

This script implements K-Means clustering to demonstrate an unsupervised approach
to network log classification. It shows how the algorithm performs without labeled
training data and why supervised methods are superior when labels are available.
"""

import json
import numpy as np
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, silhouette_score
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

class KMeansNetworkClassifier:
    def __init__(self, n_clusters=3):
        """
        Initialize K-Means clustering classifier
        
        Args:
            n_clusters: Number of clusters (we expect 3: job_hunting, normal, suspicious)
        """
        self.model = KMeans(
            n_clusters=n_clusters,
            random_state=42,
            n_init=10,
            max_iter=300
        )
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.label_mapping = {
            'job_hunting': 0,
            'normal': 1,
            'suspicious': 2
        }
        self.cluster_to_label = {}  # Will be determined after clustering
        
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
    
    def map_clusters_to_labels(self, clusters, true_labels):
        """
        Map cluster IDs to actual labels based on majority voting
        """
        cluster_label_counts = {}
        
        for cluster_id in range(self.model.n_clusters):
            cluster_label_counts[cluster_id] = {}
            
            # Count true labels for each cluster
            mask = clusters == cluster_id
            labels_in_cluster = np.array(true_labels)[mask]
            
            for label in labels_in_cluster:
                cluster_label_counts[cluster_id][label] = cluster_label_counts[cluster_id].get(label, 0) + 1
        
        # Assign most common label to each cluster
        for cluster_id in range(self.model.n_clusters):
            if cluster_label_counts[cluster_id]:
                most_common_label = max(cluster_label_counts[cluster_id].items(), key=lambda x: x[1])[0]
                self.cluster_to_label[cluster_id] = most_common_label
            else:
                self.cluster_to_label[cluster_id] = 0  # Default
        
        return self.cluster_to_label
    
    def train(self, urls, labels):
        """Train the K-Means clustering model"""
        print("=" * 60)
        print("K-MEANS CLUSTERING - UNSUPERVISED LEARNING")
        print("=" * 60)
        
        # Split data (we still need labels to evaluate performance)
        X_train, X_test, y_train, y_test = train_test_split(
            urls, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        # Vectorize
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print(f"\n📊 Dataset Split:")
        print(f"   Training samples: {len(X_train)}")
        print(f"   Test samples: {len(X_test)}")
        
        # Train model (unsupervised - doesn't use y_train during clustering)
        print(f"\n🔄 Clustering with K-Means...")
        print(f"   Parameters: n_clusters={self.model.n_clusters}")
        print(f"   Note: Algorithm doesn't see labels during training!")
        
        self.model.fit(X_train_vec)
        
        # Get cluster assignments
        train_clusters = self.model.predict(X_train_vec)
        test_clusters = self.model.predict(X_test_vec)
        
        # Map clusters to labels using training data
        print(f"\n🗺️  Mapping clusters to labels (post-hoc)...")
        cluster_mapping = self.map_clusters_to_labels(train_clusters, y_train)
        
        print(f"   Cluster Mapping:")
        reverse_label_mapping = {v: k for k, v in self.label_mapping.items()}
        for cluster_id, label in cluster_mapping.items():
            print(f"      Cluster {cluster_id} → {reverse_label_mapping[label]}")
        
        # Convert cluster predictions to label predictions
        train_pred = np.array([self.cluster_to_label[c] for c in train_clusters])
        test_pred = np.array([self.cluster_to_label[c] for c in test_clusters])
        
        # Evaluate performance
        train_accuracy = accuracy_score(y_train, train_pred)
        test_accuracy = accuracy_score(y_test, test_pred)
        overfitting_gap = train_accuracy - test_accuracy
        
        # Calculate silhouette score (clustering quality metric)
        silhouette_train = silhouette_score(X_train_vec, train_clusters)
        silhouette_test = silhouette_score(X_test_vec, test_clusters)
        
        print("\n" + "=" * 60)
        print("📊 UNSUPERVISED LEARNING PERFORMANCE")
        print("=" * 60)
        print(f"Training Accuracy: {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
        print(f"Test Accuracy:     {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
        print(f"Overfitting Gap:   {overfitting_gap:.4f} ({overfitting_gap*100:.2f}%)")
        print(f"\n🎯 Clustering Quality Metrics:")
        print(f"   Silhouette Score (Train): {silhouette_train:.4f}")
        print(f"   Silhouette Score (Test):  {silhouette_test:.4f}")
        print(f"   (Range: -1 to 1, higher is better)")
        
        if test_accuracy < 0.7:
            print("\n⚠️  LOW ACCURACY WARNING!")
            print("   Unsupervised learning struggles without labeled data.")
            print("   K-Means may group URLs in unexpected ways.")
            print("   Supervised methods (XGBoost) are significantly better.")
        
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
        
        # Cluster centers analysis
        print("\n🎯 Cluster Centers Analysis:")
        feature_names = self.vectorizer.get_feature_names_out()
        
        for cluster_id in range(self.model.n_clusters):
            center = self.model.cluster_centers_[cluster_id]
            top_features_idx = np.argsort(center)[::-1][:5]
            
            print(f"\n   Cluster {cluster_id} ({reverse_label_mapping[self.cluster_to_label[cluster_id]]}):")
            print(f"   Top features: ", end="")
            print(", ".join([feature_names[idx] for idx in top_features_idx]))
        
        return {
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy,
            'overfitting_gap': overfitting_gap,
            'silhouette_train': silhouette_train,
            'silhouette_test': silhouette_test
        }
    
    def predict(self, url):
        """Predict category for a single URL"""
        url_vec = self.vectorizer.transform([url])
        cluster = self.model.predict(url_vec)[0]
        predicted_label = self.cluster_to_label.get(cluster, 0)
        
        reverse_mapping = {v: k for k, v in self.label_mapping.items()}
        
        # Calculate distance to each cluster center for confidence
        distances = self.model.transform(url_vec)[0]
        confidences = 1 / (1 + distances)  # Convert distance to confidence-like score
        confidences = confidences / confidences.sum()  # Normalize
        
        return {
            'category': reverse_mapping[predicted_label],
            'cluster': int(cluster),
            'confidence_scores': {
                reverse_mapping[self.cluster_to_label[i]]: float(confidences[i])
                for i in range(len(confidences))
            }
        }


def main():
    """Main execution function"""
    classifier = KMeansNetworkClassifier()
    
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
        print(f"Assigned Cluster: {result['cluster']}")
        print(f"Predicted Category: {result['category']}")
        print(f"Confidence Scores: {result['confidence_scores']}")
    
    # Final conclusion
    print("\n" + "=" * 60)
    print("💡 UNSUPERVISED LEARNING INSIGHTS")
    print("=" * 60)
    print("K-Means clustering demonstrates unsupervised approach:")
    print(f"1. Test accuracy: {results['test_accuracy']*100:.2f}%")
    print(f"2. Silhouette score: {results['silhouette_test']:.4f}")
    print("3. No labeled training data required during clustering")
    print("4. Post-hoc label mapping needed for evaluation")
    print("\n⚠️  Limitations:")
    print("   - Significantly lower accuracy than supervised methods")
    print("   - Cluster assignments may not match semantic categories")
    print("   - Requires domain knowledge for cluster interpretation")
    print("\n✅ When labels are available, supervised methods (XGBoost)")
    print("   significantly outperform unsupervised approaches.")
    print("=" * 60)


if __name__ == "__main__":
    main()
