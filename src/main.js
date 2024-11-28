/**
 * @typedef {Object} Alpine
 * @property {function} start - Starts Alpine.js.
 * @property {function} data - Defines a new Alpine.js component.
 * @property {function} store - Defines a new Alpine.js store.
 * @property {function} magic - Defines a new Alpine.js magic property.
 * @property {function} directive - Defines a new Alpine.js directive.
 */

/**
 * @type {Alpine}
 */
import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.3/+esm'

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement
} from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm'
import { marketplace } from './modules/ui/marketplace.mjs'
import { AuthorsAnalysisPresenter } from './modules/presentation/AuthorsAnalysisPresenter.mjs'

Chart.register(CategoryScale, LinearScale, BarController, BarElement)

const presenter = new AuthorsAnalysisPresenter(Alpine, marketplace)

presenter.loadComponent('marketplace')

Alpine.start()
