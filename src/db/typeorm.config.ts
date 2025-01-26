import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123asdhAhs+%awe",
  database: "library_management",
  synchronize: false, 
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
});

AppDataSource.initialize()
  .then(() => console.log("Data Source Initialized"))
  .catch((error) => console.log(error));