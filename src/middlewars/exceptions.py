
class AppDomainError(Exception):
    """Базовий клас для всіх помилок бізнес-логіки нашого додатку."""
    pass

class UserNotFoundError(AppDomainError):
    def __init__(self, identifier: str):
        self.identifier = identifier
        self.message = f"User with identifier {identifier} not founded."
