import { SQLite } from 'expo';

const dbName = 'tipkeeper';
export default class AbstractDAO {

  constructor() {
    this.db = SQLite.openDatabase('tipkeeper');
  }

  async executeSql(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, results) => resolve(results),
          (_, error) => reject(error)
        );
      }, (error) => {
        reject(error);
      });
    });
  }
}
