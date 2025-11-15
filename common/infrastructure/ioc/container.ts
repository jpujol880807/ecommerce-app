import {Container} from 'inversify';
import {TYPES} from '~~/common/infrastructure/ioc/types';
import {SqliteUsersRepository} from '~~/auth/infrastructure/repository/SqliteUsersRepository';
import {UsersRepository} from '~~/auth/domain/users/repository/UsersRepository';
import {CreateUserUseCase} from '~~/auth/application/users/use-cases/CreateUserUseCase';
import {LoginUserUseCase} from '~~/auth/application/users/use-cases/LoginUserUseCase';

const container = new Container({defaultScope: 'Singleton'});

container.bind<UsersRepository>(TYPES.UsersRepository).to(SqliteUsersRepository);
container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind<LoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserUseCase);
export default container;
