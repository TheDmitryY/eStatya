import pytest
from src.posts.services import PostsService
from unittest.mock import Mock, AsyncMock

pytestmark = pytest.mark.anyio

@pytest.fixture
def mock_posts_repo():
    return Mock()

@pytest.fixture
def posts_service():
    return PostsService(post_repo=mock_posts_repo)