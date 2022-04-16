import moment from "moment";
import {Header} from "../Header";
import {Monitor} from "../Monitor";
import {CalendarGrid} from "../CalendarGrid";
import styled from "styled-components";
import {useEffect, useState} from "react";
import bridge from '@vkontakte/vk-bridge';


bridge.send("VKWebAppInit", {});
bridge.subscribe((e) => console.log(e));

const ShadowWrapper = styled('div')`
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px #1A1A1A, 0 8px 20px 6px #888;
`;

const FormPositionWrapper = styled('div')`
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled(ShadowWrapper)`
  width: 200px;
  //height: 300px;
  background-color: #1E1F21;
  color: #DDDDDD;
  box-shadow: unset;
`;

const EventTitle = styled('input')`
  padding: 4px 14px;
  font-size: .85rem;
  width: 100%;
  border: unset;
  background-color: #1E1F21;
  color: #DDDDDD;
  outline: unset;
  border-bottom: 1px solid #464648;
`;

const EventBody = styled('input')`
  padding: 4px 14px;
  font-size: .85rem;
  width: 100%;
  border: unset;
  background-color: #1E1F21;
  color: #DDDDDD;
  outline: unset;
  border-bottom: 1px solid #464648;
`;

const ButtonsWrapper = styled('div')`
  padding: 8px 14px;
  display: flex;
  justify-content: flex-end;
`;

const url = 'http://localhost:5000';
const totalDays = 42;

function Index() {

  //window.moment = moment;
  moment.updateLocale('en', {week: {dow: 1}});
  //const today = moment();
  const [today, setToday] = useState(moment());
  const startDay = today.clone().startOf('month').startOf('week');

  const prevHandler = () => setToday(prev => prev.clone().subtract(1, 'month'));
  const todayHandler = () => setToday(moment());
  const nextHandler = () => setToday(prev => prev.clone().add(1, 'month'));

  const [event, setEvent] = useState(null);
  const [isShowForm, setShowForm] = useState(false);
  const [method, setMethod] = useState(null)

  const [events, setEvents] = useState([]);
  const startDateQuery = startDay.clone().format('X');
  const endDateQuery = startDay.clone().add(totalDays, 'days').format('X');

  useEffect(() => {
      fetch(`${url}/events?date_gte=${startDateQuery}&date_lte=${endDateQuery}`)
          .then(res => res.json())
          .then(res => {
              console.log('Response', res);
              setEvents(res);
          });
  }, [today]);

  const openFormHandler = (methodName, eventDate, eventForUpd, dayDate) => {
      const eventForUpdTmp = {"name": "", "date": eventDate}
      setEvent(eventForUpdTmp);
      setMethod('Create');
      for (let i in eventForUpd) {
          console.log(eventForUpd[i].date);
          //setEvent(eventForUpd);
          if (eventForUpd[i].date == eventDate){
              if (methodName === 'Morning') {
                  setEvent(eventForUpd[i]);
                  methodName = 'Upd morning';
                  console.log('Morning txt: ');
                  console.log(eventForUpd[i]);
                  setMethod('Update');
              } else if (methodName == 'Day'){
                          setEvent(eventForUpd[i]);
                          methodName = 'Upd day';
                          console.log('Day txt: ');
                          console.log(eventForUpd[i]);
                          setMethod('Update');
              }
          }
      }
      setShowForm(true);
      console.log(method, eventDate, eventForUpd, dayDate.format('X'));
  };

  const cancelButtonHandler =() => {
      setShowForm(false);
      setEvent(null);
  };

  const changeEventHandler = (text, field) => {
      setEvent(prevState => ({
          ...prevState,
          [field]: text
      }))
  };

  const eventFetchHandler = () => {
      const fetchUrl = method === 'Update' ? `${url}/events/${event.id}` : `${url}/events`;
      const httpMethod = method === 'Update' ? 'PATCH' : 'POST';

      fetch(fetchUrl, {
          method: httpMethod,
          headers: {
              'Content-Type' : 'application/json'
          },
          body: JSON.stringify(event)
      })
          .then(res => res.json())
          .then(res => {
              console.log(res);
              if (method === 'Update') {
                  setEvents(prevState => prevState.map(eventEl => eventEl.id === res.id ? res : eventEl))
              } else {
                  setEvents(prevState => [...prevState, res]);
              }
              cancelButtonHandler();
          })
  };

  return (
    <>
        {
            isShowForm ? (
                <FormPositionWrapper onClick={cancelButtonHandler}>
                    <FormWrapper onClick={e => e.stopPropagation()}>
                        <EventTitle
                            value={event.name}
                            onChange={e => {changeEventHandler(e.target.value, 'name')}}
                        />
                        <EventBody
                            value={event.date}
                            onChange={e => {changeEventHandler(e.date.value, 'date')}}
                        />
                        <ButtonsWrapper>
                            <button onClick={cancelButtonHandler}>Cancel</button>
                            <button onClick={eventFetchHandler}>{method}</button>
                        </ButtonsWrapper>
                    </FormWrapper>
                </FormPositionWrapper>
            ) : null
        }
        <ShadowWrapper>
            <Header />
            <Monitor
                today = {today}
                prevHandler={prevHandler}
                todayHandler={todayHandler}
                nextHandler={nextHandler}
            />
            <CalendarGrid startDay = {startDay} today={today} totalDays={totalDays} events={events} openFormHandler={openFormHandler}/>
        </ShadowWrapper>
    </>
  );
}

export default Index;
