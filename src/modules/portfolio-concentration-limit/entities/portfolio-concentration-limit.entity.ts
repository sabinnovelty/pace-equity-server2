import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Rule } from './rule.entity';
import { Portfolio } from './portfolio.entity';

@Entity('portfolio_concentration')
export class PortfolioConcentrationLimit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  limit_percentage: string; // Example: "30%"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  limit: number;

  @Column({ type: 'int' })
  closed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  backlog: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacity: number;

  @ManyToOne(
    () => Portfolio,
    (portfolio) => portfolio.portfolioConcentrationLimits,
  )
  portfolio: Portfolio;

  @ManyToOne(() => Rule, (rule) => rule.portfolioConcentrationLimits)
  rule: Rule;
}
