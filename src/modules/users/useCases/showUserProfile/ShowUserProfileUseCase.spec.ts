import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUser: CreateUserUseCase;
let userProfile: ShowUserProfileUseCase;
let userRepository: IUsersRepository;

describe('Show User Profile Use Case Unit Test', () => {
    userRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(userRepository);
    userProfile = new ShowUserProfileUseCase(userRepository)
    
    const user: ICreateUserDTO = {name: 'testUser', email: 'testuser@test.com', password:'test1234'}
    
    it('Should be able to show user profile', async () => {
        const createdUser = await createUser.execute(user)
        const id = String(createdUser.id)
        const profile = await userProfile.execute(id)
        expect(profile).toMatchObject(createdUser)
    })

    it('Should not be able to show profile of a non-existing user', async () => {
        expect(async () => {
            const profile = await userProfile.execute('asdsadadasdsa')
        })
        .rejects.toBeInstanceOf(AppError)
    })
})
