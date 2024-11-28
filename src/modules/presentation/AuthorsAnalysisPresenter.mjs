
import { AbstractSystemView } from './SystemView.mjs'
import { parseCSV } from '../infrastructure/apis/CSVParser.mjs'

export class AuthorsAnalysisPresenter extends AbstractSystemView {

  /**
   * @constructor
   * @param {Alpine} alpine
   * @param {AuthorsAnalysisView} authorsAnalysisView
   */

  dataset = []

  constructor(alpine, authorsAnalysisView) {
    super()
    this.alpine = alpine
    this.authorsAnalysisView = authorsAnalysisView
    this.authorsAnalysisView.init = this._onInit.bind(this)
    this.authorsAnalysisView.onAuthorsRangeChange = this._onAuthorsRangeChange.bind(this)
  }

  loadComponent(name) {
    const component = () => this.authorsAnalysisView
    this.alpine.data(name, component)
  }

  async _onInit() {
    this.dataset = await parseCSV('http://localhost:5500/public/files/marketplace-mf-component/authors.csv')
    this.authorsAnalysisView.renderChart(this.dataset)
  }

  _onAuthorsRangeChange(event) {
    const nAuthors = parseInt(event.target.value)
    const dataset = [].concat(
      this.dataset[0],
      this.dataset.slice(1).filter((row) => row[1] >= nAuthors)
    )
    this.authorsAnalysisView.renderChart(dataset)
  }
}
