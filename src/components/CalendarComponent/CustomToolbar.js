import MDButton from "@/components/MDButton";
import MDInput from "@/components/MDInput";
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import TuneIcon from '@mui/icons-material/Tune';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from "@mui/material/Menu";
import "flatpickr/dist/themes/material_green.css";
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Flatpickr from "react-flatpickr";
import './style.css';
import {
    Box, IconButton,
    MenuItem,
    Modal,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    ListItemText
} from '@mui/material';


const CustomToolbar = ({
    label,
    date,
    view,
    onNavigate,
    onView,
    onPostTypeChange,
    searchQuery,
    onSearchChange,
    setSelectedPages,
    selectedPages
}) => {
    const [currentView, setCurrentView] = React.useState(view);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [localPostType, setLocalPostType] = useState('feed');
    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(true);
    const open = Boolean(anchorEl);

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


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleViewChange = (view) => {
        setCurrentView(view);
        onView(view);
    };

    const handlePostTypeChange = (event) => {
        const newType = event.target.value;
        setLocalPostType(newType);
        onPostTypeChange(newType); // Propagate up to parent
    };
    // Configure moment to start week on Monday (ISO standard)
    moment.updateLocale('en', {
        week: {
            dow: 1, // Monday as first day of week
            doy: 4  // First week of year contains January 4th
        }
    });

    const getHeaderLabel = () => {
        const currentDate = moment(date);

        switch (view) {
            case 'month':
                return currentDate.format('MMMM YYYY');
            case 'week':
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
                <h2 className="month-label" onClick={() => setOpenDateTimePicker(true)}>{getHeaderLabel()}</h2>
                <button className="nav-button" onClick={() => onNavigate('NEXT')}>
                    ›
                </button>
            </div>

            <Box className="toolbar-right" sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
            }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        displayEmpty
                        multiple
                        value={selectedPages}
                        onChange={(e) => setSelectedPages(e.target.value)}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <span style={{ color: '#aaa' }}>Select Accounts</span>;  // 👈 Placeholder
                            }
                            return pages
                                .filter((page) => selected.includes(page.social_id))
                                .map((p) => p.name)
                                .join(', ');
                        }}
                        sx={{
                            height: "38px",
                            fontSize: "12px",
                            padding: "0px"
                        }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page.social_id} value={page.social_id}>
                                <Checkbox checked={selectedPages.includes(page.social_id)} />
                                <ListItemText primary={page.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <MDInput
                    placeholder="Search Here"
                    size="small"
                    className="calendar-search"
                    sx={{ padding: "6px" }}
                    value={searchQuery}
                    onChange={(e) => {
                        console.log('Typing:', e.target.value);
                        onSearchChange(e.target.value);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchQuery && (
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            onSearchChange('');
                                        }}
                                        sx={{ p: 0.5, mr: -1 }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />

                <div className="view-switcher">
                    <select
                        className="feed-dropdown"
                        value={localPostType}
                        onChange={handlePostTypeChange}
                    >
                        <option value="feed">All Post</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div className="view-switcher">
                    <select
                        className="feed-dropdown"
                        onChange={(e) => handleViewChange(e.target.value)}
                        value={currentView}
                    >
                        <option value="month">Monthly View</option>
                        <option value="week">Weekly View</option>
                        <option value="day">Daily View</option>
                    </select>
                </div>
                <IconButton

                    size="small"
                    disableRipple
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                >
                    <TuneIcon />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            onSearchChange('');
                            setLocalPostType('');
                            onPostTypeChange('');
                        }}
                    >
                        <RestoreIcon sx={{ width: 20, height: 20, marginRight: "15px" }} />{" "}
                        Reset Filters
                    </MenuItem>


                </Menu>
            </Box>
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
                        width: 320,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        padding: "10px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",  // ✅ this centers children horizontally
                    }}
                >

                    <Box sx={{}}>
                        <Flatpickr
                            options={{
                                inline: true,
                                enableTime: false,
                                dateFormat: "Y-m-d",
                            }}
                            value={selectedDateTime}
                            onChange={([date]) => setSelectedDateTime(date)}
                        />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: "20px", width: "100%" }}>
                        <MDButton variant="outlined"
                            sx={{
                                margin: "0.09375rem 1px",
                               
                                border: "1px solid #01cbc6",
                                backgroundColor: "transparent !important",
                                color: "#01cbc6 !important",
                                "&:hover": {
                                    border: "1px solid #00b3ad",
                                    backgroundColor: "transparent !important",
                                },
                            }}
                            onClick={() => setOpenDateTimePicker(false)}>
                            Cancel
                        </MDButton>
                        <MDButton variant="gradient"
                            onClick={() => {
                                if (currentView !== 'month') {
                                    onView('month');
                                    setCurrentView('month');
                                }
                                onNavigate('DATE', selectedDateTime); // Fix this if needed
                                setOpenDateTimePicker(false);
                            }}
                            sx={{
                                margin: "0.09375rem 1px",
                               
                                backgroundColor: "#01cbc6 !important",
                                color: "white !important",
                                "&:hover": {
                                    backgroundColor: "#00b3ad !important",
                                },
                            }}>
                            Save
                        </MDButton>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};


export default CustomToolbar;