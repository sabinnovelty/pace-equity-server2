import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PortfolioConcentrationLimitSchema } from './portfolio-concentration-limit-schema';

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
    () => PortfolioConcentrationLimitSchema,
    concentrationLimit => concentrationLimit.portfolio
  )
  portfolioConcentrationLimits: PortfolioConcentrationLimitSchema[];
}
