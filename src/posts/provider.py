from dishka import Provider, Scope, provide
from sqlalchemy.ext.asyncio import AsyncSession
from src.posts.repository import PostsRepository, PosgresPostsRepository
from src.posts.services import PostsService

class PostsProvider(Provider):
    @provide(scope=Scope.REQUEST)
    def get_repo(self, session: AsyncSession) -> PostsRepository:
        return PosgresPostsRepository(session)

    @provide(scope=Scope.REQUEST)
    def get_post_service(
        self,
        post_repo: PostsRepository,
    ) -> PostsService:
        return PostsService(
            post_repo=post_repo
        )