import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import Layout from "@/layout/layoutTemplate";
import { eventPageSevices } from "@/store/services";
import ImageSlider from "../components/admin/ImageSlider";
import { getFormatedDate } from "@/store/library/utils";
import { Spinner } from "react-bootstrap";
import { randomKey } from "@/store/library/utils";
import Link from "next/link";
import { convertTo12HourFormat } from "../../store/library/utils";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import showNotification from "@/helpers/show_notification";
import { addToGoogleCalendar } from "@/store/library/utils";
import ReactPlayer from "react-player";

export async function getStaticPaths() {
  const response = await fetch(
    "http://nextupgrad.us/laravel-old/diligent-api/api/getEventManagement"
  );

  const data1 = await response.json();

  const paths = data1.data.map((curElm) => {
    return {
      params: {
        id: curElm.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // const id=context.params.news_id;
  const response = await fetch(
    `http://nextupgrad.us/laravel-old/diligent-api/api/getEventManagement`
  );

  // [https://nextupgrad.us/laravel-old/diligent-api/api/getEventManagement?id=17]

  const data2 = await response.json();

  const filter_data = data2.data;
  // const filter_data = data2.data.filter(element => element.sectionName == "camp_news")
  return {
    props: { filter_data },
    revalidate: 10,
  };
}

const singleEventData = ({ filter_data }) => {
  const router = useRouter();

  let id = router.query?.id;
  const filter_data2 = filter_data.filter((element) => element.id == id);

  console.log("filter_data2", filter_data2[0]);

  const [value, onChange] = useState(new Date());

  const { query, isReady } = useRouter();
  const [eventCategoryData, setEventCategoryData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [isSubmittingLoader, setIsSubmittingLoader] = useState(false);
  const [todayEvent, settodayEvent] = useState([]);
  const [weekEvent, setWeekEvent] = useState([]);
  const [monthEvent, setMonthEvent] = useState([]);
  const [Images, setImages] = useState([]);
  const [show, setShow] = useState(false);

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [promo, setpromo] = useState([]);
  const [Attention, setAttention] = useState("");
  const [eventListLoader, setEventListLoader] = useState(false);

  useEffect(() => {
    console.log(name, email, city, state);
  }, [name, email, city, state]);

  async function handlersvp() {
    const eventId = router.query.id;
    if (name != "" && email != "" && city != "" && state != "") {
      try {
        const formData = new FormData();
        formData.append("eventId", eventId);
        formData.append("userName", name);
        formData.append("email", email);
        formData.append("city", city);
        formData.append("state", state);
        const mediaResp3 = await eventPageSevices.updateRSVP(formData);
        console.log("RSVP", mediaResp3);
      } catch (err) {
        console.log(err);
      }
    } else {
      showNotification("Please fill all fields");
    }
  }

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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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

  useEffect(() => {
    if (isReady) {
      const id = router.query.id;
      getSingleEvent(id);
    }
  }, [isReady, router.query.id]);

  useEffect(() => {
    showEventCategory();
    showAllEvents();
    adminMedia3();
    fetchPromo();
    fetchAttentionText();
  }, []);

  async function fetchAttentionText() {
    try {
      let params = { pageName: event };

      const res = await eventPageSevices.getAttentionText(params);

      const eventAttention = res.data.data.filter(
        (item) => item.page_name == "event"
      );

      setAttention(eventAttention[0].page_text);
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  }

  const showEventCategory = async () => {
    try {
      let params = {};
      const res = await eventPageSevices.adminMedia(params);

      if (res?.data?.success) {
        setEventCategoryData(res?.data?.data);
      }
      filter_data2[0];
    } catch (err) {
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const getSingleEvent = async (id) => {
    try {
      let params = {};
      params.id = id;
      setIsSubmittingLoader(true);
      const newsResp = await eventPageSevices.getSingleEventData(params);
      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data[0];

        setEventData(respData);
        setIsSubmittingLoader(false);
      }
    } catch (error) {
      setIsSubmittingLoader(false);
      console.log(error);
    }
  };

  const showAllEvents = async () => {
    //function to fetch filter data at page load(today , week , month).
    try {
      let params = {};

      setIsSubmittingLoader(true);
      const newsResp = await eventPageSevices.getAllEventList(params);

      if (newsResp?.data?.success) {
        let respData = newsResp?.data?.data?.reverse();
        settodayEvent(newsResp?.data?.today_events);
        setMonthEvent(newsResp?.data?.this_month_events);
        setWeekEvent(newsResp?.data?.this_week_events);

        // setListAllEventData(respData);
        setIsSubmittingLoader(false);
      }
    } catch (error) {
      console.log(error);
      setIsSubmittingLoader(false);
    }
  };

  const handlePrintSelectedQuestions = () => {
    const printStyles = `
      <style>
        @media print {
          .question-container {
            
            page-break-inside: avoid;
          }
        }
        /* Add any additional styles here */
        body {
          
          padding: 15px 10px 5px 15px;
          font-family: "Montserrat", sans-serif;
          
        }
        h2{
          color:#ff651f;
        }
        .question-container{
          text-align: center;
        }
        .question-container2{
          color:#ff651f;
          display:block;
          width:100%;
          position:absolute;
          bottom:0;
          text-align: center;
        }
        
        #lowerText{
          margin-top:40px;
          text-align:left;
        }
        
        .singleeventdate{
          font-size:17px;
          
        }
        
        
      </style>
    `;

    const printContent = `<div><img className="logo" src=${"/logo.png"} /></div>
    <div class="question-container"><div className="container">
    <div className="row">
      <div className="col-md-12">
        <p class="singleeventdate">
          
          ${getFormatedDate(filter_data2[0]?.date, "LL")}
        </p>
      </div>

      <div className="col-md-12">
        <h2 className="fst_Single_event">
          
          ${filter_data2[0]?.event_title}
        </h2>
      </div>
    </div>
  </div>
 

<div className="col-md-4">
  <img
    src=${
      filter_data2[0]?.event_media
        ? process.env.SITE_URL + filter_data2[0]?.event_media
        : "/today_event_img.png"
    }
    
    alt=${filter_data2[0]?.title}
  />
<div id="lowerText">
<p className="fst_event">
    <b>TIME:</b>
    
    ${
      filter_data2[0]?.time ? convertTo12HourFormat(filter_data2[0]?.time) : "-"
    }
  </p>
<p className="fst_event">
    <b>LOCATION:</b>
    
    ${filter_data2[0]?.location_address} <br />
    ${filter_data2[0]?.city}, ${filter_data2[0]?.state},
    ${filter_data2[0]?.zip_code}
  </p>
<p className="fst_event">
    <b>EVENT TYPE:</b>
    
    ${filter_data2[0]?.event_type}
  </p>
  <p className="fst_event">
                                <b>EVENT COST:</b>
                                
                                ${filter_data2[0]?.event_cost}
                              </p>
  <div className="col-md-8">
                              <p className="fst_event">
                              <b>EVENT Description:</b>
                                ${filter_data2[0]?.event_description}
                              </p>
</div>

<div class="question-container2"><p>The Kindness Campaign
703 E 75th St Chicago, IL 60619</p><p>info@kindnesseveryday.org</p></div>
</div>`;

    const printWindow = window.open("", "Print", "height=720,width=1280");
    if (printWindow) {
      printWindow.document.write(
        `<html>
          <head>
            <title>The Kindness Campaign
            703 E 75th St Chicago, IL 60619</title>
            ${printStyles}
          </head>
          <body>
            
            ${printContent}
          </body>
        </html>`
      );
      printWindow.document.close();
      printWindow.print();
    } else {
      warn("Popup blocked in browser");
    }
  };
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
    <Layout title={"single Event"}>
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
            <div className="col-md-4">
              <div className="Event_sidebar_1">
                <div className="container">
                  <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                </div>

                <div className="container">
                  <h3 className="event_categories_wrap">Event Categories</h3>

                  {eventCategoryData?.length ? (
                    <ul className="event_categories_list">
                      {eventCategoryData?.map((item) =>
                        item?.active ? (
                          <li key={randomKey()}>{item?.event_category}</li>
                        ) : null
                      )}
                    </ul>
                  ) : null}

                  <div className="container">
                    <Calendar onChange={onChange} value={value} />
                  </div>
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
                        muted={false}
                        width={"100%"}
                      />
                    </div>
                  </div>
                </section>

                <div className="container">
                  <p className="fst">
                    <p className="fst2">ATTENTION:{Attention}</p>
                  </p>
                </div>
              </div>
            </div>
            {/* Sidebar End */}

            {/* Sidebar Start */}
            <div className="col-md-8">
              <div className="Event_sidebar_2">
                <Tabs>
                  <TabList>
                    {/* <Tab>Today</Tab> */}
                    <Tab>{filter_data2[0]?.event_title}</Tab>
                    <Tab>This Week </Tab>
                    <Tab>This Month</Tab>
                    <p className="upcoming_events_wrap">
                      All Upcoming Events{" "}
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      ></i>
                    </p>
                  </TabList>

                  <TabPanel>
                    {isSubmittingLoader ? (
                      <Spinner
                        style={{
                          width: "100px",
                          height: "100px",
                          color: "#333",
                        }}
                        animation="border"
                      />
                    ) : (
                      <>
                        <div className="container">
                          <div className="row">
                            <div className="col-md-12">
                              <p className="fst_single_event_date">
                                {" "}
                                {getFormatedDate(
                                  filter_data2[0]?.date,
                                  "LL"
                                )}{" "}
                              </p>
                            </div>

                            <div className="col-md-12">
                              <p className="fst_Single_event">
                                {" "}
                                {filter_data2[0]?.event_title}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="container">
                          <div className="row">
                            <div className="col-md-4">
                              <Image
                                src={
                                  filter_data2[0]?.event_media
                                    ? process.env.SITE_URL +
                                      filter_data2[0]?.event_media
                                    : "/today_event_img.png"
                                }
                                width={200}
                                height={250}
                                alt={filter_data2[0]?.title}
                              />

                              <p className="fst_event">
                                <b>TIME:</b>
                                <br />
                                {filter_data2[0]?.time
                                  ? convertTo12HourFormat(filter_data2[0]?.time)
                                  : null}
                              </p>
                              <p className="fst_event">
                                <b>LOCATION:</b>
                                <br />
                                {filter_data2[0]?.location_address} <br />
                                {filter_data2[0]?.city},{" "}
                                {filter_data2[0]?.state},{" "}
                                {filter_data2[0]?.zip_code}
                              </p>
                              <p className="fst_event">
                                <b>EVENT TYPE:</b>
                                <br />
                                {filter_data2[0]?.event_type}
                              </p>
                              <p className="fst_event">
                                <b>EVENT COST:</b>
                                <br />${filter_data2[0]?.event_cost}
                              </p>
                              <div>
                                {" "}
                                <>
                                  <Button
                                    variant="info btn-sm mb-4"
                                    onClick={handleShow}
                                  >
                                    RSVP
                                  </Button>

                                  <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                      <Modal.Title>
                                        {filter_data2[0]?.event_title}
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Name"
                                        aria-describedby="emailHelp"
                                        onChange={(e) => {
                                          setname(e.target.value);
                                        }}
                                      />
                                      <input
                                        type="email"
                                        class="form-control"
                                        placeholder="Email"
                                        aria-describedby="emailHelp"
                                        onChange={(e) => {
                                          setemail(e.target.value);
                                        }}
                                      />

                                      <input
                                        type="text"
                                        class="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="City"
                                        aria-describedby="emailHelp"
                                        onChange={(e) => {
                                          setcity(e.target.value);
                                        }}
                                      />
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="State"
                                        aria-describedby="emailHelp"
                                        onChange={(e) => {
                                          setstate(e.target.value);
                                        }}
                                      />
                                      <div className="d-flex justify-content-center">
                                        <button
                                          className="btn btn-secondary btn-block mb-4"
                                          onClick={handlersvp}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                      >
                                        Close
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                </>
                              </div>

                              <div className="col-12 icon_wrap">
                                <p className="fst_event">
                                  <b>SHARE:</b>
                                </p>
                                <a href="#">
                                  <i
                                    className="fa fa-facebook"
                                    aria-hidden="true"
                                  ></i>
                                  &nbsp;
                                </a>
                                {/* <a href="#">
                                  {" "}
                                  <i
                                    className="fa fa-youtube-play"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </a> */}
                                <a href="#">
                                  <i
                                    className="fa fa-twitter"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </a>
                                <a href="#">
                                  {" "}
                                  <i
                                    className="fa fa-linkedin-square"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp;
                                </a>
                                {/* <a href="#">
                                  
                                  <i
                                    className="fa fa-instagram"
                                    aria-hidden="true"
                                  ></i>
                                  &nbsp;
                                </a> */}
                              </div>

                              <div className="container mt-5">
                                <div className="row">
                                  <p className="download_event">
                                    <span
                                      className="ICAL"
                                      onClick={() =>
                                        handlePrintSelectedQuestions()
                                      }
                                    >
                                      Download event (ICAL)
                                    </span>
                                  </p>
                                  <p className="download_event">
                                    <span
                                      className="ICAL"
                                      onClick={() => {
                                        const title =
                                          filter_data2[0]?.event_title;
                                        const location =
                                          filter_data2[0]?.location_address;
                                        const Date = filter_data2[0]?.date;
                                        const Desc =
                                          filter_data2[0]?.event_type;
                                        addToGoogleCalendar(
                                          title,
                                          location,
                                          Date,
                                          Desc
                                        );
                                      }}
                                    >
                                      Add to calendar (Google)
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-8">
                              <p className="fst_event">
                                {filter_data2[0]?.event_description}
                              </p>

                              <section className="map">
                                <iframe
                                  src={`https://www.google.com/maps?q=${filter_data2[0]?.location_address}&output=embed`}
                                  width={"100%"}
                                  height={250}
                                  style={{ border: 0 }}
                                  allowFullScreen=""
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                />
                              </section>

                              <p className="fst_event">
                                NOTICE: {filter_data2[0]?.notice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
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
  );
};
export default singleEventData;
