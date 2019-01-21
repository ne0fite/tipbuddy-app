export default class AbstractDAO {

  constructor(db) {
    this.db = db;
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
