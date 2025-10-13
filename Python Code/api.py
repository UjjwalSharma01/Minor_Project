""""""

Simple Flask API for Network Behavior ClassificationSuper Simple API - Upload logs, get results

Uses the same data preprocessing as csv_to_json_converter.py"""

"""

from flask import Flask, request, jsonify

from flask import Flask, request, jsonifyfrom flask_cors import CORS

from flask_cors import CORSimport main

import mainimport json

import jsonimport os

import hashlib

import numpy as npapp = Flask(__name__)

CORS(app)

app = Flask(__name__)

CORS(app)# Initialize parser with proper model loading

print("🔄 Loading ML model...")

# Initialize parser with proper model loadingparser = main.NetworkBehaviorParser(

print("🔄 Loading ML model...")    network_logs_file='networkLogs.json',

parser = main.NetworkBehaviorParser(    domain_categories_file='domain_categories.json',

    network_logs_file='networkLogs.json',    training_data_file='training_data.json'

    domain_categories_file='domain_categories.json',)

    training_data_file='training_data.json'parser.initialize()  # This loads the trained XGBoost model!

)print("✅ Model loaded successfully!")

parser.initialize()

print("✅ Model loaded successfully!")@app.route('/analyze', methods=['POST'])

def analyze():

def sanitize_logs(logs):    """Upload logs, get JSON result"""

    """    try:

    Sanitize and validate incoming log data        # Parse incoming JSON

    Same preprocessing as csv_to_json_converter.py        data = request.get_json(force=True)

    """        

    sanitized = []        # Handle both {"logs": [...]} and direct [...]

            if isinstance(data, dict) and 'logs' in data:

    # Generate anonymous user ID from first client_ip            logs = data['logs']

    user_id = "api_user"        elif isinstance(data, list):

    if logs and len(logs) > 0:            logs = data

        first_ip = logs[0].get('client_ip', 'unknown')        else:

        user_id = hashlib.md5(str(first_ip).encode()).hexdigest()[:8]            return jsonify({

                    'error': 'Invalid format. Send {"logs": [...]} or [...]'

    for log in logs:            }), 400

        # Ensure required fields exist with defaults        

        sanitized_log = {        if not logs or len(logs) == 0:

            "timestamp": log.get('timestamp', ''),            return jsonify({'error': 'No logs provided'}), 400

            "domain": log.get('domain', ''),        

            "query_type": log.get('query_type', 'A'),        print(f"📊 Analyzing {len(logs)} network logs...")

            "client_ip": user_id,  # Anonymized        

            "status": log.get('status', 'NOERROR'),        # Use the trained XGBoost model to analyze

            "reasons": log.get('reasons', ''),        result = parser.analyze_logs(logs)

            "user_id": user_id        

        }        print(f"✅ Classification: {result['behavior']} ({result['confidence']:.1f}% confidence)")

                

        # Only include logs with valid domain and timestamp        # Return result

        if sanitized_log['domain'] and sanitized_log['timestamp']:        return jsonify(result)

            sanitized.append(sanitized_log)        

        except Exception as e:

    return sanitized        import traceback

        error_trace = traceback.format_exc()

def convert_numpy_to_python(obj):        print(f"❌ ERROR: {error_trace}")

    """        return jsonify({

    Convert numpy types to native Python types for JSON serialization            'error': str(e),

    """            'details': error_trace

    if isinstance(obj, dict):        }), 500

        return {k: convert_numpy_to_python(v) for k, v in obj.items()}

    elif isinstance(obj, list):if __name__ == '__main__':

        return [convert_numpy_to_python(item) for item in obj]    print("\n🚀 API running at: http://localhost:5000/analyze")

    elif isinstance(obj, np.integer):    print("📤 POST your logs as JSON")

        return int(obj)    print("📥 Get behavior analysis result\n")

    elif isinstance(obj, np.floating):    app.run(host='0.0.0.0', port=5000, debug=False)

        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif hasattr(obj, 'item'):  # numpy scalar
        return obj.item()
    else:
        return obj

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyze network logs
    Accepts: {"logs": [...]} or just [...]
    Returns: Complete behavior analysis JSON
    """
    try:
        # Parse incoming JSON
        data = request.get_json(force=True)
        
        # Handle both formats
        if isinstance(data, dict) and 'logs' in data:
            raw_logs = data['logs']
        elif isinstance(data, list):
            raw_logs = data
        else:
            return jsonify({
                'error': 'Invalid format',
                'expected': '{"logs": [...]} or [...]'
            }), 400
        
        if not raw_logs or len(raw_logs) == 0:
            return jsonify({'error': 'No logs provided'}), 400
        
        print(f"📥 Received {len(raw_logs)} logs")
        
        # Sanitize and validate logs (same as csv_to_json_converter.py)
        sanitized_logs = sanitize_logs(raw_logs)
        print(f"✅ Sanitized {len(sanitized_logs)} valid logs")
        
        if len(sanitized_logs) == 0:
            return jsonify({
                'error': 'No valid logs after sanitization',
                'hint': 'Ensure logs have "domain" and "timestamp" fields'
            }), 400
        
        # Analyze using the trained XGBoost model
        result = parser.analyze_logs(sanitized_logs)
        
        # Convert numpy types to Python types for JSON
        result = convert_numpy_to_python(result)
        
        print(f"✅ Result: {result['behavior']} @ {result['confidence']:.1f}% confidence")
        
        return jsonify(result)
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"❌ ERROR: {error_trace}")
        return jsonify({
            'error': str(e),
            'type': type(e).__name__
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'domains': 726,
        'accuracy': '97.7%'
    })

@app.route('/', methods=['GET'])
def home():
    """API information"""
    return jsonify({
        'name': 'Network Behavior Analyzer API',
        'version': '1.0',
        'endpoints': {
            '/': 'API info',
            '/health': 'Health check',
            '/analyze': 'POST - Analyze network logs'
        },
        'model': {
            'algorithm': 'XGBoost',
            'accuracy': '97.7%',
            'domains': 726
        }
    })

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 Network Behavior Analyzer API")
    print("=" * 60)
    print(f"📡 Running at: http://localhost:5000")
    print(f"📍 Endpoint: POST /analyze")
    print(f"✅ Model: XGBoost (97.7% accuracy, 726 domains)")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
