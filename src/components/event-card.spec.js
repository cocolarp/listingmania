import moment from 'moment'

import { shallowMount, trimHtml } from 'src/testing'

import EventCard from './event-card.vue'

const myEvent = {
  name: 'Big GN',
  start: moment('2020-05-12T01:00:00Z'),
  summary: 'some bigass larp',
  distance: 200,
  readable_cost: '50 CHF',
  tags: [{ key: 'international', label: 'International' }],
  raw: {
    location: {
      name: '212 rue de Tolbiac',
    },
  },
}

describe('EventCard', () => {
  it('should display', () => {
    const wrapper = shallowMount(EventCard, {
      propsData: {
        event: myEvent,
      },
    })
    expect(wrapper.html()).toContain(trimHtml(`
    <div class="event-card" style="background-color: white;">
      <div class="name">Big GN</div>
      <heart-stub event="[object Object]"></heart-stub>
      <div class="date-details">
        <span>May 12, 2020</span>
        <span>&nbsp;|&nbsp;</span>
        <span></span>
      </div>
      <div class="tag-section">
        <div class="tag">International</div>
      </div>
      <div class="separator"></div>
      <div class="description">some bigass larp</div>
      <div class="location-details">
        <div class="location">
          <span>212 rue de Tolbiac</span>
          <span>&nbsp;|&nbsp;</span>
          <span>200kms</span>
        </div>
        <div class="price">50 CHF</div>
      </div>
    </div>
    `))
  })
})
