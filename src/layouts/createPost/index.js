import React, { useEffect, useRef, useState } from "react";
import MDButton from "@/components/MDButton";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import SellIcon from '@mui/icons-material/Sell';
import {
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Drawer from "@mui/material/Drawer";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MyEditor from "../../components/Editor";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import commentImage from "@/assets/images/instagram-comment-icon.svg";
import shareImage from "@/assets/images/instagram-share-icon.svg";
import likeImage from "@/assets/images/instagram-like-icon.svg";
import saveImage from "@/assets/images/instagram-save-icon.svg";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";


const CreatePost = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [state, setState] = useState({
    right: false,
  });
  const [postContent, setPostContent] = useState("");
  const [open, setOpen] = useState(false);
  const [openAnother, setOpenAnother] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [brandName, setBrandName] = useState("");
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [posting, setPosting] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [createPostMode, setCreatePostMode] = useState("");
  // Set up Quill editor
  const modules = {
    toolbar: [
      [],
      [],
      ['bold', 'italic'], // Only bold and italic
      [],
      [],
      [],
      [] // Add a button for cleaning the editor content
    ],
  };

  const mutation = useMutation({
    mutationFn: (payloadData) => {
      const token = localStorage.getItem("userToken"); // Retrieve token from local storage (or state)

      return axios.post(
        "https://api.marketincer.com/api/v1/posts",
        payloadData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the Bearer token
          },
        }
      );
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
      });
      setOpen(false);
      setPostContent("");
    },
    onError: (error) => {
      toast.error("Failed to Create Post", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Post creation failed", error);
    },
  });

 



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





  // const handleCheckboxChange = (event, pageId) => {
  //   if (event.target.checked) {
  //     setSelectedPages([...selectedPages, pageId]);
  //   } else {
  //     setSelectedPages(selectedPages.filter(id => id !== pageId));
  //   }
  // };

  const handleAvatarClick = (pageId) => {
    setSelectedPages((prevSelected) =>
      prevSelected.includes(pageId)
        ? prevSelected.filter((id) => id !== pageId) // Deselect if already selected
        : [...prevSelected, pageId] // Select if not selected
    );
  };
  const draftModelOpen= async (action) => {
    if (!selectedPages.length || !uploadedImageUrl || !postContent || !brandName) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setCreatePostMode(action);
    setOpenDateTimePicker(true);
   
  };
  const draftHandler = async () => {
   
    if (!selectedPages.length || !uploadedImageUrl || !postContent || !brandName) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setPosting(true);
    const payloadData = {
      social_page_id: selectedPages[0],  // Only sending the first selected page for now
      post: {
        s3_url: uploadedImageUrl,
        hashtags: "#sports #fitness",  // Static hashtags
        note: postContent,
        comments: postContent, // Use the postContent for comments as well
        brand_name: brandName,
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
      // Optionally, clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setPosting(false);
      setOpenDateTimePicker(false);
    } catch (error) {
      console.error(`Error ${createPostMode}  post:`, error);
      alert(`Failed to ${createPostMode} post`);
    }
  };
  const handlePublish = async () => {
    if (!selectedPages.length || !uploadedImageUrl || !postContent || !brandName) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setPosting(true);
    const payloadData = {
      social_page_id: selectedPages[0],  // Only sending the first selected page for now
      post: {
        s3_url: uploadedImageUrl,
        hashtags: "#sports #fitness",  // Static hashtags
        note: postContent,
        comments: postContent, // Use the postContent for comments as well
        brand_name: brandName,
        status: "publish"
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
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setPosting(false);
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post");
    }
  };

  const [pages, setPages] = useState([]);
  const fetchAccountsFromAPI = async () => {

    setLoading(true);
    const token = localStorage.getItem("userToken");
    try {
      // Fetch the accounts from the dummy API
      const response = await fetch(
        `https://api.marketincer.com/api/v1/social_pages/connected_pages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }
      );

      const data = await response.json();
      setPages(data.data.accounts); // Store the fetched accounts in the state

    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchAccountsFromAPI();

  }, []);
  useEffect(() => {

    console.log(selectedPages);
    console.log(pages);
  }, [selectedPages]);

  const handleBoxClick = () => {
    fileInputRef.current.click(); // ✅ Triggers the hidden file input
  };



  const listTwo = () => (
    <>
      <Box
        sx={{
          width: 280,
          height: "100%",
          position: "relative",
          backgroundColor: "rgba(255, 255, 255)",
          borderRadius: "12px",
        }}
        role="presentation"
        className="customClassname"
      >
        {/* Search Field */}
        <TextField
          id="outlined-search"
          sx={{ margin: "15px", width: "-webkit-fill-available" }}
          label="Search field"
          type="search"
        />

        <Box sx={{ mt: 2, margin: "15px" }}>
          {pages.map((page) => (
            <Box
              key={page.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                mb: 1,
                fontSize: "12px",
                cursor: "pointer", // Makes avatars clickable
              }}
              onClick={() => handleAvatarClick(page.social_id)}
            >
              <Box sx={{ position: "relative" }}>
                {/* Avatar */}
                <Avatar
                  src={page.page_info.picture.data.url}
                  alt={page.name}
                  sx={{ width: 40, height: 40, border: "none" }}
                />
                {/* Check Icon Overlay */}
                {selectedPages.includes(page.social_id) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-2px",
                      right: "-7px",
                      background: "white",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{
                        color: "#5ebfa6",
                        fontSize: 20,
                        width: 20,
                        height: 20
                      }}
                    />
                  </Box>


                )}
              </Box>

              {/* Page Name */}
              <Typography
                variant="body1"
                className="hover-effect"
                sx={{
                  fontSize: "14px",
                  color: selectedPages.includes(page.social_id) ? "#5ebfa6" : "inherit",
                  fontWeight: selectedPages.includes(page.social_id) ? "bold" : "normal",
                  transition: "color 0.3s ease-in-out",
                  whiteSpace: "nowrap", // ✅ Ensures text does not wrap
                  overflow: "hidden", // ✅ Hides overflow text
                  textOverflow: "ellipsis", // ✅ Shows '...' when text overflows
                  maxWidth: "150px", // ✅ Adjust as per layout requirements
                  "&:hover": {
                    color: "#5ebfa6",
                    overflow: "hidden", // ✅ Show full text on hover (Optional)
                    whiteSpace: "nowrap", // ✅ Allow text wrapping on hover (Optional)
                  },
                }}
              >
                {page.name}
              </Typography>
            </Box>
          ))}
        </Box>
        {/* Bottom Section with Add Button */}
        <Box sx={{ position: "absolute", bottom: "15px", width: "100%" }}>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <MDButton
              variant="outlined"
              color="info"
              sx={{ margin: "0.09375rem 1rem", mb: 2, mr: 0, ml: 0 }}
              onClick={() => {
                setOpen(false);
                window.location.href = "/social";
              }}
              to="/social" // Define the destination URL
            >
              <AddIcon /> Add Account
            </MDButton>
          </Box>
        </Box>
      </Box>

      {/* Modal for Adding Account */}
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
            onClick={() => setOpenModal(false)}>
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
  const list = () => (
    <>
      <Box
        sx={{
          width: 700,
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
          position: "relative", // Ensure bottom positioning works
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
          <SellIcon sx={{ transform: "scaleX(-1)", marginRight: "3px" }} />
          Add Labels
        </MDButton>

        {/* Social Media Icons */}
        <Box display="flex" alignItems="top" gap={1} mb={2}>
          <Box sx={{ width: "35px" }}>
            {selectedPages.length > 0 && (

              <Avatar sx={{ bgcolor: "#E1306C", width: 32, height: 32, marginTop: "5px" }}>
                <InstagramIcon sx={{ color: "white" }} />
              </Avatar>
            )}

            {/* <Avatar sx={{ bgcolor: "#1877F2", width: 32, height: 32, marginTop: "5px" }}>
              <FacebookIcon sx={{ color: "white" }} />
            </Avatar> */}
          </Box>
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


              <Typography variant="body1" sx={{ color: "#666",  }}>
                Click or Drag & Drop media
              </Typography>

              {uploadedFileName && (
                <Typography variant="body2" sx={{ color: "#444", mt: 1, whiteSpace: "nowrap", // ✅ Ensures text does not wrap
                  overflow: "hidden", // ✅ Hides overflow text
                  textOverflow: "ellipsis",    maxWidth: "400px", }}>
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
        </Box>



        {/* Action Buttons (Right-Aligned) */}
        <Box
          sx={{

            position: "absolute",
            bottom: "15px",
            right: "16px",
            width: "calc(100% - 32px)", // Prevents overflow
          }}
        >
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end", // ✅ Aligns buttons to the right
              alignItems: "center",
              gap: "1rem",

              width: "calc(100% - 32px)", // Prevents overflow
            }}
          >

            <MDButton
              variant="outlined"
              color="info"
              sx={{ margin: "0.09375rem 1px", mb: 2 }}
              onClick={()=> draftModelOpen("draft")}
            >
              Draft
            </MDButton>
            <MDButton
              variant="gradient"
              color="info"
              sx={{ margin: "0.09375rem 1px", mb: 2 }}
              onClick={handlePublish}
              disabled={posting} 
            >
              Publish
            </MDButton>
            <MDButton
              variant="gradient"
              sx={{
                margin: "0.09375rem 1px",
                mb: 2,
                backgroundColor: "#01cbc6 !important", // Ensures background color applies
                color: "white !important", // ✅ Forces white text
                "&:hover": {
                  backgroundColor: "#00b3ad !important", // Slightly darker on hover
                },
              }}
              onClick={()=> draftModelOpen("schedule")}
            >
              Schedule
            </MDButton>
          </Box>
        </Box>
      </Box>
    </>

  );
  const listThree = () => (
    <>
      <Box
        sx={{
          width: 480,
          height: "100%",
          position: "relative",
          backgroundColor: "rgba(255, 255, 255)",
          borderRadius: "12px",
          padding: "0px"
        }}
        role="presentation"
        //   onClick={() => {
        //     setOpen(false);
        //   }}
        className="customClassname"
      //   onClick={toggleDrawer(anchor, false)}
      //   onKeyDown={toggleDrawer(anchor, false)}
      >
        <Card sx={{ m: 2, padding: "0px", border: "1px solid #e5e6eb" }}>
          <CardHeader
            avatar={
              !selectedPages.length || !uploadedImageUrl || !postContent || !brandName ? (
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
              ) : (
                <Avatar src={
                  pages.find((page) => page.social_id === selectedPages[0])?.page_info
                    ?.picture?.data?.url || ""
                } alt="Uploaded" sx={{ width: 40, height: 40 }} />
              )
            }
            action={null}
            title={
              !selectedPages.length || !uploadedImageUrl || !postContent || !brandName ? (
                <Skeleton
                  animation={false}
                  height={10}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              ) : (
                <Typography variant="h6">{pages.find((page) => page.social_id === selectedPages[0])?.name || ""}</Typography>
              )
            }
            subheader={
              !selectedPages.length || !uploadedImageUrl || !postContent || !brandName ? (
                <Skeleton animation={false} height={10} width="40%" />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  
                </Typography>
              )
            }
          />
          {!selectedPages.length || !uploadedImageUrl || !postContent || !brandName ? (
            <Skeleton sx={{ height: 190 }} animation={false} variant="rectangular" />
          ) : (
            <CardMedia
              component="img"
              image={uploadedImageUrl}
              alt="Post Image"
              sx={{ height: 190, margin:"0px", borderRadius: "0px" }}
            />
          )}

          <CardContent>
            {!selectedPages.length || !uploadedImageUrl || !postContent || !brandName ? (
              <>
                <Skeleton animation={false} height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation={false} height={10} width="80%" />
              </>
            ) : (
              <>

                <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "left" , padding: "0px"}}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
                    <img src={likeImage} alt="Social Header" width={24} />
                    <img src={commentImage} alt="Social Header" width={24} />
                    <img src={shareImage} alt="Social Header" width={24} />
                  </Box>
                  <Box>
                    <img src={saveImage} alt="Social Header" width={24} />
                  </Box>
                </CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ display: "flex",}}>
                  <strong>{pages.find((page) => page.social_id === selectedPages[0])?.username || ""} {" "}</strong> 
                  <span
                  style={{ marginLeft: "8px" }}
                    dangerouslySetInnerHTML={{ __html: postContent }} // Render the HTML content
                  />
                </Typography>


              </>


            )}
          </CardContent>


        </Card>

      </Box>
    </>
  );

  return (
    <>
      <MDButton
        variant="gradient"
        color="info"
        sx={{ margin: "0.09375rem 1rem", mb: 2 }}
        onClick={() => {
          setOpen(true);
          setOpenAnother(true);
          fetchAccountsFromAPI();
        }}
      >
        Create Post
      </MDButton>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={() => {
          setOpen(false);
          setPostContent("");
          setOpenAnother(false);
        }}
        // sx={{
        //   width: 500,
        //   flexShrink: 0,
        //   "& .MuiDrawer-paper": { width: 500 },
        // }}
        PaperProps={{
          sx: { width: "75%", background: "transparent" }, // Adjust width as needed
        }}
      >
        <Box
          style={{
            display: "flex",
            gap: "1rem",
            height: "100%",
          }}
        >
          {listTwo()}
          {list()}
          {listThree()}
        </Box>
      </Drawer>
      {/* <Drawer
        anchor={"right"}
        open={openAnother}
        onClose={() => {
          setOpenAnother(false);
          setOpen(false)
        }}
        // sx={{
        //   width: 500,
        //   flexShrink: 0,
        //   "& .MuiDrawer-paper": { width: 500, marginRight : 500 },
        // }}
        PaperProps={{
          sx: { width: "500px", marginRight: "500px" } // Push it beside the first drawer
        }}
      >
        {listTwo()}
      </Drawer> */}
    </>
  );
};

export default CreatePost;
