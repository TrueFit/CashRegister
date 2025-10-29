from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Cash Register System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    DATABASE_URL: Optional[str] = None
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "cashregister_db"
    DATABASE_USER: str = "cashregister_user"
    DATABASE_PASSWORD: str = "cashregister_pass"

    CHANGE_DIVISIBILITY_RULE: int = 3
    DEFAULT_COUNTRY_CODE: str = "USA"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
