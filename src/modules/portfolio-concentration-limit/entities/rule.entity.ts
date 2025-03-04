import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PortfolioConcentrationLimit } from './portfolio-concentration-limit.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string; // e.g hotel , ruca , non-profit

  @Column()
  description: string;

  // One Rule can have many PortfolioConcentrationLimit records
  @OneToMany(
    () => PortfolioConcentrationLimit,
    (portfolioConcentrationLimit) => portfolioConcentrationLimit.rule,
  )
  portfolioConcentrationLimits: PortfolioConcentrationLimit[];
}
