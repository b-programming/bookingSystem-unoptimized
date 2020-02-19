import React from 'react';
import { Redirect } from "react-router-dom";
import '../css/style.css';
const axios = require('axios');
const moment = require('moment');
class Form extends React.Component {
constructor(props){
  super(props);
  this.state = {
 workHours: [],
      appointments: [],
      selectedBarber:1,
      inputDate: {},
      inputService: [],
      inputEmail:'',
      inputNumber:'',
      booked: [],
      breaks: [],
      services: [],
      barbers:[],
      fullDay:false,
      noBarberD:[],
      freeHours:[ {id:1}, {value: "choose date"}],
      bookedHours:[],
      openClose:[],
      selectedHour:'',
      firstWeek: true,
      price: 0,
      loaded: false
  };
  this.onSubmit = this.onSubmit.bind(this);
  this.onChangeDate = this.onChangeDate.bind(this);
  this.onChangeService = this.onChangeService.bind(this);
  this.onChangeTime = this.onChangeTime.bind(this);
  this.calcAppointment = this.calcAppointment.bind(this);
}
componentWillMount(){
//load only once condition
  if(this.state.loaded !== true){
      axios.all([
        axios.get('http://127.0.0.1:5000/workHours'),
        axios.get('http://127.0.0.1:5000/appointments'),
        axios.get('http://127.0.0.1:5000/services'),
        axios.get('http://127.0.0.1:5000/barbers')
      ])
      .then(responseArr => {
        this.setState({ workHours: responseArr[0].data }); 
        this.setState({ appointments: responseArr[1].data }); 
        this.setState({ services: responseArr[2].data }); 
        this.setState({ barbers: responseArr[3].data });
        this.setState({ loaded: true});
        this.calcAppointment() 
      });
    }
}

calcAppointment() {
    const bookedArr = [];
    const noBarberDays = [];
    const openClose = [];
    this.state.barbers.forEach((barbers) => {
    var i;
    for(i=0;i<10;i++){
    if(i<=5){
        var openDate = moment(`1970-01-01 ${this.state.workHours[0].startHour}:00`).format('HH:mm');
        var closeDate = moment(`1970-01-01 ${this.state.workHours[0].endHour}:00`).format('HH:mm');
        if(i<=3){
            var shiftStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].startHour}:00`).format('HH:mm');
            var shiftEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].endHour}:00`).format('HH:mm');
            }
        if(i>3){
            noBarberDays.push(i);
            }
};
    if(i>5){
    var openDate = moment(`1970-01-01 ${this.state.workHours[5].startHour}:00`).format('HH:mm');
    var closeDate = moment(`1970-01-01 ${this.state.workHours[5].endHour}:00`).format('HH:mm');
        if(i<=8){
            noBarberDays.push(i);
        }
        if(i>8){
            var shiftStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].startHour}:00`).format('HH:mm');
            var shiftEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].endHour}:00`).format('HH:mm');
        }
}
if(openDate < shiftStart){openDate=shiftStart;}
if(closeDate > shiftEnd){closeDate=shiftEnd;}
openClose.push({from: openDate, to: closeDate });
}
this.setState({ openClose: openClose }, function () {
  console.log("from to:", this.state.openClose);
}); 

this.state.appointments.forEach((appointment) => {
  bookedArr.push({from: appointment.startDate, service: appointment.serviceId });
});
    });
    //booked from to dates

     this.setState({ booked: bookedArr }, function () {
        console.log("booked arr:", this.state.booked);
    }); 
this.setState({ noBarberD: noBarberDays });

var bookedHours = [];
var selectedDay = moment(this.state.inputDate).format('DD');
var selectedMonth = moment(this.state.inputDate).format('MM');
var alreadyBooked = bookedArr;
var serviceTime = this.state.inputService;
console.log( selectedDay, serviceTime, alreadyBooked);

if(this.state.firstWeek == true){
  var earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:00`).format('HH:mm');
  var earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:30`).format('HH:mm');
  bookedHours.push({from: earlyBreakStart, to: earlyBreakEnd});
}
if(this.state.firstWeek ==false){
  var earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].lunchTime.startHour}:00`).format('HH:mm');
  var earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].lunchTime.startHour}:30`).format('HH:mm');
  bookedHours.push({from: earlyBreakStart, to: earlyBreakEnd});
}
 var arr = [];
