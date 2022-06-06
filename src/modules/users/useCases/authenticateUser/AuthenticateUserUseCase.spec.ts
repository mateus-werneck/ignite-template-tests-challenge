import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUser: CreateUserUseCase;
let authenticateUser: AuthenticateUserUseCase;
let userRepository: IUsersRepository;

describe('Authenticate User Use Case Unit Test', () => {
    userRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(userRepository);
    authenticateUser = new AuthenticateUserUseCase(userRepository)
    
    const user = {name: 'testUser', email: 'testuser@test.com', password:'test1234'}
    
    it('Should be able to authenticate a user', async () => {
        await createUser.execute(user)
        const token = await authenticateUser.execute({email: user.email, password: user.password})
        expect(token).toHaveProperty('token')
    })

    it('Should not be able to authenticate a non-existing user', async () => {
        expect(async () => {
            const token = await authenticateUser.execute({email: '', password: ''})
        })
        .rejects.toBeInstanceOf(AppError)
    });

    it('Should not be able to authenticate a user with incorrect password', async () => {
        expect(async () => {
          const token = await authenticateUser.execute({
            email: user.email,
            password: ''
          });
        }).rejects.toBeInstanceOf(AppError);
      });
})
