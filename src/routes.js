/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import React from "react";
import Dashboard from "@/layouts/dashboard";
import Tables from "@/layouts/tables";
import Calendar from "@/layouts/calendar";
import Media from "@/layouts/media";
import Explore from "@/layouts/explore";
import Analytics from "@/layouts/analytics";
import Reporting from "@/layouts/reporting";
import Billing from "@/layouts/billing";
import Social from "@/layouts/social";
import AddSocialPages from "@/layouts/addSocialPages";
import Members from "@/layouts/members";
import HelpCenter from "@/layouts/helpcenter";
import Chat from "@/layouts/chat";
import RTL from "@/layouts/rtl";
import Notifications from "@/layouts/notifications";
import Profile from "@/layouts/profile";
import SignIn from "@/layouts/authentication/sign-in";
import SignUp from "@/layouts/authentication/sign-up";
import DataDeletion from "@/layouts/dataDeletion";
import PrivacyPolicy from "@/layouts/privacyPolicy";
import TermsAndConditions from "@/layouts/TermsAndConditions";
import Home from "@/layouts/home";

// @mui icons
import Icon from "@mui/material/Icon";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ProtectedRoute from "@/ProtectedRoute";
import ExploreIcon from "@mui/icons-material/Explore";
import AnalyticsIcon from "@mui/icons-material/Analytics";

// Sample isAuthenticated value (replace with actual authentication check)
// const isAuthenticated = false; // Set this to true or false based on user auth state

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    // component: <Dashboard />,
    component: <ProtectedRoute element={<Dashboard />} />, // Protected
    // component: <Dashboard />,
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Calendar",
    key: "calendar",
    // icon: <CalendarTodayIcon />,
    icon: <Icon fontSize="small">calendar_today</Icon>,
    route: "/calendar",
    // component: <Calendar />,
    component: <ProtectedRoute element={<Calendar />} />, // Protected
    roles: ["admin"]
  },
  {
    type: "collapse",
    name: "Media",
    key: "media",
    icon: <Icon fontSize="small">perm_media</Icon>,
    route: "/media",
    component: <Media />,
    component: <ProtectedRoute element={<Media />} />, // Protected
    roles: ["admin", "influencer"]
  },
  {
    type: "collapse",
    name: "Explore",
    key: "explore",
    icon: <Icon fontSize="small">explore</Icon>,
    route: "/explore",
    // component: <Explore />,
    component: <ProtectedRoute element={<Explore />} />, // Protected
    roles: ["admin", "influencer"]
  },
  // {
  //   type: "collapse",
  //   name: "Analytics",
  //   key: "analytics",
  //   icon: <Icon fontSize="small">analytics</Icon>,
  //   route: "/analytics",
  //   // component: <Analytics />,
  //   component: <ProtectedRoute element={<Analytics />} />, // Protected
  // },
  {
    type: "collapse",
    name: "Reports",
    key: "reporting",
    icon: <Icon fontSize="small">summarize</Icon>,
    route: "/reporting",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Reporting />} />, // Protected
    roles: ["admin"]
  },
  {
    type: "collapse",
    name: "Invoice",
    key: "billing",
    icon: <Icon fontSize="small">sell</Icon>,
    route: "/billing",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Billing />} />, // Protected
    roles: ["admin", "influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Social Accounts",
    key: "social_accounts",
    icon: <Icon fontSize="small">connect_without_contact</Icon>,
    route: "/social-pages",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Social />} />, // Protected
    roles: ["influencer"]
  },
  {
    type: "collapse",
    name: "Add Social Accounts",
    key: "add_social_accounts",
    icon: <Icon fontSize="small">connect_without_contact</Icon>,
    route: "/social",
    // component: <Analytics />,
    component: <ProtectedRoute element={<AddSocialPages />} />, // Protected
    roles: ["influencer"]
  },
  {
    type: "collapse",
    name: "Members",
    key: "members",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/people",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Members />} />, // Protected
    roles: ["influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Help Center",
    key: "help_center",
    icon: <Icon fontSize="small">help</Icon>,
    route: "/help",
    // component: <Analytics />,
    component: <ProtectedRoute element={<HelpCenter />} />, // Protected
    roles: ["influencer", "brand"]
  },
  {
    type: "collapse",
    name: "Chat",
    key: "chat",
    icon: <Icon fontSize="small">chat</Icon>,
    route: "/chat",
    // component: <Analytics />,
    component: <ProtectedRoute element={<Chat />} />, // Protected
    roles: ["influencer", "brand"]
  },
  {
    // type: "collapse",
    name: "Profile",
    key: "profile",
    // icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    // component: <Profile />,
    component: <ProtectedRoute element={<Profile />} />, // Protected
  },
  {
    // type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: <SignIn />,
  },
  {
    // type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/sign-up",
    component: <SignUp />,
  },
  {
     // type: "collapse",
     name: "DataDeletion",
     key: "data-deletion",
     icon: <Icon fontSize="small">DataDeletion</Icon>,
     route: "/data-deletion",
     component: <DataDeletion />,
   },
   {
     // type: "collapse",
     name: "Privacy Policy",
     key: "privacy-policy",
     icon: <Icon fontSize="small">Privacy Policy</Icon>,
     route: "/privacy-policy",
     component: <PrivacyPolicy />,
   },
   {
     // type: "collapse",
     name: "Terms And Conditions",
     key: "terms-and-conditions",
     icon: <Icon fontSize="small">Terms And Conditions</Icon>,
     route: "/terms-and-conditions",
     component: <TermsAndConditions />,
   },
  {
    name: "Home",
    key: "home",
    route: "/",
    component: <Home />,
  },
];

export default routes;
