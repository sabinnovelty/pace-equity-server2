import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PortfolioConcentrationLimitSchema } from './portfolio-concentration-limit-schema';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string; // e.g hotel , ruca , non-profit

  @Column()
  description: string;

  @ManyToOne(
    () => PortfolioConcentrationLimitSchema,
    portfolioConcentrationLimit => portfolioConcentrationLimit.rules
  )
  portfolioConcentrationLimit: PortfolioConcentrationLimitSchema;
}
