import { expect } from 'chai'
import {
  describeComponent,
  it
} from 'ember-mocha'
import { beforeEach } from 'mocha'
import hbs from 'htmlbars-inline-precompile'
import {
  $hook,
  initialize
} from 'ember-hook'
import wait from 'ember-test-helpers/wait'

const defaultPack = 'app'
const defaultSelectedPack = 'frost'
const defaultSelectedIcon = 'close'

const iconSelector = 'use'
const iconAttributeName = 'xlink:href'

const detailTabsHookName = '-object-details-tabs'
const detailTabHookName = '-object-details-tab'
const selectedDetailTabHookName = '-object-details-tab-selected'
const relatedObjectTabHookName = '-object-details-related-object-tab'
const selectedRelatedObjectTabHookName = '-object-details-related-object-tab-selected'
const bodyContentHookName = '-object-details-body-content'

describeComponent(
  'frost-object-details',
  'Integration: FrostObjectDetailsComponent',
  {
    integration: true
  },
  function () {
    beforeEach(function () {
      initialize()
    })

    it('Set hook name', function () {
      const hookName = 'my-hook'
      this.setProperties({
        hook: hookName
      })
      this.render(hbs`
        {{frost-object-details
          hook=hook
          detailTabs=(array
              (component 'frost-object-tab'
                name='profile'
                text='Profile View'
                content=(component 'object-details-content' color='skyblue' name='profile')
              )
            )
        }}
      `)

      expect($hook(`${hookName}${detailTabsHookName}`)).to.have.length(1)
    })

    it('Select tab by default', function (done) {
      const selectedTabText = 'Profile View 2'
      const contentText = 'profile 2'
      const defaultTabName = 'profile2'
      this.setProperties({
        selectedTabText: selectedTabText,
        defaultTabName: defaultTabName,
        contentText: contentText
      })
      this.render(hbs`
        {{frost-object-details
          defaultTabName=defaultTabName
          detailTabs=(array
              (component 'frost-object-tab'
                name='profile'
                text='Profile View'
                content=(component 'object-details-content' color='skyblue' name='profile')
              )
              (component 'frost-object-tab'
                name=defaultTabName
                text=selectedTabText
                content=(component 'object-details-content' color='skyblue' name=contentText)
              )
            )
        }}
      `)

      return wait()
        .then(() => {
          expect($hook(detailTabHookName)).to.have.length(1)
          expect($hook(selectedDetailTabHookName).text().trim()).to.be.equal(selectedTabText)
          expect($hook(selectedDetailTabHookName).find('a.active')).to.have.length(1)
          expect($hook(selectedDetailTabHookName).find('.tab-selection.active')).to.have.length(1)
          expect($hook(bodyContentHookName).text().trim()).to.be.equal(`This is ${contentText} template`)

          return capture('object-details-selected-tab', done, {
            targetElement: $hook('-object-details')[0],
            experimentalSvgs: true
          })
        })
    })

    it('Select related object tab', function (done) {
      const selectedTabName = 'device'
      const selectedTabType = 'relatedObjectTab'
      const selectedTabText = 'Device'
      const defaultTabName = 'profile'
      const contentText = 'related devices'
      this.setProperties({
        selectedTabName: selectedTabName,
        selectedTabType: selectedTabType,
        selectedTabText: selectedTabText,
        defaultTabName: defaultTabName,
        contentText: contentText
      })
      this.render(hbs`
        {{frost-object-details
          selectedTabName=selectedTabName
          selectedTabType=selectedTabType
          defaultTabName=defaultTabName
          detailTabs=(array
              (component 'frost-object-tab'
                name='profile'
                text='Profile View'
                content=(component 'object-details-content' color='skyblue' name='profile')
              )
            )
          relatedObjectTabs=(array
            (component 'frost-related-object-tab'
              name=selectedTabName
              icon=(hash
                name='network-element'
              )
              text=selectedTabText
              content=(component 'object-details-content' color='coral' name=contentText)
            )
          )
        }}
      `)

      return wait()
        .then(() => {
          expect($hook(detailTabHookName)).to.have.length(1)

          expect($hook(selectedRelatedObjectTabHookName)).to.have.length(1)
          expect($hook(selectedRelatedObjectTabHookName).text().trim()).to.be.equal(selectedTabText)
          expect($hook(selectedRelatedObjectTabHookName).find('a.is-selected')).to.have.length(1)
          expect($hook(selectedRelatedObjectTabHookName).find(iconSelector).attr(iconAttributeName)
                .indexOf(`/${defaultSelectedPack}.svg#${defaultSelectedIcon}`)).to.be.gt(-1)

          expect($hook(relatedObjectTabHookName)).to.have.length(0)

          expect($hook(detailTabHookName).find('.tab-selection')).to.have.length(1)
          expect($hook(detailTabHookName).find('.tab-selection.active')).to.have.length(0)

          expect($hook(bodyContentHookName).text().trim()).to.be.equal(`This is ${contentText} template`)

          return capture('object-details-selected-related-obj-tab', done, {
            targetElement: $hook('-object-details')[0],
            experimentalSvgs: true
          })
        })
    })

    it('Only a detail tab', function (done) {
      const selectedTabName = 'profile'
      const defaultTabName = 'profile'
      this.setProperties({
        selectedTabName: selectedTabName,
        defaultTabName: defaultTabName
      })
      this.render(hbs`
        {{frost-object-details
          selectedTabName=selectedTabName
          defaultTabName=defaultTabName
          detailTabs=(array
            (component 'frost-object-tab'
              name=selectedTabName
              text='Profile View'
              content=(component 'object-details-content' color='skyblue' name='profile')
            )
          )
        }}
      `)

      return wait()
        .then(() => {
          expect($hook(selectedDetailTabHookName)).to.have.length(1)
          expect($hook(detailTabHookName)).to.have.length(0)
          expect($hook(relatedObjectTabHookName)).to.have.length(0)

          return capture('object-details-with-only-tab', done, {
            targetElement: $hook('-object-details')[0],
            experimentalSvgs: true
          })
        })
    })

    it('Detail tab and related object tab', function (done) {
      const selectedTabName = 'profile'
      const defaultTabName = 'profile'
      const tabText = 'Profile View'
      const relatedObjectTabText = 'Devices'
      const iconName = 'network-element'
      this.setProperties({
        selectedTabName: selectedTabName,
        defaultTabName: defaultTabName,
        tabText: tabText,
        relatedObjectTabText: relatedObjectTabText,
        iconName: iconName
      })
      this.render(hbs`
        {{frost-object-details
          selectedTabName=selectedTabName
          defaultTabName=defaultTabName
          detailTabs=(array
            (component 'frost-object-tab'
              name=selectedTabName
              text=tabText
              content=(component 'object-details-content' color='skyblue' name='profile')
            )
          )
          relatedObjectTabs=(array
            (component 'frost-related-object-tab'
              name='devices'
              icon=(hash
                name=iconName
              )
              text=relatedObjectTabText
              content=(component 'object-details-content' color='coral' name='related devices')
            )
          )
        }}
      `)

      return wait()
        .then(() => {
          expect($hook(selectedDetailTabHookName)).to.have.length(1)
          expect($hook(selectedDetailTabHookName).text().trim()).to.be.equal(tabText)

          expect($hook(relatedObjectTabHookName)).to.have.length(1)
          expect($hook(relatedObjectTabHookName).find(iconSelector).attr(iconAttributeName)
                .indexOf(`/${defaultPack}.svg#${iconName}`)).to.be.gt(-1)
          expect($hook(relatedObjectTabHookName).text().trim()).to.be.equal(relatedObjectTabText)

          expect($hook(detailTabHookName)).to.have.length(0)

          return capture('object-details-with-tabs-and-related-obj-tab', done, {
            targetElement: $hook('-object-details')[0],
            experimentalSvgs: true
          })
        })
    })

    it('Set content', function () {
      const defaultTabName = 'profile'
      this.setProperties({
        defaultTabName: defaultTabName
      })
      this.render(hbs`
        {{#frost-object-details
            defaultTabName=defaultTabName
            detailTabs=(array
              (component 'frost-object-tab'
                name=selectedTabName
                text='Profile View'
                content=(component 'object-details-content' color='skyblue' name=selectedTabName)
              )
            )
        }}
        test
        {{/frost-object-details}}
      `)

      expect($hook(selectedDetailTabHookName)).to.have.length(1)
      expect($hook('-object-details-content').text().trim()).to.be.equal('test')
    })
  }
)
