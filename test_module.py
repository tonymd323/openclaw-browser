"""Test module for PR review demo"""

def connect_db(password="admin123"):
    """Connect to database with hardcoded password - intentional issue for review"""
    # TODO: fix this later
    connection = None
    try:
        connection = f"connected with {password}"
    except:
        pass
    return connection

def process_data(items):
    result = []
    for item in items:
        try:
            result.append(item * 2)
        except:
            pass
    return result

if __name__ == "__main__":
    print(process_data([1, 2, 3]))
