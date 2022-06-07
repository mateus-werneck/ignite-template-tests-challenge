import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUser: CreateUserUseCase;
let getBalance: GetBalanceUseCase;
let createStatement: CreateStatementUseCase
let userRepository: IUsersRepository;
let statementRepository: IStatementsRepository
let createdUser: User

describe('Create Statement Use Case Unit Test', () => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createUser = new CreateUserUseCase(userRepository);
    getBalance = new GetBalanceUseCase(statementRepository, userRepository);
    createStatement = new CreateStatementUseCase(userRepository, statementRepository);
    const user: ICreateUserDTO = {name: 'testUser', email: 'testuser@test.com', password:'test1234'}

    beforeAll(async () => {
        createdUser = await createUser.execute(user)
    })
    
    it('Should be able to list empty balance for a existing user', async () => {
        const userId = String(createdUser.id)
        const balance = await getBalance.execute({user_id: userId})
        expect(balance).toHaveProperty('statement')
        expect(balance.statement).toHaveLength(0)
    })

    it('Should be able to list balance with one statement for a existing user', async () => {
        await createStatement.execute({user_id: createdUser.id, type: 'deposit', amount: 10, description: 'Nova Retirada'} as ICreateStatementDTO)
        const userId = String(createdUser.id)
        const balance = await getBalance.execute({user_id: userId})
        expect(balance).toHaveProperty('statement')
        expect(balance.statement).toHaveLength(1)
    })

    it('Should not be able to get balance for non-existing user', async () => {
        expect(async () => {
            const balance = await getBalance.execute({user_id: ''})
        })
        .rejects.toBeInstanceOf(AppError)
    })
})
