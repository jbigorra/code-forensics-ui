import Papa from 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm'

/**
 * Parses a CSV file from a given URL.
 *
 * @param {string} url - The URL of the CSV file to parse.
 * @returns {Promise<Array<Array<any>>>} A promise that resolves to a 2D array containing the parsed CSV data.
 */
export function parseCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      error: function () {
        reject([])
      },
      complete: function (results) {
        resolve(results.data)
      }
    })
  })
}
