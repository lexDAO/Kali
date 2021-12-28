import React, { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelect(props) {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <DatePicker
      name={props.name}
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
}
