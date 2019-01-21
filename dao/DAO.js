import { SQLite } from 'expo';
import JobDAO from './JobDAO';
import TipDAO from './TipDAO';

const dbName = 'tipstash';

class DAO {
  static JOB = 'job';

  static TIP = 'tip';

  static instance = new DAO();

  constructor() {
    this.db = SQLite.openDatabase(dbName);
    this.cache = new Map([
      [
        DAO.JOB,
        new JobDAO(this.db)
      ],
      [
        DAO.TIP,
        new TipDAO(this.db)
      ]
    ]);
  }

  static get(name) {
    return DAO.instance.cache.get(name);
  }
}

export default DAO;
