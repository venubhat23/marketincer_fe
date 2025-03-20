import React, { useState, useRef, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';
import moment from 'moment';
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MDButton from "@/components/MDButton";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import axios from "axios";
import { Modal, Box, IconButton, Button, Typography,  InputLabel, FormControl, Select,
    TextField,  MenuItem,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MyEditor from "../../components/Editor";
import {
    Avatar,
} from "@mui/material";

const localizer = momentLocalizer(moment);

// Dummy events list
const myEventsList = [
    {
        start: new Date(2025, 2, 18, 2, 0), // March 18, 2025, 02:00 AM
        end: new Date(2025, 2, 18, 3, 0),
        brand_name: "d-mart",
        comments: "<p>sddsds</p>",
        hashtags: "#sports #fitness",
        note: "<p>sddsds</p>",
        s3_url: "https://kitintellect.tech/storage/public/writable/uploads/aaFacebook/coder_mavala_logo_1742397832.png",
        status: "draft",
        page_data: {
            "id": 9,
            "social_account_id": 9,
            "name": "Unique Fold",
            "username": "unique-fold",
            "page_type": null,
            "social_id": "101337422566880",
            "page_id": "101337422566880",
            "picture_url": null,
            "access_token": "EAAJW3shZBDu0BO7MZBNWYP678u49NWuQRQpgU1ZAbb50PCicaTv82Mm0kfdHatlWZC1ZBDqOgbJJPAbBUi6ZBrosUcBZCo3GlqZBlSQb3Q4CIfZCqpyiqpMooqUZCvocCwTfxbI82QZBVjUgWwSUSy9suc2VZCZCZBySgnUNH64iyHkIrdlF6mZBxhVnWlvyZAPJYwn2ZCJwZD",
            "connected": true,
            "page_info": {
                "id": "101337422566880",
                "name": "Unique Fold",
                "picture": {
                    "data": {
                        "height": 50,
                        "is_silhouette": false,
                        "url": "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-1/278835906_101425622558060_3186083233071941773_n.jpg?stp=cp0_dst-jpg_s50x50_tt6\u0026_nc_cat=105\u0026ccb=1-7\u0026_nc_sid=fe756c\u0026_nc_ohc=UbpL4PeIVisQ7kNvgGbWfq6\u0026_nc_oc=AdnEZHRIhO2Ximxac1ycVbewr5YjuipgrZWMwYGOvB1IXT2o15WmBsWPvHz6MP0dA0Q\u0026_nc_zt=24\u0026_nc_ht=scontent-sea1-1.xx\u0026edm=AJdBtusEAAAA\u0026_nc_gid=DzaOZvYQy_jd2--kpcwY3Q\u0026oh=00_AYE1vrvNpdTxAojqiOpyZXwGSr7jvx3ApF9j-bvAWylA6A\u0026oe=67E0BE87",
                        "width": 50
                    }
                }
            },
            "created_at": "2025-03-19T15:22:24.959Z",
            "updated_at": "2025-03-19T15:22:24.959Z"
        },
    },

];
// Move CustomMonthRow to top
const CustomMonthRow = ({ dates, ...props }) => {
    console.log('Received dates:', dates);

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
const EventCard = ({ event }) => {
    return (
        <div className="event-card">
            <div className="event-header">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                >
                    <InstagramIcon sx={{ color: "#E1306C", width: 25, height: 25, }} />
                    {event.page_data?.name}
                </Box>

            </div>
            <div className="event-time">🕒 {moment(event.start).format('HH:mm')}</div>
            <div className="event-image-container">
                <img src={event.s3_url} alt={event.page_data?.name} className="event-image" />
            </div>
            <div className="event-description">  <span dangerouslySetInnerHTML={{ __html: event.comments }} /> </div>
            <button className="edit-button">✏️</button>
        </div>
    );
};

const EventModal = ({ event, open, onClose }) => {
 const [postContent, setPostContent] = useState(event?.comments || "");
    const [posting, setPosting] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
     const [uploadedImageUrl, setUploadedImageUrl] = useState("");
      const [file, setFile] = useState(null);
      const [uploading, setUploading] = useState(false);
      const [loading, setLoading] = useState(false);
      const [selectedPages, setSelectedPages] = useState([]);
      const [brandName, setBrandName] = useState("");
      const fileInputRef = useRef(null);
      const [uploadedFileName, setUploadedFileName] = useState("");
   useEffect(() => {
        setPostContent(event?.comments);
        setUploadedImageUrl(event?.s3_url);
        setUploadedFileName(event?.s3_url?.split('/').pop() || '');
        setBrandName(event?.brand_name);
    }, [event]);
    if (!event) return null;
 
    const handlePublish = async (status = "publish") => {

        setPosting(true);
        const payloadData = {
            social_page_id: event.page_data.social_id,  // Only sending the first selected page for now
            post: {
                s3_url: event.s3_url,
                hashtags: "#sports #fitness",  // Static hashtags
                note: event.comments,
                comments: event.comments, // Use the postContent for comments as well
                brand_name: event.brand_name,
                status: status
            },
        };

        try {
            const token = localStorage.getItem("userToken");
            await axios.post("https://marketincer-apis.onrender.com/api/v1/posts", payloadData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert("Post published successfully!");
            // Optionally, clear form states

            setPosting(false);
        } catch (error) {
            console.error("Error publishing post:", error);
            alert("Failed to publish post");
        }
    };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadedFileName(selectedFile.name);

      // ✅ Auto-upload the file after selection
      handleFileUpload(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadedFileName(droppedFile.name);

      // ✅ Auto-upload the file after drop
      handleFileUpload(droppedFile);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://kitintellect.tech/storage/public/api/upload/aaFacebook",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.url) {
        setUploadedImageUrl(data.url); // ✅ Store uploaded file URL
        toast.success("File uploaded successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("File upload failed!", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleBoxClick = () => {
    fileInputRef.current.click(); // ✅ Triggers the hidden file input
  };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="event-modal-title"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
                outline: 'none'
            }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: 'text.secondary'
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <div>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px", marginRight: "40px", }}>
                        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                            <Avatar sx={{ marginRight: "10px" }} src={event.page_data?.page_info?.picture?.data?.url}></Avatar>
                            <Box>
                                <Typography variant="body1" sx={{ fontSize: "14px", fontWeight: "700" }}>{event.page_data?.name}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "14px" }}>
                                    {event.page_data?.username}
                                </Typography>
                            </Box>
                        </Box>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '24px'
                        }}>
                            <span className="model-time" style={{ colr: "#cdcdcd" }}>
                                <CalendarMonthIcon style={{ marginRight: "3px" }} />{moment(event.start).format('ddd, D MMM [at] HH:mm')}
                            </span>
                        </div>
                    </Box>
                    { isEdit ? (<>
                        <Box sx={{ width: "100%" }}>
            <Box sx={{ width: "100%", position: "relative", marginBottom: "10px" }}>
              <MyEditor value={postContent} onChange={setPostContent} />

              <Box
                display="flex"
                sx={{
                  marginBottom: "0px",
                  position: "absolute",
                  bottom: "-9px",
                  gap: "0px"
                }}
              >
                <MDButton
                  variant="outlined"
                  size="small"
                  sx={{
                    margin: "0.09375rem 1rem",
                    mb: 2,
                    borderRadius: "50px", // ✅ Fully rounded border
                    borderColor: "#B0B0B0", // ✅ Gray border
                    color: "#757575", // ✅ Gray text
                    backgroundColor: "#F0F0F0", // ✅ Light gray background
                    "&:hover": {
                      backgroundColor: "#E0E0E0", // ✅ Slightly darker gray on hover
                    },
                  }}
                  onClick={() => { }}
                  to="/social"
                >
                  # Hashtag
                </MDButton>
                <MDButton
                  variant="outlined"
                  size="small"
                  sx={{
                    margin: "0.09375rem 0rem",
                    mb: 2,
                    borderRadius: "50px", // ✅ Fully rounded border
                    borderColor: "#B0B0B0", // ✅ Gray border
                    color: "#757575", // ✅ Gray text
                    backgroundColor: "#F0F0F0", // ✅ Light gray background
                    "&:hover": {
                      backgroundColor: "#E0E0E0", // ✅ Slightly darker gray on hover
                    },
                  }}
                  onClick={() => { }}
                  to="/social"
                >
                  * AI Assist
                </MDButton>

              </Box>
            </Box>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Brand</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Brand"
                sx={{
                  width: "-webkit-fill-available",
                  height: "50px",
                  margin: "0px",
                  marginTop: "10px"
                }}
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              >
                <MenuItem value={"d-mart"}>D-Mart</MenuItem>
                <MenuItem value={"v-mart"}>V-Mart</MenuItem>
                <MenuItem value={"blinkit"}>Blinkit</MenuItem>
              </Select>
            </FormControl>

            {/* File Upload Section */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              sx={{
                width: "100%",
                padding: "16px",
                border: "1px dashed #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                textAlign: "center",
                cursor: "pointer",
                my: 2,
                margin: "10px",
                marginLeft: "0px",
              }}
              onClick={handleBoxClick}
              onDrop={handleDrop} // ✅ Handles dropped files
              onDragOver={(e) => e.preventDefault()} // ✅ Prevents default drag behavior
            >
              <Typography variant="body1" sx={{ color: "#666" }}>
                Click or Drag & Drop media
              </Typography>

              {uploadedFileName && (
                <Typography variant="body2" sx={{ color: "#444", mt: 1 }}>
                  Selected File: {uploadedFileName}
                </Typography>
              )}

              {uploading && <Typography variant="body2">Uploading...</Typography>}
            </Box>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

          </Box>
                    </>): (<>
                        <p style={{
                        fontSize: '14px',
                        color: '#444',
                        marginBottom: '10px',
                        lineHeight: '1.5'
                    }}>
                        <span dangerouslySetInnerHTML={{ __html: event.comments }} />
                    </p>
                    <div className="model-event-image-container">
                        <img src={event.s3_url} alt={event.page_data?.name} className="model-event-image" />
                    </div>


                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: '16px'
                    }}>
                        <Button
                            variant="link"
                            sx={{ height: "10px", color: "red", marginTop: "12px" }}
                        >
                            Delete
                        </Button>

                        <MDButton
                            variant="outlined"
                            color="info"
                            size="small"
                            sx={{ height: "10px", }}
                            onClick={() => setIsEdit(true)}

                        >
                            Edit
                        </MDButton>
                        <MDButton
                            variant="gradient"
                            size="small"
                            sx={{
                                height: "10px",
                                backgroundColor: "#01cbc6 !important", // Ensures background color applies
                                color: "white !important", // ✅ Forces white text
                                "&:hover": {
                                    backgroundColor: "#00b3ad !important", // Slightly darker on hover
                                },
                            }}
                            onClick={() => handlePublish("publish")}
                            disabled={posting}
                        >
                            Publish
                        </MDButton>
                        <MDButton
                            variant="gradient"
                            size="small"
                            sx={{
                                height: "10px",
                                backgroundColor: "#01cbc6 !important", // Ensures background color applies
                                color: "white !important", // ✅ Forces white text
                                "&:hover": {
                                    backgroundColor: "#00b3ad !important", // Slightly darker on hover
                                },
                            }}
                            onClick={() => handlePublish("shedule")}
                            disabled={posting}
                        >
                            Schedule
                        </MDButton>

                    </div>
                    </>)}
                    
                </div>
            </Box>
        </Modal>
    );
};


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
const CustomToolbar = ({ label, view, onNavigate, onView }) => {
    const [currentView, setCurrentView] = React.useState('month');

    const handleViewChange = (view) => {
        setCurrentView(view);
        onView(view);
    };

    // Configure moment to start week on Monday (ISO standard)
    moment.updateLocale('en', {
        week: {
            dow: 1, // Monday as first day of week
            doy: 4  // First week of year contains January 4th
        }
    });

    const getHeaderLabel = () => {
        const currentDate = moment(label);

        switch (view) {
            case 'month':
                return currentDate.format('MMMM YYYY');
            case 'week':
                //   const start = currentDate.clone().startOf('isoWeek');
                //   const end = currentDate.clone().endOf('isoWeek');

                return label;
            case 'day':
                return currentDate.format('D MMM YYYY');
            default:
                return currentDate.format('MMMM YYYY');
        }
    };

    return (
        <div className="custom-toolbar">
            <div className="toolbar-left">
                <button className="nav-button" onClick={() => onNavigate('PREV')}>
                    ‹
                </button>
                <h2 className="month-label">{getHeaderLabel()}</h2>
                <button className="nav-button" onClick={() => onNavigate('NEXT')}>
                    ›
                </button>
            </div>

            <div className="toolbar-right">
                <div className="view-switcher">
                    <select
                        className="feed-dropdown"
                        onChange={(e) => handleViewChange(e.target.value)}
                        value={currentView}
                    >
                        <option value="feed">Feed View</option>
                        <option value="month">Monthly View</option>
                        <option value="week">Weekly View</option>
                        <option value="day">Daily View</option>
                    </select>
                </div>
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

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const token = localStorage.getItem("userToken");

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

        try {
            setLoading(true);
            const { from, to } = getDateRange(currentDate, currentView);

            const response = await axios.get(
                'https://marketincer-apis.onrender.com/api/v1/posts/search',
                {
                    params: {
                        from,
                        to,
                        account_ids: props.selectedPages
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
    }, [currentView, currentDate, props.selectedPages]);

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
        <div style={{ height: 'auto', minHeight: 600, width: "90%" }}>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                defaultView="month"
                culture="en-GB"
                onView={handleViewChange}
                onNavigate={handleNavigate}
                date={currentDate}
                view={currentView}
                components={{
                    month: {
                        dateHeader: CustomDateCell,
                        row: CustomMonthRow
                    },

                    toolbar: (props) => <CustomToolbar {...props} />,
                    event: EventCard
                }}
                onSelectEvent={handleEventClick}
                style={{
                    margin: '20px',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '15px',
                    fontFamily: 'Arial, sans-serif'
                }}
            />
            <EventModal
                event={selectedEvent}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default CalendarComponent;
