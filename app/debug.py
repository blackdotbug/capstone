import requests

def memory_test(endpoint):

    # Warm up, so you don't measure flask internal memory usage
    for _ in range(10):
        requests.get(f'http://127.0.0.1:5000/{endpoint}')

    # Memory usage before API calls
    resp = requests.get('http://127.0.0.1:5000/memory')
    print(f'Memory before API call {int(resp.json().get("memory"))}')

    # Take first memory usage snapshot
    resp = requests.get('http://127.0.0.1:5000/snapshot')

    # Start some API Calls
    for _ in range(10):
        requests.get(f'http://127.0.0.1:5000/{endpoint}')

    # Memory usage after
    resp = requests.get('http://127.0.0.1:5000/memory')
    print(f'Memory after API call: {int(resp.json().get("memory"))}')

    # Take 2nd snapshot and print result
    resp = requests.get('http://127.0.0.1:5000/snapshot')
    print(resp.text)
