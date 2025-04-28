import MDButton from "@/components/MDButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import ForumIcon from '@mui/icons-material/Forum';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShareIcon from '@mui/icons-material/Share';
import axios from "axios";
import "flatpickr/dist/themes/material_green.css";
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Flatpickr from "react-flatpickr";
import MyEditor from "../Editor";
import './style.css';
import {
    Avatar,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Typography
} from '@mui/material';


const EventModal = ({ event, open, onClose, refreshCalendar }) => {
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
    const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [createPostMode, setCreatePostMode] = useState("");
    useEffect(() => {
        setPostContent(event?.comments);
        setUploadedImageUrl(event?.s3_url);
        setUploadedFileName(event?.s3_url?.split('/').pop() || '');
        setBrandName(event?.brand_name);
    }, [event]);
    if (!event) return null;

    const draftModelOpen = async (action) => {

        setCreatePostMode(action);
        setOpenDateTimePicker(true);

    };


    const draftHandler = async () => {
        setPosting(true);
        const payloadData = {
            social_page_id: event.page_data.social_id,   // Only sending the first selected page for now
            existing_post_id: event.post_id,
            post: {
                s3_url: event.s3_url,
                note: event.comments,
                comments: event.comments, // Use the postContent for comments as well
                brand_name: event.brand_name,
                status: createPostMode,
                scheduled_at: selectedDateTime
            },
        };

        try {
            const token = localStorage.getItem("userToken");
            await axios.post("https://api.marketincer.com/api/v1/posts/schedule", payloadData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert(`Post ${createPostMode} successfully!`);

            setPosting(false);
            setOpenDateTimePicker(false);
            closeHandler();
            refreshCalendar?.();
        } catch (error) {
            console.error(`Error ${createPostMode}  post:`, error);
            alert(`Failed to ${createPostMode} post`);
        }
    };

    const handlePublish = async (status = "publish") => {

        setPosting(true);
       
        const payloadData = {
            social_page_id: event.page_data.social_id,  // Only sending the first selected page for now
            post: {
                s3_url: event.s3_url,
                note: event.comments,
                comments: event.comments, // Use the postContent for comments as well
                brand_name: event.brand_name,
                status: status
            },
        };

        try {
            const token = localStorage.getItem("userToken");
            await axios.post("https://api.marketincer.com/api/v1/posts", payloadData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert("Post published successfully!");
            // Optionally, clear form states
            closeHandler();
            setPosting(false);
            refreshCalendar?.();
        } catch (error) {
            console.error("Error publishing post:", error);
            alert("Failed to publish post");
        }
    };

    const handleUpdate = async () => {
        // if (!event?.post_id) {
        //   alert("No post ID found for update.");
        //   return;
        // }
      
        if (!uploadedImageUrl || !postContent) {
          alert("Please make sure all fields are filled out!");
          return;
        }
      
        setPosting(true);
        const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
        const payloadData = {
          social_page_id: event.page_data.social_id,  // Only sending the first selected page for now
          post: {
            s3_url: uploadedImageUrl,
            note: stripHtmlTags(postContent),        // ✅ Apply to postContent
            comments: stripHtmlTags(postContent),  
            brand_name: brandName,
            status: event.status || "draft", // Keep current status if available
          },
        };
      
        try {
          const token = localStorage.getItem("userToken");
          await axios.patch(`https://api.marketincer.com/api/v1/posts/${event.post_id}`, payloadData, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
      
          alert("Post updated successfully!");
          setPosting(false);
          setIsEdit(false); // Exit edit mode
          refreshCalendar?.();
        } catch (error) {
          console.error("Error updating post:", error);
          alert("Failed to update post");
        }
      };

    const handleDelete = async () => {
        if (!event?.post_id) {
          alert("No post ID found for deletion.");
          return;
        }
      
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;
      
        try {
          const token = localStorage.getItem("userToken");
          await axios.delete(`https://api.marketincer.com/api/v1/posts/${event.post_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
      
          alert("Post deleted successfully!");
          refreshCalendar?.();
        } catch (error) {
          console.error("Error deleting post:", error);
          alert("Failed to delete post");
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
  
    const closeHandler = () => {
        onClose();
        setIsEdit(false);
    }

    return (
        <>
            <Modal
                open={open}
                onClose={closeHandler}
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
                        onClick={closeHandler}
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
                        {isEdit ? (<>
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
                                        <Typography variant="body2" sx={{
                                            color: "#444", mt: 1, whiteSpace: "nowrap", // ✅ Ensures text does not wrap
                                            overflow: "hidden", // ✅ Hides overflow text
                                            textOverflow: "ellipsis", maxWidth: "400px",
                                        }}>
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
                                <MDButton
                                    variant="gradient"
                                    size="small"
                                    sx={{
                                        height: "10px",
                                        backgroundColor: "#01cbc6 !important",
                                        color: "white !important",
                                        "&:hover": {
                                            backgroundColor: "#00b3ad !important",
                                        },
                                    }}
                                    onClick={() => handleUpdate()}
                                    disabled={posting}
                                >
                                    Update
                                </MDButton>
                            </Box>
                        </>) : (<>
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

                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "14px",
                                    color: "#000000",
                                }}
                            >Link in Bio<ErrorOutlineIcon
                                    sx={{ width: 29, height: 29, paddingTop: "15px", border: "none" }}
                                />
                            </Typography>
                            <Typography
                                variant="body2"

                                sx={{
                                    fontSize: "14px",
                                    color: "#545454",
                                    marginBottom: "10px"
                                }}
                            >
                                click <a href='#' sx={{
                                    color: "#4e4e4e",
                                }}>here</a> to update your Link in Bio Settings
                            </Typography>


                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid #f0f0f0',
                                    paddingTop: '16px',
                                }}
                            >
                                {/* Left side: 4 icons separated by | */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#9e9e9e' }}>
                                    <FmdGoodIcon style={{ color: '#9e9e9e' }} />
                                    <span>|</span>
                                    <ForumIcon style={{ color: '#9e9e9e' }} />
                                    <span>|</span>
                                    <ShareIcon style={{ color: '#9e9e9e' }} />
                                    <span>|</span>
                                    <RemoveRedEyeIcon style={{ color: '#9e9e9e' }} />
                                </div>

                                {/* Right side: Buttons */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '8px',
                                    }}
                                >
                                    <Button
                                        variant="link"
                                        sx={{ height: "10px", color: "red", marginTop: "12px" }}
                                        onClick={() => handleDelete()}
                                    >
                                        Delete
                                    </Button>

                                    <MDButton
                                        variant="outlined"
                                        color="info"
                                        size="small"
                                        sx={{ height: "10px" }}
                                        onClick={() => setIsEdit(true)}
                                    >
                                        Edit
                                    </MDButton>

                                    <MDButton
                                        variant="gradient"
                                        size="small"
                                        sx={{
                                            height: "10px",
                                            backgroundColor: "#01cbc6 !important",
                                            color: "white !important",
                                            "&:hover": {
                                                backgroundColor: "#00b3ad !important",
                                            },
                                        }}
                                        onClick={() => handlePublish("publish")}
                                        disabled={posting}
                                    >
                                        { event?.status === 'scheduled' ? 'Publish Now' : 'Publish'}
                                    </MDButton>

                                    <MDButton
                                        variant="gradient"
                                        size="small"
                                        sx={{
                                            height: "10px",
                                            backgroundColor: "#01cbc6 !important",
                                            color: "white !important",
                                            "&:hover": {
                                                backgroundColor: "#00b3ad !important",
                                            },
                                        }}
                                        onClick={() => draftModelOpen("schedule")}
                                        disabled={posting}
                                    >
                                        { event?.status === 'scheduled' ? 'Reschedule' : 'Schedule'} 
                                    </MDButton>
                                </div>
                            </div>
                        </>)}
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openDateTimePicker}
                onClose={() => setOpenDateTimePicker(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "10px",
                    }}
                >
                    <h6 >Select a predefined timeslot</h6>
                    <Flatpickr
                        options={{
                            inline: true,
                            enableTime: true,
                            dateFormat: "Y-m-d H:i",
                        }}
                        value={selectedDateTime}
                        onChange={([date]) => setSelectedDateTime(date)}
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: "20px" }}>
                        <MDButton variant="outlined"
                            sx={{
                                margin: "0.09375rem 1px",
                                mb: 2,
                                border: "1px solid #01cbc6",
                                backgroundColor: "transprant !important", // Ensures background color applies
                                color: "#01cbc6 !important", // ✅ Forces white text
                                "&:hover": {
                                    border: "1px solid #00b3ad",
                                    backgroundColor: "#transprant !important", // Slightly darker on hover
                                },
                            }}
                            onClick={() => setOpenDateTimePicker(false)}>
                            Cancel
                        </MDButton>
                        <MDButton variant="gradient"
                            onClick={draftHandler}
                            sx={{
                                margin: "0.09375rem 1px",
                                mb: 2,
                                backgroundColor: "#01cbc6 !important", // Ensures background color applies
                                color: "white !important", // ✅ Forces white text
                                "&:hover": {
                                    backgroundColor: "#00b3ad !important", // Slightly darker on hover
                                },
                            }}>
                            Save
                        </MDButton>
                    </Box>
                </Box>
            </Modal>
        </>

    );
};

export default EventModal;