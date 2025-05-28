import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm'

class EntityVsAuthorAndCommitsChart {
  chartInstance = null
  entity = null

  constructor(canvasId) {
    this.entity = document.getElementById(canvasId)
  }

  renderChart(dataset) {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }

    this.chartInstance = new Chart(this.entity, this.#setupChartConfig(dataset))
  }

  #setupChartConfig(data) {
    const headLessData = data.slice(1)
    const entities = headLessData.map((item) => item[0])
    const authors = headLessData.map((item) => item[1])
    const commits = headLessData.map((item) => item[2])

    return {
      type: 'bar',
      data: {
        labels: entities,
        datasets: [
          {
            stack: 'Stack A',
            label: 'Authors',
            data: authors,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            stack: 'Stack A',
            label: 'Commits',
            data: commits,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          x: {
            stacked: true
          }
        }
      }
    }
  }
}

/**
 * @typedef {Object} AuthorsAnalysisView
 * @property {Object|null} chart - The chart instance.
 * @property {function(Object): void} renderChart - Renders the chart with the given dataset.
 */

/**
 * @type {AuthorsAnalysisView}
 */
export const marketplace = {
  chart: null,
  renderChart(dataset) {
    if (!this.chart) {
      this.chart = new EntityVsAuthorAndCommitsChart('marketplace-mf-authors-commits')
    }

    this.chart.renderChart(dataset)
  },
  onAuthorsRangeChange: null
}

/**
 *
 * @returns {AuthorsAnalysisView}
 */
// export default function marketplace() {
//   return component
// }
