import pytest
import uuid
from unittest.mock import Mock, AsyncMock
from src.admin.services import AdminService
from src.admin.exceptions import NotFoundException, BanException
from src.users.schemas import ResponseUserDTO


pytestmark = pytest.mark.anyio


@pytest.fixture
def mock_admin_repo():
    """Mock AdminRepository for testing"""
    return Mock()


@pytest.fixture
def admin_service(mock_admin_repo):
    """Create AdminService instance with mocked repository"""
    return AdminService(admin_repo=mock_admin_repo)


@pytest.fixture
def sample_user():
    """Sample user data for testing"""
    return ResponseUserDTO(
        id=uuid.uuid4(), email="test@example.com", role="user", username="testuser"
    )


@pytest.fixture
def sample_users():
    """Sample list of users for testing"""
    return [
        ResponseUserDTO(
            id=uuid.uuid4(),
            email=f"user{i}@example.com",
            role="user",
            username=f"user{i}",
        )
        for i in range(1, 4)
    ]


class TestGetUsers:
    """Tests for get_users endpoint"""

    async def test_get_users_success(
        self, admin_service, mock_admin_repo, sample_users
    ):
        """Test successful retrieval of users with default pagination"""
        mock_admin_repo.get_all = AsyncMock(return_value=sample_users)

        result = await admin_service.get_users(skip=0, limit=5)

        assert result == sample_users
        assert len(result) == 3
        mock_admin_repo.get_all.assert_called_once_with(skip=0, limit=5)

    async def test_get_users_with_custom_pagination(
        self, admin_service, mock_admin_repo, sample_users
    ):
        """Test get_users with custom skip and limit parameters"""
        mock_admin_repo.get_all = AsyncMock(return_value=sample_users[1:])

        result = await admin_service.get_users(skip=10, limit=20)

        assert result == sample_users[1:]
        mock_admin_repo.get_all.assert_called_once_with(skip=10, limit=20)

    async def test_get_users_not_found(self, admin_service, mock_admin_repo):
        """Test get_users when no users are found"""
        mock_admin_repo.get_all = AsyncMock(return_value=None)

        with pytest.raises(NotFoundException, match="Users not found"):
            await admin_service.get_users(skip=0, limit=5)

    async def test_get_users_empty_list(self, admin_service, mock_admin_repo):
        """Test get_users when empty list is returned"""
        mock_admin_repo.get_all = AsyncMock(return_value=[])

        with pytest.raises(NotFoundException, match="Users not found"):
            await admin_service.get_users(skip=0, limit=5)


class TestGetUserById:
    """Tests for get_user_by_id endpoint"""

    async def test_get_user_by_id_success(
        self, admin_service, mock_admin_repo, sample_user
    ):
        """Test successful retrieval of user by ID"""
        user_id = sample_user.id
        mock_admin_repo.get_by_id = AsyncMock(return_value=sample_user)

        result = await admin_service.get_user(user_id=user_id)

        assert result == sample_user
        assert result.id == user_id
        mock_admin_repo.get_by_id.assert_called_once_with(user_id=user_id)

    async def test_get_user_by_id_not_found(self, admin_service, mock_admin_repo):
        """Test get_user when user ID does not exist"""
        user_id = uuid.uuid4()
        mock_admin_repo.get_by_id = AsyncMock(return_value=None)

        with pytest.raises(
            NotFoundException, match=f"User with id: {user_id} not found"
        ):
            await admin_service.get_user(user_id=user_id)

        mock_admin_repo.get_by_id.assert_called_once_with(user_id=user_id)

    async def test_get_user_by_id_with_different_roles(
        self, admin_service, mock_admin_repo
    ):
        """Test get_user returns users with different roles"""
        for role in ["user", "admin", "moderator"]:
            user = ResponseUserDTO(
                id=uuid.uuid4(), email=f"{role}@example.com", role=role, username=role
            )
            mock_admin_repo.get_by_id = AsyncMock(return_value=user)

            result = await admin_service.get_user(user_id=user.id)

            assert result.role == role


class TestBanUser:
    """Tests for ban_user endpoint"""

    async def test_ban_user_success(self, admin_service, mock_admin_repo, sample_user):
        """Test successful user ban"""
        user_id = sample_user.id
        mock_admin_repo.get_by_id = AsyncMock(return_value=sample_user)
        mock_admin_repo.ban_user = AsyncMock(return_value=sample_user)

        result = await admin_service.ban_user(user_id=user_id)

        assert result == sample_user
        mock_admin_repo.get_by_id.assert_called_once_with(user_id=user_id)
        mock_admin_repo.ban_user.assert_called_once_with(user_id=user_id)

    async def test_ban_user_not_found(self, admin_service, mock_admin_repo):
        """Test ban_user when user does not exist"""
        user_id = uuid.uuid4()
        mock_admin_repo.get_by_id = AsyncMock(return_value=None)

        with pytest.raises(
            NotFoundException, match=f"User with id: {user_id} not found"
        ):
            await admin_service.ban_user(user_id=user_id)

        mock_admin_repo.ban_user.assert_not_called()

    async def test_ban_user_repository_called_after_validation(
        self, admin_service, mock_admin_repo, sample_user
    ):
        """Test that ban_user only calls repository after validating user exists"""
        user_id = sample_user.id
        mock_admin_repo.get_by_id = AsyncMock(return_value=sample_user)
        mock_admin_repo.ban_user = AsyncMock(return_value=sample_user)

        await admin_service.ban_user(user_id=user_id)

        call_order = mock_admin_repo.method_calls
        assert call_order[0][0] == "get_by_id"
        assert call_order[1][0] == "ban_user"


