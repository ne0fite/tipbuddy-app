import moment from 'moment';
import AbstractDAO from './AbstractDAO';

export default class TipDAO extends AbstractDAO {
  async init() {
    return this.executeSql(
      `create table if not exists tips (
        id integer primary key not null,
        jobId integer not null,
        jobDate integer not null,
        amount real,
        sales real,
        ccTips real,
        tipOut real,
        clockIn text,
        clockOut text,
        duration real,
        note text,
        foreign key (jobId) references jobs(id)
      );`
    );
  }

  async drop() {
    return this.executeSql('drop table if exists tips');
  }

  /**
   * Get all tips ordered by job date, descending.
   * @return {Promise<array>}
   */
  async getAll() {
    const sql = `select
        t.*,
        j.name as jobName,
        j.rate as jobRate
      from tips t
        inner join jobs j on t.jobId = j.id
      order by t.jobDate desc;`;
    const results = await this.executeSql(sql);
    return results.rows._array;
  }

  /**
   * Get tips for the given month ordered by job date, descending.
   * @param {number} year
   * @param {number} month
   * @return {Promise<array>}
   */
  async getAllByMonth(year, month) {
    const startDate = moment().year(year).month(month - 1).startOf('month')
      .startOf('day')
      .toDate();
    const endDate = moment().year(year).month(month - 1).endOf('month')
      .endOf('day')
      .toDate();

    const sql = `select
        t.*,
        j.name as jobName,
        j.rate as jobRate
      from tips t
        inner join jobs j on t.jobId = j.id
      where t.jobDate >= ?
        and t.jobDate <= ?
      order by t.jobDate desc;`;
    const results = await this.executeSql(sql, [ startDate.getTime(), endDate.getTime() ]);
    return results.rows._array;
  }

  /**
   * Get totals / averages by month order by month, descending.
   * @return {Promise<array>}
   */
  async getMonthlyTotals() {
    const sql = `select
        strftime('%Y-%m-01', t.jobDate / 1000, 'unixepoch') as month,
        sum(t.amount) as amountSum,
        avg(t.amount) as amountAvg,
        sum(t.sales) as salesSum,
        avg(t.sales) as salesAvg,
        avg(t.amount / t.sales) as tipPercentAvg,
        avg(t.amount  / t.duration) as tipRateAvg,
        sum(t.duration) as hoursSum,
        avg(t.duration) as hoursAvg,
        sum(t.duration * j.rate) as wagesSum,
        avg(t.duration * j.rate) as wagesAvg
      from tips t
        inner join jobs j on t.jobId = j.id
      group by month
      order by month desc;`;
    const results = await this.executeSql(sql);
    return results.rows._array;
  }

  async getById(id) {
    const results = await this.executeSql(
      `select
        t.*,
        j.name as jobName,
        j.rate as jobRate
        from tips t
        inner join jobs j on t.jobId = j.id
        where t.id = ?;`,
      [id]);
    return results.rows.item(0);
  }

  async create(tip) {
    const sql = `insert into tips (
      jobId,
      jobDate,
      amount,
      sales,
      ccTips,
      tipOut,
      clockIn,
      clockOut,
      duration,
      note
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const results = this.executeSql(
      sql,
      [
        tip.jobId,
        tip.jobDate ? tip.jobDate.getTime() : null,
        tip.amount,
        tip.sales,
        tip.ccTips,
        tip.tipOut,
        tip.clockIn,
        tip.clockOut,
        tip.duration,
        tip.note
      ]
    );

    return {
      ...tip,
      id: results.insertId
    };
  }

  async update(tip) {
    const sql = `update tips set
        jobId = ?,
        jobDate = ?,
        amount = ?,
        sales = ?,
        ccTips = ?,
        tipOut = ?,
        clockIn = ?,
        clockOut = ?,
        duration = ?,
        note = ?
      where id = ?;
    `;
    await this.executeSql(
      sql,
      [
        tip.jobId,
        tip.jobDate ? tip.jobDate.getTime() : null,
        tip.amount,
        tip.sales,
        tip.ccTips,
        tip.tipOut,
        tip.clockIn,
        tip.clockOut,
        tip.duration,
        tip.note,
        tip.id
      ]
    );

    return {
      ...tip
    };
  }

  async save(tip) {
    if (tip.id) {
      return this.update(tip);
    }
    return this.create(tip);
  }

  async delete(id) {
    return this.executeSql('delete from tips where id = ?;', [id]);
  }
}
