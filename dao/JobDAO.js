import AbstractDAO from './AbstractDAO';

export default class JobDAO extends AbstractDAO {
  async init() {
    return this.executeSql(
      `create table if not exists jobs (
        id integer primary key not null,
        name text,
        rate real,
        clockIn text,
        clockOut text,
        defaultJob integer
      );`
    );
  }

  async drop() {
    return this.executeSql('drop table if exists jobs');
  }

  async getAll() {
    const results = await this.executeSql('select * from jobs order by name;');
    return results.rows._array;
  }

  async getById(id) {
    const results = await this.executeSql('select * from jobs where id = ?', [id]);
    return results.rows.item(0);
  }

  async getDefault() {
    const results = await this.executeSql('select * from jobs where defaultJob = 1');
    return results.rows.item(0);
  }

  async create(job) {
    const sql = 'insert into jobs (name, rate, clockIn, clockOut, defaultJob) values (?, ?, ?, ?, ?)';
    const results = await this.executeSql(
      sql,
      [
        job.name,
        job.rate,
        job.clockIn,
        job.clockOut,
        job.defaultJob ? 1 : 0
      ]
    );
    return {
      ...job,
      id: results.insertId
    };
  }

  async update(job) {
    const sql = `update jobs set
        name = ?,
        rate = ?,
        clockIn = ?,
        clockOut = ?,
        defaultJob = ?
      where id = ?
    `;
    await this.executeSql(
      sql,
      [
        job.name,
        job.rate,
        job.clockIn,
        job.clockOut,
        job.defaultJob ? 1 : 0,
        job.id
      ]
    );
    return {
      ...job
    };
  }

  async save(job) {
    if (job.id) {
      return this.update(job);
    }
    return this.create(job);
  }

  async delete(id) {
    await this.executeSql('delete from jobs where id = ?', [id]);
  }
}
