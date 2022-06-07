import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createUser: CreateUserUseCase;
let createStatement: CreateStatementUseCase;
let userRepository: IUsersRepository;
let statementRepository: IStatementsRepository
let createdUser: User

describe('Create Statement Use Case Unit Test', () => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createUser = new CreateUserUseCase(userRepository);
    createStatement = new CreateStatementUseCase(userRepository, statementRepository);
    const user: ICreateUserDTO = {name: 'testUser', email: 'testuser@test.com', password:'test1234'}

    beforeAll(async () => {
        createdUser = await createUser.execute(user)
    })
    
    it('Should be able to create a deposit for a existing user', async () => {
        const createdStatement = await createStatement.execute({user_id: createdUser.id, type: 'deposit', amount: 10, description: 'Novo Deposito'} as ICreateStatementDTO)
        expect(createdStatement).toHaveProperty('id')
    })

    it('Should be able to create a withdraw for a existing user', async () => {
        const createdStatement = await createStatement.execute({user_id: createdUser.id, type: 'withdraw', amount: 10, description: 'Nova Retirada'} as ICreateStatementDTO)
        expect(createdStatement).toHaveProperty('id')
    })

    it('Should not be able to create a statement for non-existing user', async () => {
        expect(async () => {
            const createdStatement = await createStatement.execute({user_id: '', type: 'withdraw', amount: 10, description: 'Novo Deposito'} as ICreateStatementDTO)
        })
        .rejects.toBeInstanceOf(AppError)
    })

    it('Should not be able to create a withdraw if amount is greater than balance', async () => {
        expect(async () => {
            const createdStatement = await createStatement.execute({user_id: createdUser.id, type: 'withdraw', amount: 1000000000, description: 'Nova Retirada'} as ICreateStatementDTO)
        })
        .rejects.toBeInstanceOf(AppError)
    })
})
