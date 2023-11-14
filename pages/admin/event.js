import Image from "next/image";
import { getBase64 } from "@/store/library/utils";
import TimePicker from "react-bootstrap-time-picker";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPlayer from "react-player";
import Select from "react-select";
import { eventPageSevices } from "@/store/services/eventPageService";
import { useEffect } from "react";
import AdminLayout from "@/layout/adminLayout";
import showNotification from "@/helpers/show_notification";
import { getFormatedDate, randomKey } from "@/store/library/utils";
import { BsYoutube, BsFileEarmarkImage } from "react-icons/bs";
import { Spinner } from "react-bootstrap";
import Link from "next/link";
const EventPage = () => {
  const [eventType, seteventType] = useState("");
  const [eventdec, seteventdec] = useState("");
  const [active, setactive] = useState("");

  const [newsTitle, setnewsTitle] = useState("");
  const [active2, setactive2] = useState("");
  const [newsMedia, setnewsMedia] = useState("");
  const [promo_video, setpromo_video] = useState("");

  const [eventTitle, seteventTitle] = useState("");
  const [eventDescription3, seteventDescription3] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [time, settime] = useState("");
  const [eventType2, seteventType2] = useState("");
  const [locationAddress, setlocationAddress] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [newsMedia2, setnewsMedia2] = useState("");
  const [zipcode, setzipcode] = useState("");
  const [eventCost, seteventCost] = useState("");
  const [active3, setactive3] = useState("");
  const [adminMediaData, setadminMediaData] = useState([]);
  const [eventpromovideo, seteventpromovideo] = useState("");

  const [editEventTitle, setEditEventTitle] = useState("");
  const [editEventDescription3, setEditEventDescription3] = useState("");
  const [EditAddress, setEditAddress] = useState("");
  const [editStartDate, setEditStartDate] = useState(new Date());

  const [editActive3, setEditActive3] = useState("");
  const [editAdminMediaData, setEditAdminMediaData] = useState([]);
  const [editEventpromovideo, setEditEventpromovideo] = useState("");

  const [downloadLoader, setDownloadLoader] = useState(false);

  //states for update Event Category List Section- piyush
  const [text, settext] = useState();
  const [updateActive, setUpdateActive] = useState(0);
  const [upMedia, setupMedia] = useState();
  const [upMediaPreview, setupMediaPreview] = useState();
  const [upDesc, setupDesc] = useState();

  //states for update Event Image List Section- piyush
  const [text2, settext2] = useState();
  const [updateActive2, setUpdateActive2] = useState(0);
  const [upMedia2, setupMedia2] = useState();
  const [upMediaPreview2, setupMediaPreview2] = useState();
  const [upDesc2, setupDesc2] = useState();
  const [AttentionText, setAttentionText] = useState("");
  const [rsvp, setrsvp] = useState([]);
  const [toggleYoutube, setToggleYoutube] = useState(false);
  const [youtubeLinkCampHeader, setyoutubeLinkCampHeader] = useState("");

  const [youtubeLinkEvent, setyoutubeLinkEvent] = useState("");
  const [toggleEventYoutube, setToggleEventYoutube] = useState(false);
  let total = 0;
  const [EventEditMedia, setEventEditMedia] = useState("");
  const [isSubmitingLoader, setIsSubmitingLoader] = useState(false);

  function countRSVP() {
    rsvp.map((item) => {
      total = total + item.totalRSVP;
    });
    console.log("TOTAL", total);
    return total;
  }

  async function postAttentionData() {
    try {
      setIsSubmitingLoader(true);
      const formData = new FormData();
      formData.append("attentionText", AttentionText);
      formData.append("pageName", "event");

      const resp = await eventPageSevices.updateEventSectionVideo(formData);

      if (resp?.data?.success) {
        setIsSubmitingLoader(false);
        showNotification("Data updated Successfully", "Success");
        setAttentionText("");
      } else {
        setIsSubmitingLoader(false);
        showNotification("Some Data is missing", "Error");
        setAttentionText("");
      }
    } catch (err) {
      setIsSubmitingLoader(false);
      showNotification(err?.message, "Error");
    }
  }

  useEffect(() => {
    if (rsvp.length > 0) {
      console.log("RSVP", rsvp);
    }
  }, [rsvp]);

  async function getRSVP() {
    try {
      const params = {};

      const resp = await eventPageSevices.getRSVP(params);
      setrsvp(resp.data.data);
    } catch (err) {
      showNotification(err?.message, "Error");
    }
  }

  const options_2 = [
    { value: "Arizona", label: "Arizona" },
    { value: "Washington", label: "Washington" },
    { value: "Alabama", label: "Alabama" },
    { value: "Alaska", label: "Alaska" },
    { value: "Arkansas", label: "Arkansas" },
    { value: "California", label: "California" },
    { value: "Colorado", label: "Colorado" },
    { value: "Connecticut", label: "Connecticut" },
    { value: "Delaware", label: "Delaware" },
    { value: "Florida", label: "Florida" },
    { value: "Georgia", label: "Georgia" },
    { value: "Hawaii", label: "Hawaii" },
    { value: "Idaho", label: "Idaho" },
    { value: "Illinois", label: "Illinois" },
    { value: "Indiana", label: "Indiana" },
    { value: "Iowa", label: "Iowa" },
    { value: "Kansas", label: "Kansas" },
    { value: "Kentucky", label: "Kentucky" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Maine", label: "Maine" },
    { value: "Maryland", label: "Maryland" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Michigan", label: "Michigan" },
  ];

  const onchangeFile = async (e, fieldOrSectionName) => {
    if (e.target.files && e.target.files[0]) {
      const img = e?.target?.files[0];

      const fileName = img.name.toLowerCase();

      // Check if the file has an image extension
      if (/\.(jpg|jpeg|png|gif|webp)$/.test(fileName)) {
        if (img.size > 6 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Image size exceeds 6MB. Please choose a smaller image.",
            "Error"
          );
          return;
        }
      }
      if (/\.(mp4|mov|avi|wmv|mkv)$/.test(fileName)) {
        if (img.size > 100 * 1024 * 1024) {
          e.target.value = null;
          showNotification(
            "Video size exceeds 100MB. Please choose a smaller video.",
            "Error"
          );
          return;
        }
      }

      let fileData = await getBase64(img);
      if (fieldOrSectionName == "newsMedia") {
        setupMedia(img);
        setupMediaPreview(fileData);
      }
      if (fieldOrSectionName == "EventImageList") {
        setupMedia2(img);
        setupMediaPreview2(fileData);
      }
    }
  };

  //function to show notification - piyush
  // const notify = (e) => toast.success(e);
  //function to update the table data - piyush
  function editFieldData(id, index, sectionName) {
    if (sectionName == "EventCategoryList") {
      let data = adminMediaData[index];
      data.edit = true;

      adminMediaData[index] = data;
      setadminMediaData([...adminMediaData]);

      settext(data?.event_category);
      setupDesc(data?.event_description);
      setUpdateActive(parseInt(data?.active) ? true : false);
    }
    if (sectionName == "EventImageList") {
      let data = eventImageList[index];
      data.edit = true;

      eventImageList[index] = data;
      seteventImageList([...eventImageList]);

      settext2(data?.event_title);
      setupMedia2(data?.event_media);
      setupMediaPreview2(process.env.SITE_URL + data?.event_media);
      setUpdateActive2(parseInt(data?.active) ? 1 : 0);
    }

    if (sectionName == "EventList") {
      let data = eventList[index];
      data.edit = true;

      eventList[index] = data;
      seteventList([...eventList]);

      setEditEventTitle(data?.event_title);

      // setEditStartDate(data?.date)
      setEditActive3(parseInt(data?.active) ? true : false);
    }

    // showNotification("Item Updated", "Success");
  }

  const updateFormData = async (id, sectionName) => {
    if (sectionName == "EventCategoryList") {
      try {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("updateId", id);
        if (text) {
          formData.append("eventType", text);
        }

        if (upDesc) {
          formData.append("eventDescription", upDesc);
        }

        formData.append("active", updateActive ? 1 : 0);

        const resp = await eventPageSevices.updateEventSection(formData);

        if (resp?.data?.success) {
          setIsSubmitingLoader(false);
          showNotification("Data updated Successfully", "Success");
          adminMedia();

          settext("");
          setupDesc("");
          setUpdateActive("");
          adminMedia();
        } else {
          setIsSubmitingLoader(false);
          showNotification("Some Data is missing", "Error");
        }
      } catch (err) {
        setIsSubmitingLoader(false);
        // Handle any other errors that may occur during the request
        showNotification(err?.message, "Error");
      }
    }
    if (sectionName == "EventImageList") {
      try {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("updateId", id);

        if (text2) {
          formData.append("newsTitle", text2);
        }
        if (upMedia2 && typeof upMedia2 == "object") {
          formData.append("newsMedia", upMedia2);
        }
        // console.log("updateActive2", updateActive2);
        formData.append("active", updateActive2 ? 1 : 0);

        const resp = await eventPageSevices.updateEventSection2(formData);

        if (resp?.data?.success) {
          setIsSubmitingLoader(false);
          adminMedia3();
          setupMedia2("");
          settext2("");
          setUpdateActive2("");
          showNotification("Data updated Successfully", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Some Data is missing", "Error");
        }
      } catch (err) {
        setIsSubmitingLoader(false);
        // Handle any other errors that may occur during the request
        console.log(err);
      }
    }

    if (sectionName == "EventList") {
      try {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("updateId", id);

        if (editEventTitle) {
          formData.append("eventTitle", editEventTitle);
        }
        if (editStartDate) {
          formData.append("date", getFormatedDate(editStartDate, "MM/DD/YYYY"));
        }
        if (editEventDescription3 != "") {
          formData.append("eventDescription", editEventDescription3);
        }
        if (EditAddress != "") {
          formData.append("locationAddress", EditAddress);
        }
        if (EventEditMedia != "") {
          formData.append("eventMedia", EventEditMedia);
        }
        // console.log("editActive3", editActive3);
        formData.append("active", editActive3 ? 1 : 0);

        const resp = await eventPageSevices.updateEventManagement(formData);

        if (resp?.data?.success) {
          setIsSubmitingLoader(false);
          eventListsection();

          setEditEventTitle("");
          setEditStartDate("");
          showNotification("Data updated Successfully", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Some Data is missing", "Error");
        }
      } catch (err) {
        setIsSubmitingLoader(false);
        // Handle any other errors that may occur during the request
        console.log(err);
      }
    }
  };

  //function to delete the table data - piyush
  const deleteData = async (data, sectionName) => {
    if (sectionName == "EventCategoryList") {
      try {
        setIsSubmitingLoader(true);
        const params = { delId: data };
        const delResp = await eventPageSevices.updateEventSection(params);
        console.log("delResp", delResp);
        const newAdminMediaData = adminMediaData.filter(
          (item) => item.id != data
        );
        if (delResp.data.success) {
          setadminMediaData(newAdminMediaData);
          setIsSubmitingLoader(false);
          showNotification("Item deleted", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Item not deleted", "Error");
        }
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    } else if (sectionName == "EventImageList") {
      try {
        setIsSubmitingLoader(true);
        const params = { delId: data };
        const delResp = await eventPageSevices.updateEventSection2(params);

        const newEventImageList = eventImageList.filter(
          (item) => item.id != data
        );
        if (delResp.data.success) {
          seteventImageList(newEventImageList);
          setIsSubmitingLoader(false);
          showNotification("Item deleted", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Item not deleted", "Error");
        }
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    } else if (sectionName == "EventList") {
      try {
        setIsSubmitingLoader(true);
        const params = { delId: data };
        const delResp = await eventPageSevices.updateEventManagement(params);

        const newEventList = eventList.filter((item) => item.id != data);
        if (delResp.data.success) {
          seteventList(newEventList);
          setIsSubmitingLoader(false);
          showNotification("Item deleted", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Item not deleted", "Error");
        }
      } catch (error) {
        setIsSubmitingLoader(false);
        console.log(error);
      }
    }
  };

  const updateEventPageSec1 = async () => {
    try {
      setIsSubmitingLoader(true);
      if (eventType && eventdec) {
        const formData = new FormData();

        formData.append("eventType", eventType);
        formData.append("eventDescription", eventdec);
        formData.append("active", active ? 1 : 0);

        const resp = await eventPageSevices.updateEventSection(formData);

        if (resp?.data?.success) {
          setIsSubmitingLoader(false);
          showNotification("Data updated Successfully", "Success");
          seteventType("");
          seteventdec("");
          setactive("");
          adminMedia();
        } else {
          setIsSubmitingLoader(false);
          showNotification("Some Data is missing", "Error");
        }
      } else {
        setIsSubmitingLoader(false);
        showNotification("All fields is required", "Error");
      }
    } catch (err) {
      setIsSubmitingLoader(false);
      // Handle any other errors that may occur during the request
      showNotification(err?.message, "Error");
    }
  };

  const updateEventPageSec2 = async () => {
    if (newsTitle != "" && upMedia != "") {
      try {
        setIsSubmitingLoader(true);
        const formData = new FormData();

        formData.append("newsTitle", newsTitle);
        formData.append("newsMedia", upMedia);
        formData.append("active", active2 ? 1 : 0);

        const resp = await eventPageSevices.updateEventSection2(formData);
        console.log(resp);
        if (
          resp?.data.success == true ||
          resp.data.message == "New Record Created"
        ) {
          setIsSubmitingLoader(false);
          adminMedia3();
          setnewsMedia("");
          setnewsTitle("");
          showNotification("Data updated Successfully", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Some Data is missing", "Error");
        }
      } catch (err) {
        setIsSubmitingLoader(false);
        // Handle any other errors that may occur during the request
        console.log(err);
      }
    } else {
      showNotification("Please fill all the fields", "Error");
    }
  };

  const updateEventPageVideo = async () => {
    if (toggleYoutube == true) {
      console.log("youtube upload");
      try {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("pageName", "event");
        formData.append("eventPromoVideo", youtubeLinkCampHeader);

        const resp = await eventPageSevices.updateEventSectionVideo(formData);
        console.log("event promo", resp);
        if (resp.status == 200) {
          setIsSubmitingLoader(false);
          setpromo_video("");
          adminMedia2();
          showNotification("Youtube media updated", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Youtube media update Failed", "Error");
        }
      } catch (err) {
        setIsSubmitingLoader(false);
        // Handle any other errors that may occur during the request
        console.log(err);
      }
    } else {
      try {
        setIsSubmitingLoader(true);
        const formData = new FormData();
        formData.append("pageName", "event");
        formData.append("eventPromoVideo", promo_video);

        const resp = await eventPageSevices.updateEventSectionVideo(formData);
        console.log("event promo", resp);
        if (resp.status == 200) {
          setIsSubmitingLoader(false);
          setpromo_video("");
          adminMedia2();
          showNotification("Video uploaded Successfully", "Success");
        } else {
          setIsSubmitingLoader(false);
          showNotification("Video upload Failed", "Error");
        }
      } catch (err) {
        setIsSubmitingLoader(false);
        // Handle any other errors that may occur during the request
        console.log(err);
      }
    }
  };

  const updateEventManagementSection = async () => {
    if (toggleEventYoutube) {
      if (
        eventTitle != "" &&
        eventDescription3 != "" &&
        eventType2 != "" &&
        locationAddress != "" &&
        city != "" &&
        state != "" &&
        zipcode != "" &&
        eventCost != ""
      ) {
        try {
          setIsSubmitingLoader(true);
          // console.log("eventType2", eventType2);
          const formData = new FormData();
          formData.append("eventTitle", eventTitle);
          formData.append("eventDescription", eventDescription3);
          formData.append("date", getFormatedDate(startDate, "MM/DD/YYYY"));
          formData.append("time", time);
          formData.append("eventType", eventType2);
          formData.append("locationAddress", locationAddress);
          formData.append("city", city);
          formData.append("state", state);
          formData.append("eventMedia", youtubeLinkEvent);
          formData.append("zipcode", zipcode);
          formData.append("eventCost", eventCost);
          formData.append("active", active3 ? 1 : 0);

          const resp = await eventPageSevices.updateEventManagement(formData);

          if (resp?.data?.success) {
            setIsSubmitingLoader(false);
            eventListsection();
            showNotification("Record Added Successfully", "Success");
            seteventTitle("");
            seteventDescription3("");
            setStartDate("");
            settime("");
            seteventType2("");
            setlocationAddress("");
            setcity("");
            setstate("");
            setnewsMedia("");
            setzipcode("");
            seteventCost("");
            setactive3(false);
          } else {
            setIsSubmitingLoader(false);
            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          setIsSubmitingLoader(false);
          // Handle any other errors that may occur during the request
          console.log(err);
        }
      } else {
        setIsSubmitingLoader(false);
        showNotification("Please fill all fields", "Error");
      }
    } else {
      if (
        eventTitle != "" &&
        eventDescription3 != "" &&
        eventType2 != "" &&
        locationAddress != "" &&
        city != "" &&
        state != "" &&
        zipcode != "" &&
        eventCost != ""
      ) {
        try {
          setIsSubmitingLoader(true);
          // console.log("eventType2", eventType2);
          const formData = new FormData();
          formData.append("eventTitle", eventTitle);
          formData.append("eventDescription", eventDescription3);
          formData.append("date", getFormatedDate(startDate, "MM/DD/YYYY"));
          formData.append("time", time);
          formData.append("eventType", eventType2);
          formData.append("locationAddress", locationAddress);
          formData.append("city", city);
          formData.append("state", state);
          formData.append("eventMedia", newsMedia2);
          formData.append("zipcode", zipcode);
          formData.append("eventCost", eventCost);
          formData.append("active", active3 ? 1 : 0);

          const resp = await eventPageSevices.updateEventManagement(formData);

          if (resp?.data?.success) {
            setIsSubmitingLoader(false);
            eventListsection();
            showNotification("Record Added Successfully", "Success");
            seteventTitle("");
            seteventDescription3("");
            setStartDate("");
            settime("");
            seteventType2("");
            setlocationAddress("");
            setcity("");
            setstate("");
            setnewsMedia("");
            setzipcode("");
            seteventCost("");
            setactive3(false);
          } else {
            setIsSubmitingLoader(false);
            showNotification(resp?.data?.message, "Error");
          }
        } catch (err) {
          setIsSubmitingLoader(false);
          // Handle any other errors that may occur during the request
          console.log(err);
        }
      } else {
        setIsSubmitingLoader(false);
        showNotification("Please fill all fields", "Error");
      }
    }
  };

  const adminMedia = async () => {
    try {
      setIsSubmitingLoader(true);
      const mediaResp = await eventPageSevices.adminMedia();

      if (mediaResp?.data?.data.length > 0) {
        setIsSubmitingLoader(false);
        setadminMediaData(mediaResp?.data?.data);
        console.log("Event cat List", mediaResp?.data?.data);
      } else {
        setIsSubmitingLoader(false);
      }
    } catch (err) {
      setIsSubmitingLoader(false);
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  const adminMedia2 = async () => {
    try {
      setIsSubmitingLoader(true);
      const mediaResp2 = await eventPageSevices.adminMedia2();

      if (mediaResp2?.data?.success) {
        setIsSubmitingLoader(false);
        let campignNews = mediaResp2?.data?.data?.filter(
          (item) => item?.page_name == "event"
        );

        seteventpromovideo(campignNews[0]?.promo_video);
      } else {
        setIsSubmitingLoader(false);
        seteventpromovideo("");
      }
    } catch (err) {
      setIsSubmitingLoader(false);
      // Handle any other errors that may occur during the request
      console.log(err?.message);
    }
  };

  const [eventImageList, seteventImageList] = useState([]);
  const adminMedia3 = async () => {
    try {
      setIsSubmitingLoader(true);
      const mediaResp3 = await eventPageSevices.adminMedia3("event");
      setIsSubmitingLoader(false);
      seteventImageList(mediaResp3?.data?.data);
    } catch (err) {
      setIsSubmitingLoader(false);
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };
  const [eventList, seteventList] = useState([]);

  const eventListsection = async () => {
    try {
      setIsSubmitingLoader(true);
      const eventListresp = await eventPageSevices.eventList();
      console.log("eventListresp", eventListresp);
      if (eventListresp.data.success) {
        setIsSubmitingLoader(false);
        seteventList(eventListresp?.data?.data);
      } else {
        setIsSubmitingLoader(false);
      }
    } catch (err) {
      setIsSubmitingLoader(false);
      // Handle any other errors that may occur during the request
      console.log(err);
    }
  };

  useEffect(() => {
    adminMedia3();
    adminMedia();
    adminMedia2();
    eventListsection();
    getRSVP();
  }, []);

  let eventTypeDropDownOptions = [];
  //event type is a string in database
  //in value added eventcategory instead of id
  if (adminMediaData?.length) {
    eventTypeDropDownOptions = adminMediaData
      .filter((item) => item.active === "1") // Filter items based on the condition
      .map((item) => ({
        value: item.event_category,
        label: `${item.event_category}`,
      }));
  }

  const downloadSignupReport = async () => {
    try {
      setDownloadLoader(true);
      let resp = await eventPageSevices.downloadEventListData();

      if (resp?.data?.success) {
        let a = document.createElement("a");
        a.href = process.env.SITE_URL + resp?.data?.download_link;
        a.click();
        setDownloadLoader(false);
      } else {
        setDownloadLoader(false);
      }
    } catch (error) {
      setDownloadLoader(false);
      console.log(error);
    }
  };

  const downloadEventUserData = async () => {
    try {
      setDownloadLoader(true);
      let resp = await eventPageSevices.downloadEventListData();

      if (resp?.data?.success) {
        let a = document.createElement("a");
        a.href = process.env.SITE_URL + resp?.data?.download_link;
        a.click();
        setDownloadLoader(false);
      } else {
        setDownloadLoader(false);
      }
    } catch (error) {
      setDownloadLoader(false);
      console.log(error);
    }
  };

  return (
    <>
      <AdminLayout title={"Event page"}>
        <main role="main">
          {isSubmitingLoader ? (
            <div className="overlay">
              <div className="spinner-container">
                <Spinner
                  className="loaderSpinnerPiyush"
                  style={{
                    width: "100px",
                    height: "100px",
                    color: "#0a1c51fc",
                  }}
                  animation="border"
                />
              </div>
            </div>
          ) : null}
          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Event
              Categories
            </h2>
            <div className="container">
              <div className="row">
                <p>Event Category List</p>
                <div className="col-md-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Event Category Type</th>
                        <th>Description</th>
                        <th>Active</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminMediaData?.length > 0
                        ? adminMediaData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1} </td>
                              {item?.edit ? (
                                <>
                                  <td>
                                    <input
                                      type="text"
                                      name="total"
                                      value={text}
                                      onChange={(e) =>
                                        settext(e?.target?.value)
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      name="Service"
                                      value={upDesc}
                                      onChange={(e) =>
                                        setupDesc(e?.target?.value)
                                      }
                                    />
                                  </td>

                                  <td>
                                    <input
                                      type="checkbox"
                                      name="status"
                                      checked={updateActive}
                                      id="active"
                                      onChange={(e) =>
                                        setUpdateActive(e?.target?.checked)
                                      }
                                    />
                                    {/* <span className="btn ">
                                      {item?.active ? "Yes" : "No"}
                                    </span> */}
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{item?.event_category}</td>
                                  <td>{item?.event_description}</td>
                                  <td>
                                    {parseInt(item?.active) ? "Yes" : "No"}
                                  </td>
                                </>
                              )}

                              <td>
                                <button
                                  className="btn btn-primary mx-1"
                                  onClick={() =>
                                    item?.edit
                                      ? updateFormData(
                                          item?.id,
                                          "EventCategoryList"
                                        )
                                      : editFieldData(
                                          item?.id,
                                          index,
                                          "EventCategoryList"
                                        )
                                  }
                                >
                                  {item?.edit ? (
                                    <i
                                      className="fa fa-floppy-o"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <i
                                      className="fa fa-pencil-square-o"
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>

                                <button
                                  className="btn btn-secondary"
                                  onClick={() =>
                                    deleteData(item.id, "EventCategoryList")
                                  }
                                >
                                  <i
                                    className="fa fa-trash-o"
                                    aria-hidden="true"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="typeText">
                          Event Type
                        </label>
                        <input
                          type="text"
                          value={eventType}
                          onChange={(e) => seteventType(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="typeText">
                          Event Description
                        </label>
                        <textarea
                          className="form-control "
                          placeholder="Type here"
                          value={eventdec}
                          onChange={(e) => seteventdec(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-check-label">Active &nbsp;</label>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setactive(e?.target?.checked)}
                      />
                    </div>

                    <div className="col-md-6">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        style={{ float: "right", marginTop: "20px" }}
                        onClick={updateEventPageSec1}
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Event
              Promotions Images
            </h2>
            <div className="container">
              {toggleYoutube ? (
                <>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="typeText">
                          Youtube Media
                        </label>
                      </div>
                      <div className="col-md-3">
                        {youtubeLinkCampHeader != ""
                          ? showVideo(youtubeLinkCampHeader)
                          : showVideo("no-video")}
                      </div>
                      <div className="col-md-3">
                        <input
                          className="form-control"
                          type="text"
                          value={youtubeLinkCampHeader}
                          onChange={(e) => {
                            const inputValue = e.target.value.trim();
                            setyoutubeLinkCampHeader(inputValue);
                          }}
                        />
                        <span className="mbSpan">Add YouTube video link.</span>
                      </div>

                      <div className="col-md-3">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={updateEventPageVideo}
                        >
                          Update Site
                        </button>
                      </div>
                    </div>
                    <p className="text-center my-4">OR</p>
                    <div className="text-center">
                      <BsFileEarmarkImage className="youTubeLogo" />
                      <span
                        className="mx-4 custom-youtube-toggleLink"
                        onClick={() => {
                          toggleYoutube
                            ? setToggleYoutube(false)
                            : (setToggleYoutube(true),
                              setyoutubeLinkCampHeader(""));
                        }}
                      >
                        Custom Video
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-4">
                      <p>Event Promo Video</p>
                      {/* <Image
                    src={
                      eventpromovideo
                        ? process.env.API_URL + eventpromovideo
                        : "/no-img.jpg"
                    }
                    width={80}
                    height={80}
                    alt="Picture of the author"
                  /> */}

                      <ReactPlayer
                        url={
                          eventpromovideo
                            ? process.env.SITE_URL + eventpromovideo
                            : ""
                        }
                        playing={false}
                        muted={true}
                        width={"50%"}
                        height={80}
                      />

                      {/* <video
                    autoPlay
                    width="100%"
                    height={300}
                    controls="true"
                    muted
                  >
                    <source
                      src={
                        eventpromovideo
                          ? process.env.SITE_URL + eventpromovideo
                          : ""
                      }
                      type="video/*"
                    />
                  </video> */}
                    </div>

                    <div className="col-md-4">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const img = e?.target?.files[0];

                          const fileName = img.name.toLowerCase();
                          if (/\.(tiff|eps|avi|wmv|bmp|flv)$/.test(fileName)) {
                            e.target.value = null;
                            showNotification(
                              "File format not supported.",
                              "Error"
                            );
                            return;
                          } else {
                            if (e.target.files[0]?.size < 100 * 1024 * 1024) {
                              setpromo_video(e.target.files[0]);
                            } else {
                              showNotification(
                                "File size exceeds 100MB. Please choose a smaller file",
                                "Error"
                              );

                              // Clear the file input
                              e.target.value = null;
                            }
                          }
                        }}
                      />
                      <span className="mbSpan">
                        Max file size for video is 100 MB
                      </span>
                    </div>

                    <div className="col-md-4 text-right">
                      <button
                        type="button"
                        className="btn btn btn-outline-primary align-bottom"
                        onClick={updateEventPageVideo}
                      >
                        Update Site
                      </button>
                    </div>
                    <div
                      style={{ width: "100%" }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <BsYoutube className="youTubeLogo" />
                      <span
                        className="mx-4 custom-youtube-toggleLink"
                        onClick={() => {
                          toggleYoutube
                            ? setToggleYoutube(false)
                            : setToggleYoutube(true);
                        }}
                      >
                        YouTube Link
                      </span>
                    </div>
                  </div>
                </>
              )}
              <br />
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <p>Event Image List</p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Hits</th>
                          <th>Title</th>
                          <th>Media Type</th>
                          <th>Upload Date</th>
                          <th>Active</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventImageList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.hits}</td>
                            {item?.edit ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    value={text2}
                                    onChange={(e) => settext2(e?.target?.value)}
                                  />
                                </td>
                                <td>
                                  <Image
                                    src={
                                      upMediaPreview2
                                        ? upMediaPreview2
                                        : "/no-img.jpg"
                                    }
                                    width={80}
                                    height={80}
                                  />
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      onchangeFile(e, "EventImageList")
                                    }
                                  />
                                </td>
                                <td></td>
                                <td>
                                  <input
                                    type="checkbox"
                                    name="status"
                                    checked={updateActive2}
                                    id="active"
                                    onChange={(e) =>
                                      setUpdateActive2(e?.target?.checked)
                                    }
                                  />
                                  {/* <span className="btn ">
                                      {item?.active ? "Yes" : "No"}
                                    </span> */}
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item?.event_title}</td>
                                <td>{item?.event_media}</td>
                                <td>
                                  {getFormatedDate(
                                    item?.updated_at,
                                    "MM/DD/YYYY"
                                  )}
                                </td>

                                <td>{parseInt(item?.active) ? "Yes" : "No"}</td>
                              </>
                            )}

                            <td>
                              <button
                                className="btn btn-primary mx-1"
                                onClick={() =>
                                  item?.edit
                                    ? updateFormData(item?.id, "EventImageList")
                                    : editFieldData(
                                        item?.id,
                                        index,
                                        "EventImageList"
                                      )
                                }
                              >
                                {item?.edit ? (
                                  <i
                                    className="fa fa-floppy-o"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <i
                                    className="fa fa-pencil-square-o"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>

                              <button
                                className="btn btn-secondary"
                                onClick={() =>
                                  deleteData(item.id, "EventImageList")
                                }
                              >
                                <i
                                  className="fa fa-trash-o"
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row">
                  <p>Event Title</p>
                  <div className="col-md-12">
                    <input
                      type="text"
                      value={newsTitle}
                      onChange={(e) => setnewsTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <p>Event Media</p>
                  <Image
                    src={upMediaPreview ? upMediaPreview : "/no-img.jpg"}
                    width={80}
                    height={80}
                    alt="Picture of the author"
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="file"
                    onChange={(e) => onchangeFile(e, "newsMedia")}
                  />
                  <span className="mbSpan">
                    Max file size for image is 6 MB
                  </span>
                </div>

                <div className="col-md-4">
                  <label className="form-check-label">Active &nbsp;</label>
                  <input
                    type="checkbox"
                    id="flexCheckDefault"
                    onChange={(e) => setactive2(e?.target?.checked)}
                  />
                </div>
                <br />
                <div className="col-md-12">
                  <div className="text-right">
                    <button
                      type="button"
                      className="btn btn btn-outline-primary align-bottom"
                      onClick={updateEventPageSec2}
                    >
                      Update Site
                    </button>
                  </div>
                </div>
                <div className="col-md">
                  <p>Attention Text</p>
                  <input
                    value={AttentionText}
                    type="text"
                    onChange={(e) => setAttentionText(e.target.value)}
                  />
                </div>

                <div className="col-md-4 text-right mt-5">
                  <button
                    type="button"
                    className="btn btn btn-outline-primary align-bottom"
                    onClick={postAttentionData}
                  >
                    Update Attention Text
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="panel important">
            <h2>
              {" "}
              <i className="fa fa-hand-o-right" aria-hidden="true"></i> Event
              Management
            </h2>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <p>Event List</p>
                </div>

                <div className="col-md-6">
                  {downloadLoader ? (
                    <Spinner
                      style={{ width: "50px", height: "50px", color: "#333" }}
                      animation="border"
                    />
                  ) : (
                    <Link href="#!">
                      <p
                        onClick={downloadSignupReport}
                        style={{ float: "right" }}
                      >
                        Download List
                      </p>
                    </Link>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Hits</th>
                        <th>Event Title</th>
                        <th># of RSVP</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Address</th>
                        <th>Media</th>
                        <th>Active</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {eventList?.length
                          ? console.log("EventList", eventList)
                          : null}
                      </>
                      {eventList?.length &&
                        eventList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1} </td>
                            <td>{item.hits}</td>
                            {item?.edit ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    value={editEventTitle}
                                    onChange={(e) =>
                                      setEditEventTitle(e?.target?.value)
                                    }
                                  />
                                </td>
                                <td>0</td>
                                <td>
                                  <DatePicker
                                    selected={editStartDate}
                                    onChange={(date) => setEditStartDate(date)}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={editEventDescription3}
                                    onChange={(e) =>
                                      setEditEventDescription3(e?.target?.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={EditAddress}
                                    onChange={(e) =>
                                      setEditAddress(e?.target?.value)
                                    }
                                  />
                                </td>
                                <td>
                                  <Image
                                    src={
                                      process.env.SITE_URL + item.event_media
                                    }
                                    width={100}
                                    height={80}
                                  ></Image>
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      const img = e?.target?.files[0];

                                      const fileName = img.name.toLowerCase();

                                      // Check if the file has an image extension
                                      if (
                                        /\.(jpg|jpeg|png|gif|webp)$/.test(
                                          fileName
                                        )
                                      ) {
                                        if (img.size > 6 * 1024 * 1024) {
                                          e.target.value = null;
                                          showNotification(
                                            "Image size exceeds 6MB. Please choose a smaller image.",
                                            "Error"
                                          );
                                          return;
                                        } else {
                                          setEventEditMedia(e.target.files[0]);
                                        }
                                      } else if (
                                        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|js|jsx|php|mp4|mov|avi|wmv|mkv|bmp|flv|tiff|eps)$/.test(
                                          fileName
                                        )
                                      ) {
                                        e.target.value = null;
                                        showNotification(
                                          "Unsupported File type.",
                                          "Error"
                                        );
                                        return;
                                      }
                                    }}
                                  />
                                </td>

                                <td>
                                  <input
                                    type="checkbox"
                                    id="flexCheckDefault"
                                    checked={editActive3}
                                    onChange={(e) =>
                                      setEditActive3(e.target.checked)
                                    }
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item?.event_title}</td>
                                <td>0</td>
                                <td>
                                  {getFormatedDate(item?.date, "MM/DD/YYYY")}
                                </td>
                                <td>{item?.event_description}</td>
                                <td>{item?.location_address}</td>
                                <td>{item?.media_type}</td>
                                <td>{parseInt(item?.active) ? "Yes" : "No"}</td>
                              </>
                            )}

                            <td>
                              <button
                                className="btn btn-primary mx-1"
                                onClick={() =>
                                  item?.edit
                                    ? updateFormData(item?.id, "EventList")
                                    : editFieldData(
                                        item?.id,
                                        index,
                                        "EventList"
                                      )
                                }
                              >
                                {item?.edit ? (
                                  <i
                                    className="fa fa-floppy-o"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <i
                                    className="fa fa-pencil-square-o"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>

                              <button
                                className="btn btn-secondary"
                                onClick={() => deleteData(item.id, "EventList")}
                              >
                                <i
                                  className="fa fa-trash-o"
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <p>Event Title</p>
                    <input
                      value={eventTitle}
                      type="text"
                      onChange={(e) => seteventTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <p>Description</p>
                    <input
                      value={eventDescription3}
                      type="text"
                      onChange={(e) => seteventDescription3(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-md-3">
                    <label className="form-label">Date</label>
                    <br />

                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Time</label>
                    <TimePicker
                      value={time}
                      start="10:00"
                      end="21:00"
                      step={30}
                      onChange={(e) => settime(e)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Event Type</label>
                    <Select
                      options={eventTypeDropDownOptions}
                      onChange={(e) => seteventType2(e?.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Location Address</label>
                    <input
                      value={locationAddress}
                      type="text"
                      onChange={(e) => setlocationAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      value={city}
                      type="text"
                      onChange={(e) => setcity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <Select
                      options={options_2}
                      onChange={(e) => setstate(e.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Zip</label>
                    <input
                      value={zipcode}
                      type="text"
                      onChange={(e) => setzipcode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <br />
              <br />

              <div className="container">
                <div className="row">
                  {toggleEventYoutube ? (
                    <>
                      <div className="container">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label" htmlFor="typeText">
                              Youtube Media
                            </label>
                          </div>
                          <div className="col-md-3">
                            {youtubeLinkEvent != ""
                              ? showVideo(youtubeLinkEvent)
                              : showVideo("no-video")}
                          </div>
                          <div className="col-md-3">
                            <input
                              className="form-control"
                              type="text"
                              value={youtubeLinkEvent}
                              onChange={(e) => {
                                const inputValue = e.target.value.trim();
                                setyoutubeLinkEvent(inputValue);
                              }}
                            />
                            <span className="mbSpan">
                              Add YouTube video link.
                            </span>
                          </div>
                        </div>

                        <div className="text-center youTubeOption2">
                          <span
                            className="mx-4 custom-youtube-toggleLink"
                            onClick={() => {
                              toggleEventYoutube
                                ? setToggleEventYoutube(false)
                                : (setToggleEventYoutube(true),
                                  setyoutubeLinkEvent(""));
                            }}
                          >
                            <BsFileEarmarkImage id="youTubelogo" />
                            Custom Video
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Event Media</p>
                      <div className="col-md-3">
                        <Image
                          src="/no-img.jpg"
                          width={80}
                          height={80}
                          alt="Picture of the author"
                        />
                      </div>

                      <div className="col-md-4">
                        <input
                          type="file"
                          onChange={(e) => {
                            const img = e?.target?.files[0];

                            const fileName = img.name.toLowerCase();

                            // Check if the file has an image extension
                            if (/\.(jpg|jpeg|png|gif|webp)$/.test(fileName)) {
                              if (img.size > 6 * 1024 * 1024) {
                                e.target.value = null;
                                showNotification(
                                  "Image size exceeds 6MB. Please choose a smaller image.",
                                  "Error"
                                );
                                return;
                              } else {
                                setnewsMedia2(e.target.files[0]);
                              }
                            } else if (
                              /\.(mp4|mov|mkv|Ff4v|swf|webm)$/.test(fileName)
                            ) {
                              if (img.size > 100 * 1024 * 1024) {
                                e.target.value = null;
                                showNotification(
                                  "Video size exceeds 100MB. Please choose a smaller video.",
                                  "Error"
                                );
                                return;
                              } else {
                                setnewsMedia2(e.target.files[0]);
                              }
                            } else if (
                              /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|html|js|jsx|php|tiff|eps|avi|wmv|bmp|flv)$/.test(
                                fileName
                              )
                            ) {
                              e.target.value = null;
                              showNotification(
                                "Unsupported File type.",
                                "Error"
                              );
                              return;
                            }
                          }}
                        />
                        <span className="mbSpan">
                          Max file size for image is 6 MB
                        </span>
                      </div>
                      {/* <div
                        style={{ width: "100%" }}
                        className="d-flex justify-content-center align-items-center youTubeOption2"
                      >
                        <span
                          className="mx-4 custom-youtube-toggleLink"
                          onClick={() => {
                            toggleEventYoutube
                              ? setToggleEventYoutube(false)
                              : setToggleEventYoutube(true);
                          }}
                        >
                          <BsYoutube id="youTubelogo" />
                          YouTube Link
                        </span>
                      </div> */}
                    </>
                  )}

                  <div className="col-md-3">
                    <label className="form-check-label">Active &nbsp;</label>
                    <input
                      type="checkbox"
                      id="flexCheckDefault"
                      checked={active3}
                      onChange={(e) => setactive3(e.target.checked)}
                    />
                  </div>
                </div>
                <br />

                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Event Cost</label>
                    <input
                      value={eventCost}
                      type="number"
                      onChange={(e) => seteventCost(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="text-right">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={updateEventManagementSection}
                      >
                        Update Site
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>(Event Name) RSVP List</strong>
                  </p>
                </div>
                <div className="col-md-6 text-right">
                  {downloadLoader ? (
                    <Spinner
                      style={{ width: "50px", height: "50px", color: "#333" }}
                      animation="border"
                    />
                  ) : (
                    <Link href="#!" onClick={downloadEventUserData}>
                      <p>
                        <strong>Download List</strong>
                      </p>
                    </Link>
                  )}
                </div>

                <div className="col-md-12">
                  {rsvp.map((item, key) => (
                    <span key={key}>
                      <span className="rsvpHeadings">
                        <span className="mx-3">
                          ({item.event_name}) RSVP List
                        </span>
                        <span className="mx-3 "></span>
                      </span>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Count</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>City</th>
                            <th>State</th>
                            <th>RSVP Date</th>
                          </tr>
                        </thead>
                        {item.user_data.map((data, key2) => (
                          <>
                            <tbody>
                              <tr>
                                <td>{key2 + 1} </td>
                                <td>{data.user_name}</td>
                                <td>{data.user_email}</td>
                                <td>{data.city}</td>
                                <td>{data.state}</td>
                                <td>{data.created_at}</td>
                              </tr>
                            </tbody>
                          </>
                        ))}
                      </table>
                    </span>
                  ))}

                  <div className="text-right">
                    <p>RSVP Total = {countRSVP()}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </AdminLayout>
    </>
  );
};

function showVideo(fileSrc) {
  return (
    <>
      {fileSrc == "no-video" ? (
        <Image src="/no-img.jpg" width={80} height={80} alt="video-banner" />
      ) : (
        <ReactPlayer
          url={fileSrc}
          playing={true}
          muted={true}
          width={"50%"}
          height={80}
        />
      )}
    </>
  );
}

function showImage(fileSrc) {
  return <Image src={fileSrc} width={80} height={80} alt="video-banner" />;
}
function showYoutube(fileSrc) {
  return (
    <ReactPlayer
      url={fileSrc}
      playing={true}
      muted={true}
      width={"50%"}
      height={80}
    />
  );
}

export default EventPage;