alreadyBooked.forEach((booked) => {
    var appointmentMonth = moment.unix(booked.from).format('MM');
    var appointmentDay = moment.unix(booked.from).format('DD');
    var appointmentHour = moment.unix(booked.from).format('HH:mm');
    arr.push({month: appointmentMonth, day: appointmentDay });
    if(selectedMonth == appointmentMonth){
    if(selectedDay == appointmentDay){
      if(serviceTime.durationInMin == 20){
        var appointmentHourEnd = moment.unix(booked.from + 1200 ).format('HH:mm');
        bookedHours.push({from: appointmentHour, to: appointmentHourEnd });
      }
      if(serviceTime.durationInMin == 30){
        var appointmentHourEnd = moment.unix(booked.from + 1800 ).format('HH:mm');
        bookedHours.push({from: appointmentHour, to: appointmentHourEnd });
      }
      if(serviceTime.durationInMin == 50){
        var appointmentHourEnd = moment.unix(booked.from + 3000 ).format('HH:mm');
        bookedHours.push({from: appointmentHour, to: appointmentHourEnd });
      }
    }
  }
  if(selectedMonth !== appointmentMonth){
    //console.log("free month");
    if(selectedDay !== appointmentDay){
      //console.log("free day");
    }
  }
})
this.setState({ bookedHours: bookedHours }, function () {
  console.log(this.state.bookedHours);
}); 
}

  onChangeDate(e) {
    e.preventDefault();
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
  var diffInDays = calcBusinessDays(barbersFirstDay, clientSelectedDate) - 1;
  var firstWeek = Math.floor(diffInDays / 5);
  firstWeek = firstWeek % 2;
  var Worked14D = Math.floor(diffInDays / 10); //10 days considerered 1 loop
  var daysWorkedThisWeek = diffInDays % 10;
  var daysWorkedThisFiveDayWeek = diffInDays % 5 - 1;
  var barberAbsent = this.state.noBarberD.includes(daysWorkedThisWeek);
  var freeHoursOnDay = [];
  this.setState({fullDay: barberAbsent});
  if(daysWorkedThisFiveDayWeek < 0){daysWorkedThisFiveDayWeek = 4;}
  if(firstWeek == 0){
    this.setState({ firstWeek: false }, function () {
      console.log(this.state.firstWeek);
     });
     var start = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].from}`);
     var finish = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].to}`);
     var durations = this.state.inputService[0].durationInMin;
     //var newDate = start.add(durations, "minutes"); moment1.isSameOrAfter(moment2);
     freeHoursOnDay.push(start.format('HH:mm'));
     /* for(var i=0;(i<=freeHoursOnDay.length)&&(freeHoursOnDay[i].start.isSameOrAfter(start)&&(freeHoursOnDay[i].start.isSameOrBefore(finish)));i++){ */
      var freeTime = finish.diff(start, 'm');
      var maxBooked = Math.floor(freeTime / durations);
      var startOfAppointment = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].from}`);
      for (var i = 1; i < maxBooked; i++) {
        // startOfAppointment!==this.state.bookedHours[i].from
        var firstBreak = moment(`1970-01-01 ${this.state.bookedHours[0].from}`);
        var firstBreakEnd = moment(`1970-01-01 ${this.state.bookedHours[0].to}`);
        if(start <= startOfAppointment && startOfAppointment<finish){
        if(startOfAppointment<firstBreak){
          freeHoursOnDay.splice(i,0, startOfAppointment.add(durations, 'minutes').format('HH:mm'))
          }
        if(startOfAppointment>=firstBreak){
          freeHoursOnDay.splice(i,0, startOfAppointment.add(durations, 'minutes').format('HH:mm'))
          }
        }        
      }
      
  }
  if(firstWeek == 1){
    this.setState({ firstWeek: true }, function () {
      console.log(this.state.firstWeek);
     });
     var start = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek].from}`);
     var finish = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek].to}`);
     var durations = this.state.inputService[0].durationInMin;
     freeHoursOnDay.push(start.format('HH:mm'));
      var freeTime = finish.diff(start, 'm');
      var maxBooked = Math.floor(freeTime / durations);
      var startOfAppointment = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].from}`);
      console.log("max", maxBooked);
      
      for (var i = 1; i < maxBooked; i++) {
        var firstBreak = moment(`1970-01-01 ${this.state.bookedHours[0].from}`);
        var firstBreakEnd = moment(`1970-01-01 ${this.state.bookedHours[0].to}`);
        if(start <= startOfAppointment && startOfAppointment<finish){
          if(startOfAppointment<firstBreak){
        freeHoursOnDay.splice(i,0, startOfAppointment.add(durations, 'minutes').format('HH:mm'))
        }
          if(startOfAppointment>=firstBreakEnd){
            freeHoursOnDay.splice(i,0, startOfAppointment.add(durations, 'minutes').format('HH:mm'))
          }
      }
      }
  }
  if(barberAbsent == true){
    this.setState({ freeHours: [{id: 0, value: 'no apointments available'}] }, function () {
        console.log(this.state.selectedHour);
       });
    }
    if(barberAbsent == false){
      var arr = [];
      for(var i=0;i<freeHoursOnDay.length;i++){
      arr.push({id:i, value: freeHoursOnDay[i]});
      }
      console.log(arr);
       this.setState({ freeHours: arr }, function () {
        console.log(this.state.freeHours);
       });
    }
    console.log(this.state.bookedHours, this.state.openClose);
}
  onChangeService(e) {
    e.preventDefault();
    if(e.target.value == 1){
      this.setState({ inputService: [{id: e.target.value, durationInMin: 20}] });
    }
    if(e.target.value == 2){
      this.setState({ inputService: [{id: e.target.value, durationInMin: 30}] });
    }
    if(e.target.value == 3){
      this.setState({ inputService: [{id: e.target.value, durationInMin: 50}] });
    }
  }
  onChangeTime(e){
    this.setState({ selectedHour: e.target.value }, function () {
        console.log(this.state.selectedHour);
   });
  }
  onBarberChange(e){
    this.setState({ selectedBarber: e.target.value }, function () {
      console.log(this.state.selectedBarber);
 });
  }

