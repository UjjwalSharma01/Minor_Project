"""
Shared utility functions for all comparison models
"""

import json

def load_domain_categories(filepath='../Python Code/domain_categories.json'):
    """
    Load domain categories from JSON file
    Returns urls (domains) and their corresponding labels
    """
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    # Convert to lists
    urls = list(data.keys())
    labels_str = list(data.values())
    
    # Map string labels to integers
    unique_labels = sorted(set(labels_str))
    label_to_int = {label: idx for idx, label in enumerate(unique_labels)}
    labels = [label_to_int[label] for label in labels_str]
    
    return urls, labels, label_to_int, unique_labels

def get_label_name(label_int, unique_labels):
    """Convert integer label back to string name"""
    return unique_labels[label_int]
