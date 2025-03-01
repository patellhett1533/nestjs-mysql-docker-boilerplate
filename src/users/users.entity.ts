import { USER_ROLES } from "src/shared/lib/roles.type";
import { CryptoService } from "src/shared/lib/utility";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  username: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    transformer: {
      to: (value: string) => CryptoService.hashPassword(value),
      from: (value: string) => value,
    },
  })
  @Index()
  password: string;

  @Column({ type: "enum", enum: USER_ROLES, enumName: "USER_ROLES" })
  role: USER_ROLES;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
