{Bacon} = global or window
module?.exports = Bacon
Bacon.BaconMixin =
  isEqual: (a, b) ->
    return yes if a is b
    return no unless a? and b?
    keys = Object.keys a
    return no if keys.length isnt (Object.keys b).length
    return no for key in keys when a[key] isnt b[key]
    yes
  propsProperty: (propName) ->
    propsOrStateProperty @, 'allProps', 'props', propName
  stateProperty: (stateName) ->
    propsOrStateProperty @, 'allState', 'state', stateName
  eventStream: (eventName) ->
    bacon = @_bacon or= {}
    buses = bacon['buses.events'] = bacon['buses.events'] or {}
    bus = buses[eventName]
    if !bus
      bus = buses[eventName] = new (Bacon.Bus)
      @[eventName] = (event) -> bus.push event
    bus
  plug: (stream, stateKey) ->
    unsubscribe = undefined
    bacon = @_bacon or= {}
    unsubscribers = bacon.unsubscribers = bacon.unsubscribers or []
    if stateKey?
      unsubscribe = stream.onValue (partialState) => @setState partialState
    else
      unsubscribe = stream.onValue (value) =>
        partialState = {}
        partialState[stateKey] = value
        @setState partialState
    unsubscribers.push unsubscribe
    unsubscribe
  componentDidUpdate: ->
    bacon = @_bacon
    if bacon
      allPropsBus = bacon['buses.allProps']
      allPropsBus and allPropsBus.push @props
      allStateBus = bacon['buses.allState']
      allStateBus and allStateBus.push @state
    return
  componentWillUnmount: ->
    bacon = @_bacon
    if bacon
      allPropsBus = bacon['buses.allProps']
      allPropsBus and allPropsBus.end()
      allStateBus = bacon['buses.allState']
      allStateBus and allStateBus.end()
      eventBuses = bacon['buses.events']
      if eventBuses
        for eventName of eventBuses
          eventBuses[eventName].end()
      unsubscribe() for unsubscribe in bacon.unsubscribers or []
      return

propsOrStateProperty = (component, allPropsOrStateKey, groupKey, filterKey) ->
  bacon = component._bacon or= {}
  allPropertyKey = 'properties.' + allPropsOrStateKey
  groupedPropertiesKey = 'properties.' + groupKey
  property = bacon[allPropertyKey]
  if !property
    bus = bacon['buses.' + allPropsOrStateKey] = new Bacon.Bus
    property = bacon[allPropertyKey] = bus
      .toProperty component[groupKey]
      .skipDuplicates @isEqual
  unless filterKey?
    wholePropsOrStateProperty = property
    filteredPropertyKey = groupedPropertiesKey + '.' + filterKey
    property = bacon[filteredPropertyKey]
    if !property
      property = bacon[filteredPropertyKey] = wholePropsOrStateProperty
        .filter (x) -> x
        .map (propsOrState) -> propsOrState[filterKey]
        .skipDuplicates @isEqual
        .toProperty()
  property
