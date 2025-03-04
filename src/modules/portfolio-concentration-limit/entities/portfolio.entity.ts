import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PortfolioConcentrationLimit } from './portfolio-concentration-limit.entity';

@Entity('portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  investorApprovals: string;

  @Column({ type: 'text', nullable: true })
  paymentRemittanceInstruction: string;

  // One Portfolio can have many PortfolioConcentrationLimits
  @OneToMany(
    () => PortfolioConcentrationLimit,
    (concentrationLimit) => concentrationLimit.portfolio,
  )
  portfolioConcentrationLimits: PortfolioConcentrationLimit[];
}
