{Aui, Bacon, React} = require './deps.cjsx'

Page = React.createClass
  getInitialState: -> icon: ''
  onClick: (event) ->
    event.target.select()
  onChange: (event) ->
    @setState icon: event.target.value
  render: ->
    <Aui>
      <div ui page grid>
        <div ui inverted segment column>
          <form ui form onSubmit={(event) -> event.preventDefault()}>
            <div ui two column grid>
              <div column>
                <div ui inverted fluid card>
                  <div image>
                    <img src={"https://static.f-list.net/images/avatar/#{@state.icon}.png?#{Date.now()}"}/>
                  </div>
                  <div content>
                    <a header><input ui inverted input value={"[icon]#{@state.icon}[/icon]"} onChange={->} onClick={@onClick}/></a>
                  </div>
                </div>
              </div>
              <div column>
                <div ui inverted fluid card>
                  <div image>
                    <img src={"https://static.f-list.net/images/eicon/#{@state.icon}.gif?#{Date.now()}"}/>
                  </div>
                  <div content>
                    <a header><input ui inverted input value={"[eicon]#{@state.icon}[/eicon]"} onChange={->} onClick={@onClick}/></a>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div ui field>
              <input id="icon" ui inverted input onKeyUp={@onChange} placeholder="Icon Name..." />
            </div>
          </form>
        </div>
      </div>
    </Aui>

React.render <Page/>, document.body
