/**
 * Sample Data
[
  [date,added,deleted,commits],
  [2022-03-11,0,0,1],
  [2022-03-29,37217,13,2],
  [2022-04-04,958,906,1],
  [2022-05-17,103,44,1],
  [2022-05-18,2,2,1],
  [2022-05-23,3759,156,2],
]
 *
 *
 */

class AbsoluteChurn {
  constructor(csvData) {
    this._headers = csvData[0]
    this._csvData = csvData.slice(1)
  }

  /**
   *
   * @returns {Array<string['date','added','deleted','commits']>} The headers of the CSV data.
   */
  getHeaders() {
    return this._headers
  }

  /**
   *
   * @returns {Array<string>} The dates of the changes.
   */
  getDateColumnData() {
    return this._csvData.map((row) => row[0])
  }

  /**
   *
   * @returns {Array<number>} The added lines of code.
   */
  getAddedLinesColumnData() {
    return this._csvData.map((row) => row[1])
  }

  /**
   *
   * @returns {Array<number>} The deleted lines of code.
   */
  getDeletedLinesColumnData() {
    return this._csvData.map((row) => row[2])
  }

  /**
   *
   * @returns {Array<number>} The number of commits.
   */
  getCommitsColumnData() {
    return this._csvData.map((row) => row[3])
  }
}
