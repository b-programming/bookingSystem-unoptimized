import React from 'react'
import {Redirect } from "react-router-dom";
const axios = require('axios');
const moment = require('moment');
class Form extends React.Component {
constructor(props){
  super(props);
  this.state = {
      success: false,
      workHours: [],
      appointments: [],
      booked: [],
      breaks: [],
      services: [],
      barbers:[],
      earlyWork: true
  };
  this.onSubmit = this.onSubmit.bind(this);
  this.getData = this.getData.bind(this);
  this.calcAppointment = this.calcAppointment.bind(this);
}
getData = async () => {
    const wHours = await axios.get('http://127.0.0.1:5000/workHours')
    const workHours = await wHours.data
    this.setState({ workHours });
    
    const appMents = await axios.get('http://127.0.0.1:5000/appointments')
    const appointments = await appMents.data
    this.setState({ appointments });

    const servCes = await axios.get('http://127.0.0.1:5000/services')
    const services = await servCes.data
    this.setState({ services });

    const barberss = await axios.get('http://127.0.0.1:5000/barbers')
    const barbers = await barberss.data
    this.setState({ barbers });

    console.log(this.state.appointments);
  }
calcAppointment() {
    let loopedIndex = 0;
    const bookedArr = [];
    this.state.appointments.forEach(appointment => {
    loopedIndex = loopedIndex + 1;
    var startDate = moment.unix(appointment.startDate).format('HH:mm');
    var openDate = moment(`1970-01-01 ${this.state.workHours[0].startHour}:00`).format('HH:mm');
    var closeDate = moment(`1970-01-01 ${this.state.workHours[0].endHour}:00`).format('HH:mm');
    var earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:00`).format('HH:mm');
    var earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:30`).format('HH:mm');
    if(openDate <= startDate && closeDate >= startDate) {
        if(startDate<earlyBreakStart || startDate>=earlyBreakEnd){
            if(appointment.serviceId === 1){
                bookedArr.push({from: appointment.startDate, to: appointment.startDate + 1200, service: 1 });
            }
            if(appointment.serviceId === 2){
                bookedArr.push({from: appointment.startDate, to: appointment.startDate + 1800, service: 2});
            }
            if(appointment.serviceId === 3){
                bookedArr.push({from: appointment.startDate, to: appointment.startDate + 3000, service: 3});
            }
        }
        if(startDate>earlyBreakStart && startDate<earlyBreakEnd){
            console.log("on lunch break")
        }
    }
    if(openDate > startDate || closeDate < startDate){
            console.log("zaprto");
    }
    });
    //booked from to dates
    this.setState({ booked: bookedArr }, function () {
        console.log("state:", this.state.booked);
   });
   console.log(loopedIndex);
}

onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
onSubmit(e) {
    e.preventDefault();
    console.log(e);
    this.setState({success: true})
    }

  render() {
      /* onChange={this.onChange} value={this.state.name} */
      const redirect = this.state.success;
      if (redirect === true) {
          return <Redirect to="/success" />
      }
    return (
      <div>
        <h1>Form</h1>
        <form onSubmit={this.onSubmit}>
          <div>
            <input type="text" name="Fname" placeholder="First name: " required />
          </div>
          <div>
            <input type="text" name="Lname" placeholder="Last name: " required/>
          </div>
          <div>
            <input type="text" name="email" placeholder="Email: "required/>
          </div>
          <div>
            <input type="text" name="number" placeholder="Contact number: " required/>
          </div>
          <div>
            <label>Barber: </label><br />
            <select type="text" name="barber" required>
                 <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="opel">Opel</option>
            </select>
          </div>
          <div>
            <label>Service: </label><br />
            <select type="text" name="service" required>
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="opel">Opel</option>
            </select>
          </div>
          <div>
            <input type="date" name="date" required/>
          </div>
          <div>
            <label>Time: </label><br />
            <select type="time" name="time" required>
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="opel">Opel</option></select>
          </div>
          <div>
            <label>Price: </label><br />
            <input type="number" name="price" required/>
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
        
         <button onClick={this.getData}>Submit</button>
         <ul>
        {this.state.workHours.map(w => <li key={w.startHour}>{w.startHour}</li>)}
      </ul>
      <ul>
        {this.state.appointments.map(a => <li key={a.startDate}>{a.startDate}</li>)}
      </ul>
      <button onClick={this.calcAppointment}>calc</button>
        </div>
    );
  }
}
export default Form;