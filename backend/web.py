from app import create_app
from dotenv import load_dotenv
import os
from waitress import serve

if __name__ == "__main__":
    load_dotenv("settings.env")
    app = create_app()

    mode = os.getenv("MODE", "LOCAL")
    host = os.getenv("HOST", "127.0.0.1")
    port = os.getenv("PORT", 5000)

    print(f"Running in {mode} mode on {host}:{port}")
    if mode == "PRODUCTION":
        serve(app, host=host, port=port)
    else:
        app.run(
            host=host,
            port=port,
            debug=True,
        )
