class BusinessRuleException(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

# class UserNotActiveException(BusinessRuleException):
#     pass

# class UserNotVerifiedException(BusinessRuleException):
#     pass

# class UserNotSuperUserException(BusinessRuleException):
#     pass

class InvalidRefreshTokenException(BusinessRuleException):
    pass

class InvalidTokenException(BusinessRuleException):
    pass

# class ExpiredTokenException(BusinessRuleException):
#     pass

# class EmailException(BusinessRuleException):
#     pass