from app import app
from config import PROD, PORT


def run_api():
    if PROD:
        app.run(host='0.0.0.0', port=PORT, debug=False)
    else:
        app.run(host='0.0.0.0', port=PORT, debug=True)


if __name__ == '__main__':
    run_api()
