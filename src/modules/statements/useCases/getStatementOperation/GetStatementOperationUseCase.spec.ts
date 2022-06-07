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
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUser: CreateUserUseCase;
let getStatement: GetStatementOperationUseCase;
let createStatement: CreateStatementUseCase
let userRepository: IUsersRepository;
let statementRepository: IStatementsRepository
let createdUser: User

describe('Create Statement Use Case Unit Test', () => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createUser = new CreateUserUseCase(userRepository);
    getStatement = new GetStatementOperationUseCase(userRepository, statementRepository);
    createStatement = new CreateStatementUseCase(userRepository, statementRepository);
    const user: ICreateUserDTO = {name: 'testUser', email: 'testuser@test.com', password:'test1234'}

    beforeAll(async () => {
        createdUser = await createUser.execute(user)
    })
    
    it('Should be able to get a deposit statement for a existing user', async () => {
        const createdStatement = await createStatement.execute({user_id: createdUser.id, type: 'deposit', amount: 10, description: 'Novo Deposito'} as ICreateStatementDTO)
        const userId = String(createdUser.id)
        const statementId = String(createdStatement.id)
        const statement = await getStatement.execute({user_id: userId, statement_id: statementId})
        expect(statement).toMatchObject(createdStatement)
        expect(statement.type).toBe('deposit')
    })

    it('Should be able to get a withdraw statement for a existing user', async () => {
        const createdStatement = await createStatement.execute({user_id: createdUser.id, type: 'withdraw', amount: 10, description: 'Nova Retirada'} as ICreateStatementDTO)
        const userId = String(createdUser.id)
        const statementId = String(createdStatement.id)
        const statement = await getStatement.execute({user_id: userId, statement_id: statementId})
        expect(statement).toMatchObject(createdStatement)
        expect(statement.type).toBe('withdraw')
    })

    it('Should not be able to get statement for non-existing user', async () => {
        expect(async () => {
            const statement = await getStatement.execute({user_id: '', statement_id: ''})
        })
        .rejects.toBeInstanceOf(AppError)
    })

    it('Should not be able to get statement for non-existing statement', async () => {
        expect(async () => {
            const userId = String(createdUser.id)
            const statement = await getStatement.execute({user_id: userId, statement_id: ''})
        })
        .rejects.toBeInstanceOf(AppError)
    })
})