class TestUnbanUser:
    """Tests for unban_user endpoint"""

    async def test_unban_user_success(
        self, admin_service, mock_admin_repo, sample_user
    ):
        """Test successful user unban"""
        user_id = sample_user.id
        mock_admin_repo.get_by_id = AsyncMock(return_value=sample_user)
        mock_admin_repo.unban_user = AsyncMock(return_value=sample_user)

        result = await admin_service.unban_user(user_id=user_id)

        assert result == sample_user
        mock_admin_repo.get_by_id.assert_called_once_with(user_id=user_id)
        mock_admin_repo.unban_user.assert_called_once_with(user_id=user_id)

    async def test_unban_user_not_found(self, admin_service, mock_admin_repo):
        """Test unban_user when user does not exist"""
        user_id = uuid.uuid4()
        mock_admin_repo.get_by_id = AsyncMock(return_value=None)

        with pytest.raises(
            NotFoundException, match=f"User with id: {user_id} not found"
        ):
            await admin_service.unban_user(user_id=user_id)

        mock_admin_repo.unban_user.assert_not_called()


class TestGetBannedUsers:
    """Tests for get_banned_users endpoint"""

    async def test_get_banned_users_success(
        self, admin_service, mock_admin_repo, sample_users
    ):
        """Test successful retrieval of banned users"""
        mock_admin_repo.get_banned_users = AsyncMock(return_value=sample_users)

        result = await admin_service.get_all_banned_users(skip=0, limit=5)

        assert result == sample_users
        mock_admin_repo.get_banned_users.assert_called_once_with(skip=0, limit=5)

    async def test_get_banned_users_empty(self, admin_service, mock_admin_repo):
        """Test get_banned_users when no banned users exist"""
        mock_admin_repo.get_banned_users = AsyncMock(return_value=[])

        result = await admin_service.get_all_banned_users(skip=0, limit=5)

        assert result == []

    async def test_get_banned_users_with_pagination(
        self, admin_service, mock_admin_repo, sample_users
    ):
        """Test get_banned_users with custom pagination"""
        mock_admin_repo.get_banned_users = AsyncMock(return_value=sample_users[:2])

        result = await admin_service.get_all_banned_users(skip=5, limit=2)

        assert len(result) == 2
        mock_admin_repo.get_banned_users.assert_called_once_with(skip=5, limit=2)


class TestGetBannedUser:
    """Tests for get_banned_user endpoint"""

    async def test_get_banned_user_success(
        self, admin_service, mock_admin_repo, sample_user
    ):
        """Test successful retrieval of specific banned user"""
        user_id = sample_user.id
        mock_admin_repo.get_banned_user = AsyncMock(return_value=sample_user)

        result = await admin_service.get_banned_user(user_id=user_id)

        assert result == sample_user
        mock_admin_repo.get_banned_user.assert_called_once_with(user_id=user_id)

    async def test_get_banned_user_not_found(self, admin_service, mock_admin_repo):
        """Test get_banned_user when user is not banned or doesn't exist"""
        user_id = uuid.uuid4()
        mock_admin_repo.get_banned_user = AsyncMock(return_value=None)

        with pytest.raises(BanException, match="Users not found"):
            await admin_service.get_banned_user(user_id=user_id)


class TestBanUserByEmail:
    """Tests for ban_user_by_email endpoint"""

    async def test_ban_user_by_email_success(
        self, admin_service, mock_admin_repo, sample_user
    ):
        """Test successful user ban by email"""
        email = sample_user.email
        mock_admin_repo.ban_user_by_email = AsyncMock(return_value=sample_user)

        result = await admin_service.ban_user_by_email(email=email)

        assert result == sample_user
        mock_admin_repo.ban_user_by_email.assert_called_once_with(email=email)

    async def test_ban_user_by_email_not_found(self, admin_service, mock_admin_repo):
        """Test ban_user_by_email when user does not exist"""
        email = "nonexistent@example.com"
        mock_admin_repo.ban_user_by_email = AsyncMock(return_value=None)

        with pytest.raises(BanException, match="Users not found"):
            await admin_service.ban_user_by_email(email=email)

    async def test_ban_user_by_email_with_valid_email(
        self, admin_service, mock_admin_repo, sample_user
    ):
        """Test ban_user_by_email with various valid email formats"""
        emails = ["user@example.com", "test.user@example.co.uk", "user+tag@example.com"]

        for email in emails:
            user = ResponseUserDTO(
                id=uuid.uuid4(), email=email, role="user", username="testuser"
            )
            mock_admin_repo.ban_user_by_email = AsyncMock(return_value=user)

            result = await admin_service.ban_user_by_email(email=email)

            assert result.email == email
