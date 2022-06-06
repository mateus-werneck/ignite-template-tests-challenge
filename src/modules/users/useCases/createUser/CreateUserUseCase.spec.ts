import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUser: CreateUserUseCase;
let userRepository: IUsersRepository;

describe('Create User Use Case Unit Test', () => {
    userRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(userRepository);
    const user: ICreateUserDTO = {name: 'testUser', email: 'testuser@test.com', password:'test1234'}
    
    it('Should be able to create a new user', async () => {
        const createdUser = await createUser.execute(user)
        expect(createdUser).toHaveProperty('id')
    })

    it('Should not be able to create a new user if email is already in-use', async () => {
        expect(async () => {
             await createUser.execute(user)
        })
        .rejects.toBeInstanceOf(AppError)
    })
})
