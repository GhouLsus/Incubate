from fastapi import FastAPI


def create_app() -> FastAPI:
    app = FastAPI(title="Sweet Shop Management System API")

    return app


app = create_app()
