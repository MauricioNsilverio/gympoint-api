import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.INTEGER,
        altura: Sequelize.integer,
      },
      {
        sequelize,
      }
    );
  }
}

export default Student;
