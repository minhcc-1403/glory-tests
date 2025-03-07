import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "assets" }) // Tên bảng trong PostgreSQL
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  serial: string;

  @Column({ type: "varchar", length: 255 })
  type: string;

  @Column({ type: "varchar", length: 255 })
  status: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 100 })
  locationCustomId: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
