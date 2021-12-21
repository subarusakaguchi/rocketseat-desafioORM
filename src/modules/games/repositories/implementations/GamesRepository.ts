import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const lowerString = param.toLowerCase()
    const games = await this.repository.createQueryBuilder("games")
                            .where("games.title ILIKE :param", {param: `%${lowerString}%`})
                            .getMany()

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(*) FROM games`);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
                          .createQueryBuilder('games')
                          .leftJoinAndSelect('games.users', 'users')
                          .where('games.id = :id', { id })
                          .getOneOrFail()
    const users = games.users

    return users
  }
}
