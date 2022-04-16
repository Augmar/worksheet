import React from "react";
import styled from 'styled-components';
import moment from "moment";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  //grid-template-rows: repeat(6, 1fr);
  grid-gap: 1px;
  background-color: ${props => props.isHeader ? '#1E1F21' : '#404040'};
  ${props => props.isHeader && 'border-bottom: 1px solid #404040'}
`;

const CellWrapper = styled.div`
  min-width: 140px;
  min-height: ${props => props.isHeader ? 24 : 80}px;
  background-color: ${props => props.isWeekend ? '#272829' : '#1E1F21'};
  color: ${props => props.isSelectedMonth ? '#DDDCDD' : '#555579'}; 
`;

const RowInCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  ${props => props.pr && `padding-right: ${props.pr * 8}px`}
`;

const DayWrapper = styled.div`
  height: 33px;
  width: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
`;

const CurrentDay = styled('div')`
  height: 100%;
  width: 100%;
  background: #f00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShowDayWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

const SheetListWrapper = styled('ul')`
  margin: unset;
  list-style-position: inside;
  padding-left: 4px;
`;

const SheetWrapper = styled('div')`
  padding-top: 4px;
  justify-content: space-between;
`;

const NameSheetWrapper = styled('button')`
  position: relative;
  left: 4px;
  bottom: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 114px;
  border: unset;
  background: unset;
  //color: #DDDDDD;
  color: ${props => props.isSelectedMonth ? '#DDDCDD' : '#555579'};
  cursor: pointer;
  margin: 0;
  padding: 0;
  text-align: left;
`;

const CalendarGrid = ({startDay, today, totalDays, events, openFormHandler}) => {
    const day = startDay.clone().subtract(1, 'day');
    const daysArray = [...Array(totalDays)].map(() => day.add(1, 'day').clone());
    const isCurrentDay = (day) => moment().isSame(day, 'day');
    const isSelectedMonth = (day) => today.isSame(day, 'month');


    return(
        <>
            <GridWrapper isHeader>
                {[...Array(7)].map((_, i) => (
                    <CellWrapper isHeader isSelectedMonth key={i}>
                        <RowInCell pr={1} justifyContent={'flex-end'}>
                            {moment().day(i+1).format('dddd')}
                        </RowInCell>
                    </CellWrapper>
                ))}
            </GridWrapper>
            <GridWrapper>
                {
                    daysArray.map((dayItem) => (
                        <CellWrapper
                            key={dayItem.unix()}
                            isWeekend={dayItem.day() === 6 || dayItem.day() === 0}
                            isSelectedMonth = {isSelectedMonth(dayItem)}
                        >
                            <RowInCell justifyContent={'flex-end'}>
                                <ShowDayWrapper>
                                    <DayWrapper>
                                        {
                                            isCurrentDay(dayItem) ? (
                                            <CurrentDay>{dayItem.format('D')}</CurrentDay>
                                            ) : (
                                                dayItem.format('D')
                                            )
                                        }
                                    </DayWrapper>
                                </ShowDayWrapper>
                            </RowInCell>
                            <SheetListWrapper>
                                <SheetWrapper>
                                    <NameSheetWrapper  isSelectedMonth = {isSelectedMonth(dayItem)} onDoubleClick={() => openFormHandler('Morning', dayItem.clone().add(1, 'h').format('X'), events, dayItem)} >
                                        Morning {
                                        events
                                            .filter(event => event.date >= dayItem.format('X') && event.date <= dayItem.clone().add(12, 'h').format('X'))
                                            .map(event => (
                                                <b><big>{event.name}</big></b>
                                            ))
                                            }
                                    </NameSheetWrapper>
                                </SheetWrapper>
                                <SheetWrapper>
                                    <NameSheetWrapper  isSelectedMonth = {isSelectedMonth(dayItem)} onDoubleClick={() => openFormHandler('Day', dayItem.clone().add(13, 'h').format('X'), events, dayItem)} > Day {
                                        events
                                            .filter(event => event.date >= dayItem.clone().add(12, 'h').format('X') && event.date <= dayItem.clone().endOf('day').format('X'))
                                            .map(event => (
                                                <strong><larger>{event.name}</larger></strong>
                                            ))
                                    }
                                    </NameSheetWrapper>
                                </SheetWrapper>
                            </SheetListWrapper>
                        </CellWrapper>
                    ))
                }
            </GridWrapper>
        </>
    );
};

export {CalendarGrid}