onSubmit(e) {
    e.preventDefault();
    console.log(this.state.selectedBarber);
    var string = this.state.inputDate.split(/\D/);
    string = string[0] + "-" + string[1] + "-" + string[2];
    var dateString = moment(`${string} ${this.state.selectedHour}`, 'DD-MM-YYYY HH:mm');
    var epox = moment(dateString).unix();

          axios.post(`http://127.0.0.1:5000/appointments`, {
            "startDate": epox,
            "barberId": this.state.selectedBarber[0],
            "serviceId": this.state.inputService[0].id
          })

          .then(response => {
            console.log(response);
            this.setState({ success:true });
          })
          .catch( error=> {
            console.log(error);
          });
      }


  render() {
      const redirect = this.state.success;
      if (redirect === true) {
          return <Redirect to="/success" />
      }
      if(this.state.loaded === true){ 
    return (
      <div id="parentContainer">
      <div id="Pagecontainer">
        <h1>Book Your Barber</h1>
        <h2>Great Hair Doesn’t Happen By Chance. It Happens By Appointment!</h2>
        <h2 id="second"> So, Don't Wait And Book Your Appointment Now!</h2>
       <div id="heroImg">
       <div id="form">
        <form onSubmit={(e) => this.onSubmit(e)}>
          <h2>Book Your Appointment</h2>
          <div id="inputs">
          <div className="inpt">
            <input type="text" name="Fname" placeholder="First name: " required/>
            <input type="text" name="Lname" placeholder="Last name: " required/>
          </div><br/>
          <div className="inpt">
            <input type="text" name="email" placeholder="Email: "required onChange={(e) => this.onChangeEmail(e)}/>
            <input type="text" name="number" placeholder="Contact number: " required onChange={(e) => this.onChangeNumber(e)}/>
          </div>
          <div className="inpt">
            <select type="text" name="barber" onChange={(e) => this.onBarberChange(e)} required>
            <option value="" disabled selected>Barber: </option>
            <option  value="1">Jože Britvica</option>
            </select>
            <select type="text" name="service" required onChange={(e) => this.onChangeService(e)}>
            <option value="0" disabled>Service: </option>
            <option value="1">Shave</option>
            <option value="2">Haircut</option>
            <option value="3">Shave and Haircut</option>
            </select>
          </div>
          <div className="inpt">
            <input type="date" name="date" min={new Date().toISOString().split("T")[0]} required onChange={(e) => this.onChangeDate(e)} />
            <select type="time" name="time" value={this.state.selectedHour}
              onChange={(e) => this.onChangeTime(e)}>
            {this.state.freeHours.map((free) => <option key={free.id} value={free.value}>{free.value}</option>)}
            </select>
          </div>
          <div className="inpt">
            <input type="number" name="price" disabled="disabled" value ={ this.state.price} required/>
          </div>
          <div className="inpt">
          <button id="btn" type="submit">Submit</button>
          </div>
          </div>

        </form>
        </div>

       </div>
        </div>
        </div>
    );
    }
     else{
      return(
        <div>
        <h2>Fetching data, please wait</h2>
        </div>

      );
    } 
  }
}

export default Form;