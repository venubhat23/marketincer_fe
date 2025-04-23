import React, { useState, useRef, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';
import moment from 'moment';
import InstagramIcon from "@mui/icons-material/Instagram";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from "axios";
import { Box } from '@mui/material';
import "flatpickr/dist/themes/material_green.css";
import useDebounce from './useDebounce';
import EventModal from './EventModal';
import CustomToolbar from './CustomToolbar';


const localizer = momentLocalizer(moment);

// Move CustomMonthRow to top
const CustomMonthRow = ({ dates, ...props }) => {

    // Convert dates to moment objects for comparison
    const weekDays = dates.map(date => moment(date).startOf('day'));

    // Check for events in this week
    const hasEvents = myEventsList.some(event => {
        const eventDay = moment(event.start).startOf('day');
        return weekDays.some(day => day.isSame(eventDay));
    });

    return (
        <div
            {...props}
            style={{
                ...props.style,
                minHeight: hasEvents ? 300 : 200,
                maxHeight: hasEvents ? 300 : 200,
                overflow: 'visible'
            }}
        >
            {props.children}
        </div>
    );
};
const EventCard = React.memo(({ event }) => {
    return (
        <div className="event-card">
            <div className="event-header">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "#000000",
                        fontSize: "13px"
                    }}
                >
                    <InstagramIcon sx={{ color: "#E1306C", width: 20, height: 20, }} />
                    {event.page_data?.name}
                    <div className="event-time">🕒 {moment(event.start).format('HH:mm')}</div>
                </Box>

            </div>
            <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: "#000000",
                        fontSize: "13px"
                    }}
                >
                 <div className="event-image-container">
                <img src={event.s3_url} alt={event.page_data?.name} className="event-image" />
            </div>
            <div className="event-description">  <span dangerouslySetInnerHTML={{ __html: event.comments }} /> </div>
                </Box>
           
            
            
        </div>
    );
});

// 2. Custom Date Cell Component
const CustomDateCell = ({ date }) => {
    const isOffRange = moment(date).month() !== moment(date).startOf('month').month();
    return (
        <div className="rbc-day-bg">
            <div className={`rbc-date-cell ${isOffRange ? 'rbc-off-range' : ''}`}>
                {moment(date).format('D')}
            </div>
        </div>
    );
};

const CalendarComponent = (props) => {

    const [myEventsList, setMyEventsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [selectedPostType, setSelectedPostType] = useState('feed');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const token = localStorage.getItem("userToken");
    const [refreshKey, setRefreshKey] = useState(0);
     const [selectedPages, setSelectedPages] = useState([]);

    const getDateRange = (date, view) => {
        const momentDate = moment(date);
        let from, to;

        switch (view) {
            case 'month':
                from = momentDate.clone().startOf('month').format('YYYY-MM-DD');
                to = momentDate.clone().endOf('month').format('YYYY-MM-DD');
                break;
            case 'week':
                from = momentDate.clone().startOf('isoWeek').format('YYYY-MM-DD');
                to = momentDate.clone().endOf('isoWeek').format('YYYY-MM-DD');
                break;
            case 'day':
                from = to = momentDate.format('YYYY-MM-DD');
                break;
            default:
                from = to = momentDate.format('YYYY-MM-DD');
        }

        return { from, to };
    };



    const fetchEvents = async () => {

        const postTypeMap = {
            'feed': null,
            'scheduled': 'scheduled',
            'draft': 'draft',
            'published': 'published'
        };

        try {
            setLoading(true);
            const { from, to } = getDateRange(currentDate, currentView);

            const response = await axios.get(
                'https://api.marketincer.com/api/v1/posts/search',
                {
                    params: {
                        from,
                        to,
                        account_ids: selectedPages,
                        postType: postTypeMap[selectedPostType],
                        query: debouncedSearchQuery
                    },
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the Bearer token
                    },
                }

            );

            const events = response.data.posts.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            }));

            setMyEventsList(events);
            setError(null);
        } catch (err) {
            setError('Failed to fetch events');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

    }, [debouncedSearchQuery, currentView, currentDate, selectedPages, selectedPostType, refreshKey]);

    const handleViewChange = (newView) => {
        setCurrentView(newView);
    };

    const handleNavigate = (newDate) => {
        setCurrentDate(newDate);
    };


    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };


    return (
        <div style={{ height: 'auto', minHeight: 900, width: "100%" }}>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                defaultView="month"
                culture="en-GB"
                onView={handleViewChange}
                onNavigate={handleNavigate}
                date={currentDate}
                view={currentView}
                min={new Date(2025, 0, 1, 0, 0)} // Start of day
                max={new Date(2025, 11, 31, 23, 59)} // End of day
                step={60} // 60-minute intervals
                timeslots={1} // Single column per hour

                components={{
                    month: {
                        dateHeader: CustomDateCell,
                        row: CustomMonthRow
                    },
                    week: {
                        event: EventCard // Add this for week view
                    },
                    day: {
                        event: EventCard // Add this for day view
                    },
                    toolbar: (props) => (
                        <CustomToolbar
                            {...props}
                            onPostTypeChange={setSelectedPostType}
                            searchQuery={searchQuery}            // <-- still pass normal one for typing
                            onSearchChange={setSearchQuery}
                            selectedPages={selectedPages}
                            setSelectedPages={setSelectedPages}
                        />
                    ),
                    event: EventCard
                }}
                dayLayoutAlgorithm="no-overlap"
                onSelectEvent={handleEventClick}
                style={{
                    ...props.style,
                    overflow: 'visible',
                    position: 'relative', // Add this
                }}
                eventPropGetter={(event) => ({
                    style: {
                        display: 'block', // Force block layout
                        position: 'static', // Override absolute positioning
                        height: 'auto', // Allow natural height
                        overflow: 'visible' // Show overflow content
                    }
                })}
            />
            <EventModal
                event={selectedEvent}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                refreshCalendar={() => setRefreshKey(prev => prev + 1)} 
            />
        </div>
    );
};

export default CalendarComponent;
