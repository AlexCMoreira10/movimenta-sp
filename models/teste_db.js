import {Sequelize} from "sequelize";

const sequelize = new Sequelize("Teste", "root", '', {
      host: "localhost",
      dialect: "mysql"
  })
  
  export default {
      Sequelize: Sequelize,
      sequelize: sequelize
  };
  
  