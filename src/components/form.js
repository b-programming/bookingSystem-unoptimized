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
      inputDate: {},
      inputService: 0,
      booked: [],
      breaks: [],
      services: [],
      barbers:[],
      fullDay:false,
      noBarberD:[],
      freeHours:[
          {id: '1', value: 'first available'},
          {id: '2', value: 'second available'},
          {id: '3', value: 'third available'}
        ],
      selectedHour:''
  };
  this.onSubmit = this.onSubmit.bind(this);
  //this.getData = this.getData.bind(this);
  this.onChangeDate = this.onChangeDate.bind(this);
  this.onChangeService = this.onChangeService.bind(this);
  this.calcAppointment = this.calcAppointment.bind(this);
}
async componentWillMount(){
    this.setState({loading: true});
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
    this.setState({loading: false});
}

calcAppointment() {
    const bookedArr = [];
    const noBarberDays = [];
    this.state.barbers.forEach((barbers, appointment) => {
    var i;
    for(i=0;i<11;i++){
    //this.state.appointments.forEach((appointment) => {
    var startDate = moment.unix(appointment.startDate).format('HH:mm');
    if(i<=5){
        var openDate = moment(`1970-01-01 ${this.state.workHours[0].startHour}:00`).format('HH:mm');
        var closeDate = moment(`1970-01-01 ${this.state.workHours[0].endHour}:00`).format('HH:mm');
        if(i<=3){
            var shiftStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].startHour}:00`).format('HH:mm');
            var shiftEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].endHour}:00`).format('HH:mm');
            var earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:00`).format('HH:mm');
            var earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:30`).format('HH:mm');
            }
        if(i>3){
            noBarberDays.push(i);
            }
};
    if(i>5){
    var openDate = moment(`1970-01-01 ${this.state.workHours[5].startHour}:00`).format('HH:mm');
    var closeDate = moment(`1970-01-01 ${this.state.workHours[5].endHour}:00`).format('HH:mm');
    var close2 =  moment(`1970-01-01 ${this.state.workHours[1].endHour}:00`).format('HH:mm');
        if(i<=8){
            noBarberDays.push(i);
        }
        if(i>8){
            var shiftStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].startHour}:00`).format('HH:mm');
            var shiftEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].endHour}:00`).format('HH:mm');
            var earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].lunchTime.startHour}:00`).format('HH:mm');
            var earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].lunchTime.startHour}:30`).format('HH:mm');
        }
}
if(openDate < shiftStart){openDate=shiftStart;}
if(closeDate > shiftEnd){closeDate=shiftEnd;}
console.log(openDate, earlyBreakStart, earlyBreakEnd, closeDate);
console.log(noBarberDays);
    /* if(openDate <= startDate && closeDate >= startDate) {
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
            //console.log("zaprto");
    } */
    //});
}
    //booked from to dates
/*     this.setState({ booked: bookedArr }, function () {
        console.log("state:", this.state.booked);
    }); */
});
this.setState({ noBarberD: noBarberDays }, function () {
    console.log("no barber days:", this.state.noBarberD);
}); 
 }
  onChangeDate(e) {
    var firstParse = moment(e.target.value).format('DD.MM.YYYY');
    this.setState({ inputDate: firstParse }, function () {
        console.log(this.state.inputDate);
   }); 
   var barbersFirstDay = moment("03.02.2020", "DD.MM.YYYY");
   var clientSelectedDate = moment(firstParse, "DD.MM.YYYY");
   function calcBusinessDays(startDate, endDate) { 
    var day = moment(startDate);
    var businessDays = 0;
    while (day.isSameOrBefore(endDate,'day')) {
      if (day.day()!=0 && day.day()!=6) businessDays++;
      day.add(1,'d');
    }
    return businessDays;
  }
  var diffInDays = calcBusinessDays(barbersFirstDay, clientSelectedDate); 
  var Worked14D = Math.floor(diffInDays / 10); //10 days considerered 1 loop
    var daysWorkedThisWeek = diffInDays % 10;
    var barberAbsent = this.state.noBarberD.includes(daysWorkedThisWeek);
    this.setState({fullDay: barberAbsent});
}
  onChangeService(e) {
    this.setState({ inputService: e.target.value }, function () {
        console.log(this.state.inputService);
   });
   console.log(this.state.selectedHour);
  }
onSubmit(e) {
    e.preventDefault();
    console.log(e);
    this.setState({success: true})
    }

  render() {
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
                <option value="Jože Britvica">Jože Britvica</option>
            </select>
          </div>
          <div>
            <label>Service: </label><br />
            <select type="text" name="service" required onChange={(e) => this.onChangeService(e)}>
            <option value="1">Shave</option>
            <option value="2">Haircut</option>
            <option value="3">Shave and Haircut</option>
            </select>
          </div>
          <div>
            <input type="date" name="date" min={new Date().toISOString().split("T")[0]} required onChange={(e) => this.onChangeDate(e)} />
          </div>
          <div>
            <label>Time: </label><br />
            <select type="time" name="time" required value={this.state.selectedHour}
              onChange={(e) => this.setState({selectedHour: e.target.value})}>
            {this.state.freeHours.map((free) => <option key={free.id} value={free.value}>{free.value}</option>)}
            </select>
          </div>
          <div>
            <label>Price: </label><br />
            <input type="number" name="price" required/>
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      <button onClick={this.calcAppointment}>calc</button>
        </div>
    );
  }
}
export default Form;