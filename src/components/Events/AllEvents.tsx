import React from 'react'
import styled from 'styled-components'

import { EventType, eventsTypes } from '../../constants/events'
import { useQueryCustom } from '../../hooks/useQueryCustom'
import { useEvent } from '../../hooks/useEvent'
import { fetchEvents } from '../../api/events'
import { Event } from '../../models/event'

interface AllEventsProps {
  closeChooseEventPopup: () => void
}

interface ChooseEventTypeProps {
  setEventType: React.Dispatch<React.SetStateAction<EventType>>
  eventType: EventType
}

interface EventsProps {
  data: Event[] | undefined
  eventType: EventType
  closeChooseEventPopup: () => void
}

export const AllEvents = ({ closeChooseEventPopup }: AllEventsProps) => {
  const { data } = useQueryCustom(['events'], fetchEvents)
  const [eventType, setEventType] = React.useState<EventType>('חירום')

  return (
    <AllEventsStyle>
      <ChooseEventType eventType={eventType} setEventType={setEventType} />
      <Events data={data} eventType={eventType} closeChooseEventPopup={closeChooseEventPopup} />
    </AllEventsStyle>
  )
}

const ChooseEventType = ({ setEventType, eventType }: ChooseEventTypeProps) => {
  return (
    <ChooseEventTypeStyle>
      {eventsTypes.map((type) => {
        const isCurrent = eventType === type
        return (
          <EventTypeContainer
            key={type}
            onClick={() => setEventType(type)}
            className="event-type"
            style={{ borderBottomColor: isCurrent ? 'black' : '' }}
          >
            {type}
          </EventTypeContainer>
        )
      })}
    </ChooseEventTypeStyle>
  )
}

const Events = ({ data, eventType, closeChooseEventPopup }: EventsProps) => {
  const { changeEvent } = useEvent()
  const filteredData = React.useMemo(
    () => data?.filter((ele) => (eventType === 'תרגיל' ? ele.isTraining : !ele.isTraining)),
    [eventType, data]
  )

  const changeEventHandler = (event: Event) => {
    changeEvent(event)
    closeChooseEventPopup()
  }

  return (
    <EventsContainer className="events">
      {filteredData?.map((event) => (
        <EventItem key={event.id} onClick={() => changeEventHandler(event)}>
          {event.name}
        </EventItem>
      ))}
    </EventsContainer>
  )
}

const AllEventsStyle = styled.div`
  width: 100%;
  overflow: auto;
  padding-right: 2rem;
  margin-top: 2rem;

  & .choose-event-type {
    display: flex;
    width: 100%;

    & .event-type {
      width: 50%;
      text-align: center;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      padding-bottom: 0.6rem;
      cursor: pointer;
    }
  }
`
const ChooseEventTypeStyle = styled.div`
  display: flex;
  width: 100%;
`
const EventTypeContainer = styled.div`
  width: 50%;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.6rem;
  cursor: pointer;
`
const EventsContainer = styled.div`
  width: 100%;
`
const EventItem = styled.div`
  text-align: start;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.2rem 0 1rem 0;
  cursor: pointer;
`