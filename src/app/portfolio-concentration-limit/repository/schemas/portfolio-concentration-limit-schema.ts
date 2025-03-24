import { Rule } from './rule-schema';
import { Portfolio } from './portfolio-schema';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('portfolio_concentration')
export class PortfolioConcentrationLimitSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  limit: number;

  @ManyToOne(() => Portfolio, portfolio => portfolio.portfolioConcentrationLimits)
  portfolio: Portfolio;

  @OneToMany(() => Rule, rule => rule.portfolioConcentrationLimit)
  rules: Rule[];
}
