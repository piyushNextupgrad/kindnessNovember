import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Head from "next/head";
import Link from "next/link";
import ReactPlayer from "react-player";
import "react-tabs/style/react-tabs.css";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import Layout from "@/layout/layoutTemplate";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { eventPageSevices } from "@/store/services/eventPageService";
import { randomKey } from "@/store/library/utils";
import ImageSlider from "./components/admin/ImageSlider";
import { Spinner } from "react-bootstrap";
import {
  convertTo12HourFormat,
  getFormatedDate,
} from ".././store/library/utils";
import showNotification from "@/helpers/show_notification";
import { AiFillEye } from "react-icons/ai";
import { useRouter } from "next/router";

const Events = () => {
  const [value, onChange] = useState(null);

  const [data, setdata] = useState([]);

  const [listAllEventData, setListAllEventData] = useState([]);
  const [eventListLoader, setEventListLoader] = useState(false);
  const [todayEvent, setTodayEvent] = useState([]);

  const [weekEvent, setWeekEvent] = useState([]);
  const [monthEvent, setMonthEvent] = useState([]);
  const [searchCategoryTitle, setSearchCategoryTitle] = useState();
  const [filteredCategoryName, setFilteredCategoryName] = useState([]);
  const [date, setDate] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [trackFilter, settrackFilter] = useState(null);
  const [Attention, setAttention] = useState("");
  const [promo, setpromo] = useState([]);

  const router = useRouter();

  const [Images, setImages] = useState([]);
  useEffect(() => {
    console.log("Images", Images);
  }, [Images]);

  const adminMedia3 = async () => {
    try {
      const mediaResp3 = await eventPageSevices.adminMedia3("event");
      console.log("IMAGE LIST", mediaResp3?.data?.data);
      setImages(mediaResp3?.data?.data);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };
  async function fetchPromo() {
    try {
      const promo = await eventPageSevices.adminMedia2("event");

      let filterdata = promo.data.data.filter(
        (item) => item.page_name == "event"
      );
      setpromo(filterdata[0]);
      console.log("filterdata[0]", filterdata[0]);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  }

  function resetFilter() {
    setDate("");
  }

  const handleTabSelect = (index) => {
    setActiveTabIndex(index);
  };

  useEffect(() => {
    eventDynamic();
    showAllEvents();
    fetchAttentionText();
    adminMedia3();
    fetchPromo();
  }, []);

  useEffect(() => {
    if (todayEvent.length > 0) {
      // console.log("Today==>", todayEvent);
    }
  }, [todayEvent]);

  useEffect(() => {
    if (monthEvent.length > 0) {
      // console.log("monthEvent==>", monthEvent);
    }
  }, [monthEvent]);

  useEffect(() => {
    if (date != "" && date != null) {
      // console.log("condition hit");

      if (activeTabIndex == 0) {
        if (trackFilter == null) {
          if (date) {
            console.log("Date in tab 1", date);
            showNotification(
              "Please select week or month events to filter. Nothing to filter in today's events"
            );
          }
        } else {
          setDate("");
          showNotification("Please reset the date filter.");
        }
      }

      if (activeTabIndex == 1) {
        const weekFilter = weekEvent.filter((item) => item.date == date);
        if (trackFilter == null) {
          if (weekFilter.length > 0) {
            settrackFilter(1);
            setWeekEvent(weekFilter);
          } else {
            setDate("");
            showNotification("No Events on the selected date.");
          }
        } else {
          showNotification("Please reset the date filter.");
        }
      }

      if (activeTabIndex == 2) {
        const monthFilter = monthEvent.filter((item) => item.date == date);
        if (trackFilter == null) {
          if (monthFilter.length > 0) {
            settrackFilter(1);
            setMonthEvent(monthFilter);
          } else {
            setDate("");
            showNotification("No Events on the selected date.");
          }
        } else {
          showNotification("Please reset the date filter.");
        }
      }
    } else if (date == "") {
      settrackFilter(null);
      setDate(null);
      eventDynamic();
      showAllEvents();
    }
  }, [date]);

  async function fetchAttentionText() {
    try {
      let params = { pageName: event };

      const res = await eventPageSevices.getAttentionText(params);

      const eventAttention = res.data.data.filter(
        (item) => item.page_name == "event"
      );
      console.log("eventAttention", eventAttention[0].page_text);
      setAttention(eventAttention[0].page_text);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  }

  const eventDynamic = async () => {
    try {
      let params = {};
      const res = await eventPageSevices.adminMedia();

      if (res?.data?.success) {
        setdata(res?.data?.data);
      }
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const showAllEvents = async () => {
    //function to fetch filter data at page load(today , week , month).
    try {
      let params = {};

      setEventListLoader(true);
      const newsResp = await eventPageSevices.getAllEventList(params);

      if (newsResp?.data?.success) {
        console.log("showAllevents", newsResp?.data);
        setTodayEvent(newsResp?.data?.today_events);
        setMonthEvent(newsResp?.data?.this_month_events);
        setWeekEvent(newsResp?.data?.this_week_events);
        setListAllEventData(newsResp?.data);

        setEventListLoader(false);
      }
    } catch (error) {
      console.log(error);
      setEventListLoader(false);
    }
  };

  const searchCategory = (searchString) => {
    let filterData = data;
    setSearchCategoryTitle(searchString);
    let filtered = filterData.filter((item) =>
      String(item?.event_category.toLowerCase()).startsWith(
        searchString.toLowerCase()
      )
    );
    setFilteredCategoryName(filtered);
  };

  useEffect(() => {
    if (value) {
      setDate(formatDateToYyyyMmDd(value));
      console.log("date", date);
    }
  }, [value]);

  function formatDateToYyyyMmDd(dateString) {
    // Create a new Date object from the input dateString
    const date = new Date(dateString);

    // Get the year, month, and day components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const day = date.getDate();

    // Ensure that single-digit month and day values have leading zeros
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    // Combine the components into the "yyyy-mm-dd" format
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

    return formattedDate;
  }

  //function to manage Event hits
  const updateEventView = async (eventId, views) => {
    console.log("eventId", eventId);
    console.log("views", views);
    try {
      let currentViews = views == null ? 0 : views;

      const formData = new FormData();
      formData.append("updateId", eventId);
      formData.append("hits", parseInt(currentViews) + 1);

      const resp = await eventPageSevices.updateEventManagement(formData);

      if (resp?.data?.success) {
        router.push(`/event/${eventId}`);
      } else {
        showNotification(response?.data?.message, "Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Events - Kindness Campaign</title>
        <meta name="description" content="Events - Kindness Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout title="Events">
        <section>
          <div className="container">
            <div className="event_wrap_main ">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="about_the_campaign">CALENDAR OF EVENTS</h1>
                  <h4 className="About_heading-1">Kindness Everyday</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-4">
                <div className="Event_sidebar_1">
                  <div className="container">
                    <div className="form-group has-search">
                      <span className="fa fa-search form-control-feedback" />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchCategoryTitle}
                        onChange={(e) => searchCategory(e?.target?.value)}
                      />
                    </div>
                  </div>

                  <div className="container">
                    <h3 className="event_categories_wrap">Event Categories</h3>
                    {searchCategoryTitle?.length ? (
                      filteredCategoryName?.length ? (
                        <ul className="event_categories_list">
                          {filteredCategoryName?.map((item) =>
                            item?.active ? (
                              <li key={randomKey()}>{item?.event_category}</li>
                            ) : null
                          )}
                        </ul>
                      ) : (
                        ""
                      )
                    ) : data?.length ? (
                      <ul className="event_categories_list">
                        {data?.map((item) =>
                          item?.active == "1" ? (
                            <li key={randomKey()}>{item?.event_category}</li>
                          ) : null
                        )}
                      </ul>
                    ) : (
                      ""
                    )}
                    {/* {data?.length ? (
                    <ul className="event_categories_list">
                      {data?.map((item) =>
                        item?.active ? (
                          <li key={randomKey()}>{item?.event_category}</li>
                        ) : null
                      )}
                    </ul>
                  ) : (
                    ""
                  )} */}

                    <div className="calender">
                      <Calendar
                        onChange={(selectedDate) => {
                          onChange(selectedDate);
                        }}
                        value={value}
                        minDate={new Date()}
                      />
                    </div>
                    {trackFilter == 1 ? (
                      <div className="eventCalendarResetBtn">
                        <button
                          className="btn btn-secondary btn-sm mt-2"
                          onClick={resetFilter}
                        >
                          Reset Date Filter
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <section>
                    <div className="container">
                      <div className="about_video_1">
                        <ReactPlayer
                          url={
                            Object.keys(promo).length > 0
                              ? process.env.SITE_URL + promo.promo_video
                              : ""
                          }
                          controls={true}
                          playing={false}
                          muted={true}
                          width={"100%"}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="container">
                    <p className="fst2">ATTENTION:{Attention}</p>
                  </div>
                </div>
              </div>

              {/* Sidebar End */}

              {/* Sidebar Start */}
              <div className="col-md-12 col-lg-8">
                <div className="Event_sidebar_2">
                  <Tabs
                    selectedIndex={activeTabIndex}
                    onSelect={handleTabSelect}
                  >
                    <TabList>
                      <Tab>Today</Tab>
                      <Tab>This Week </Tab>
                      <Tab>This Month</Tab>
                      <Tab>
                        All Upcoming Events &nbsp;
                        <i
                          className="fa fa-angle-double-right"
                          aria-hidden="true"
                        ></i>
                      </Tab>
                    </TabList>

                    <TabPanel>
                      {eventListLoader ? (
                        <Spinner
                          style={{
                            width: "50px",
                            height: "50px",
                            align: "center",
                            color: "#333",
                          }}
                          animation="border"
                        />
                      ) : todayEvent?.length ? (
                        todayEvent?.map((item, index) => (
                          <div className="container" key={randomKey()}>
                            <div className="row">
                              <div className="col-md-12 col-lg-4 mt-4">
                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <Image
                                  className="eventImageIcon"
                                  src={
                                    item?.event_media
                                      ? process.env.SITE_URL + item?.event_media
                                      : "/today_event_img.png"
                                  }
                                  width={200}
                                  height={250}
                                  alt={item?.event_title}
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                />
                                {/* </Link> */}
                              </div>

                              <div className="col-md-12 col-lg-8 mt-4">
                                <p className="fst_event">
                                  TODAY
                                  <span>
                                    {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                  </span>
                                </p>
                                <p className="fst_event">
                                  {item?.date
                                    ? getFormatedDate(item?.date, "M-D-Y")
                                    : null}{" "}
                                  {item?.time
                                    ? convertTo12HourFormat(item?.time)
                                    : null}
                                </p>
                                {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <p
                                  className="fst_event color_heading eventImageIcon"
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                >
                                  {item?.event_title}
                                </p>
                                {/* </Link> */}

                                <p className="fst_event">
                                  <b>Location:</b> {item?.location_address},{" "}
                                  {item?.city}, {item?.state}
                                </p>
                                <p className="fst_event">
                                  <b>Event Type:</b> {item?.event_type}
                                </p>
                                <p className="fst_event">
                                  <b>Event Cost:</b> ${item?.event_cost}
                                  <span>
                                    {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                    <i className="fa fa-eye" aria-hidden="true">
                                      {item?.hits == null ? 0 : item?.hits}
                                    </i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <section className="tabPanel">No events found</section>
                      )}
                    </TabPanel>

                    <TabPanel>
                      {eventListLoader ? (
                        <Spinner
                          style={{
                            width: "50px",
                            height: "50px",
                            align: "center",
                            color: "#333",
                          }}
                          animation="border"
                        />
                      ) : weekEvent?.length ? (
                        weekEvent?.map((item, index) => (
                          <div className="container" key={randomKey()}>
                            <div className="row">
                              <div className="col-md-12 col-lg-4 mt-4">
                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <Image
                                  className="eventImageIcon"
                                  src={
                                    item?.event_media
                                      ? process.env.SITE_URL + item?.event_media
                                      : "/today_event_img.png"
                                  }
                                  width={200}
                                  height={250}
                                  alt={item?.event_title}
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                />
                                {/* </Link> */}
                              </div>

                              <div className="col-md-12 col-lg-8 mt-4">
                                <p className="fst_event">
                                  THIS WEEK{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                  </span>
                                </p>
                                <p className="fst_event">
                                  {item?.date
                                    ? getFormatedDate(item?.date, "M-D-Y")
                                    : null}{" "}
                                  {item?.time
                                    ? convertTo12HourFormat(item?.time)
                                    : null}
                                </p>
                                {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <p
                                  className="fst_event color_heading eventImageIcon"
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                >
                                  {item?.event_title}
                                </p>
                                {/* </Link> */}

                                <p className="fst_event">
                                  <b>Location:</b> {item?.location_address},{" "}
                                  {item?.city}, {item?.state}
                                </p>
                                <p className="fst_event">
                                  <b>Event Type:</b> {item?.event_type}
                                </p>
                                <p className="fst_event">
                                  <b>Cost:</b> ${item?.event_cost}{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                    <i className="fa fa-eye" aria-hidden="true">
                                      {item?.hits == null ? 0 : item?.hits}
                                    </i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <section className="tabPanel">No events found</section>
                      )}
                    </TabPanel>

                    <TabPanel>
                      {eventListLoader ? (
                        <Spinner
                          style={{
                            width: "50px",
                            height: "50px",
                            align: "center",
                            color: "#333",
                          }}
                          animation="border"
                        />
                      ) : monthEvent?.length ? (
                        monthEvent?.map((item, index) => (
                          <div className="container" key={randomKey()}>
                            <div className="row">
                              <div className="col-md-12 col-lg-4 mt-4">
                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <Image
                                  className="eventImageIcon"
                                  src={
                                    item?.event_media
                                      ? process.env.SITE_URL + item?.event_media
                                      : "/today_event_img.png"
                                  }
                                  width={200}
                                  height={250}
                                  alt={item?.event_title}
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                />
                                {/* </Link> */}
                              </div>

                              <div className="col-md-12 col-lg-8 mt-4">
                                <p className="fst_event">
                                  THIS MONTH{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                  </span>
                                </p>
                                <p className="fst_event">
                                  {item?.date
                                    ? getFormatedDate(item?.date, "M-D-Y")
                                    : null}{" "}
                                  {item?.time
                                    ? convertTo12HourFormat(item?.time)
                                    : null}
                                </p>
                                {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <p
                                  className="fst_event color_heading eventImageIcon"
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                >
                                  {item?.event_title}
                                </p>
                                {/* </Link> */}

                                <p className="fst_event">
                                  <b>Location:</b> {item?.location_address},{" "}
                                  {item?.city}, {item?.state}
                                </p>
                                <p className="fst_event">
                                  <b>Event Type:</b> {item?.event_type}
                                </p>
                                <p className="fst_event">
                                  <b>Cost:</b> ${item?.event_cost}{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                    <i className="fa fa-eye" aria-hidden="true">
                                      {item?.hits == null ? 0 : item?.hits}
                                    </i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <section className="tabPanel">No events found</section>
                      )}
                    </TabPanel>
                    <TabPanel>
                      {eventListLoader ? (
                        <Spinner
                          style={{
                            display: "none",
                            width: "50px",
                            height: "50px",
                            align: "center",
                            color: "#333",
                          }}
                          animation="border"
                        />
                      ) : todayEvent?.length ? (
                        todayEvent?.map((item, index) => (
                          <div className="container" key={randomKey()}>
                            <div className="row">
                              <div className="col-md-12 col-lg-4 mt-4">
                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <Image
                                  className="eventImageIcon"
                                  src={
                                    item?.event_media
                                      ? process.env.SITE_URL + item?.event_media
                                      : "/today_event_img.png"
                                  }
                                  width={200}
                                  height={250}
                                  alt={item?.event_title}
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                />
                                {/* </Link> */}
                              </div>

                              <div className="col-md-12 col-lg-8  mt-4">
                                <p className="fst_event">
                                  TODAY{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                  </span>
                                </p>
                                <p className="fst_event">
                                  {item?.date
                                    ? getFormatedDate(item?.date, "M-D-Y")
                                    : null}{" "}
                                  {item?.time
                                    ? convertTo12HourFormat(item?.time)
                                    : null}
                                </p>
                                {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <p
                                  className="fst_event color_heading eventImageIcon"
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                >
                                  {item?.event_title}
                                </p>
                                {/* </Link> */}

                                <p className="fst_event">
                                  <b>Location:</b> {item?.location_address},{" "}
                                  {item?.city}, {item?.state}
                                </p>
                                <p className="fst_event">
                                  <b>Event Type:</b> {item?.event_type}
                                </p>
                                <p className="fst_event">
                                  <b>Cost:</b> ${item?.event_cost}{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                    <i className="fa fa-eye" aria-hidden="true">
                                      {item?.hits == null ? 0 : item?.hits}
                                    </i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : null}
                      {eventListLoader ? (
                        <Spinner
                          style={{
                            display: "none",
                            width: "50px",
                            height: "50px",
                            align: "center",
                            color: "#333",
                          }}
                          animation="border"
                        />
                      ) : weekEvent?.length ? (
                        weekEvent?.map((item, index) => (
                          <div className="container" key={randomKey()}>
                            <div className="row">
                              <div className="col-md-12 col-lg-4 mt-4">
                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <Image
                                  className="eventImageIcon"
                                  src={
                                    item?.event_media
                                      ? process.env.SITE_URL + item?.event_media
                                      : "/today_event_img.png"
                                  }
                                  width={200}
                                  height={250}
                                  alt={item?.event_title}
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                />
                                {/* </Link> */}
                              </div>

                              <div className="col-md-12 col-lg-8 mt-4">
                                <p className="fst_event">
                                  THIS WEEK{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                  </span>
                                </p>
                                <p className="fst_event">
                                  {item?.date
                                    ? getFormatedDate(item?.date, "M-D-Y")
                                    : null}{" "}
                                  {item?.time
                                    ? convertTo12HourFormat(item?.time)
                                    : null}
                                </p>
                                {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <p className="fst_event color_heading eventImageIcon">
                                  {item?.event_title}
                                </p>
                                {/* </Link> */}

                                <p className="fst_event">
                                  <b>Location:</b> {item?.location_address},{" "}
                                  {item?.city}, {item?.state}
                                </p>
                                <p className="fst_event">
                                  <b>Event Type:</b> {item?.event_type}
                                </p>
                                <p className="fst_event">
                                  <b>Cost:</b> {item?.event_cost}{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-plus-square-o"
                                    aria-hidden="true"
                                  ></i> */}
                                    <i className="fa fa-eye" aria-hidden="true">
                                      {item?.hits == null ? 0 : item?.hits}
                                    </i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : null}
                      {eventListLoader ? (
                        <Spinner
                          style={{
                            width: "50px",
                            height: "50px",
                            align: "center",
                            color: "#333",
                          }}
                          animation="border"
                        />
                      ) : monthEvent?.length ? (
                        monthEvent?.map((item, index) => (
                          <div className="container" key={randomKey()}>
                            <div className="row">
                              <div className="col-md-12 col-lg-4 mt-4">
                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <Image
                                  className="eventImageIcon"
                                  src={
                                    item?.event_media
                                      ? process.env.SITE_URL + item?.event_media
                                      : "/today_event_img.png"
                                  }
                                  width={200}
                                  height={250}
                                  alt={item?.event_title}
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                />
                                {/* </Link> */}
                              </div>

                              <div className="col-md-12 col-lg-8 mt-4">
                                <p className="fst_event">
                                  THIS MONTH{" "}
                                  <span>
                                    {/* <i
                                    className="fa fa-download"
                                    aria-hidden="true"
                                  ></i> */}
                                  </span>
                                </p>
                                <p className="fst_event">
                                  {item?.date
                                    ? getFormatedDate(item?.date, "M-D-Y")
                                    : null}{" "}
                                  {item?.time
                                    ? convertTo12HourFormat(item?.time)
                                    : null}
                                </p>
                                {/* <p className="fst_event">{item?.time} 3:00pm - 5:30pm</p> */}

                                {/* <Link href={`${"/event/"}${item?.id}`}> */}
                                <p
                                  className="fst_event color_heading eventImageIcon"
                                  onClick={() =>
                                    updateEventView(item?.id, item?.hits)
                                  }
                                >
                                  {item?.event_title}
                                </p>
                                {/* </Link> */}

                                <p className="fst_event">
                                  <b>Location:</b> {item?.location_address},{" "}
                                  {item?.city}, {item?.state}
                                </p>
                                <p className="fst_event">
                                  <b>Event Type:</b> {item?.event_type}
                                </p>
                                <p className="fst_event">
                                  <b>Cost:</b> {item?.event_cost}{" "}
                                  <span>
                                    {/* <i
                                      className="fa fa-plus-square-o"
                                      aria-hidden="true"
                                    ></i> */}

                                    <i className="fa fa-eye" aria-hidden="true">
                                      {item?.hits == null ? 0 : item?.hits}
                                    </i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : null}
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ImageSlider Images={Images} />
      </Layout>
    </>
  );
};

export default Events;
