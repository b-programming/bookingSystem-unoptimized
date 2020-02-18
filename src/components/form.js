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
      //fullDay:false,
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
  //if(this.state.loaded !== true){
      axios.all([
        axios.get('http://127.0.0.1:5000/workHours'),
        axios.get('http://127.0.0.1:5000/appointments'),
        axios.get('http://127.0.0.1:5000/services'),
        axios.get('http://127.0.0.1:5000/barbers')
      ])
      .then(responseArr => {
        //this will be executed only when all requests are complete
        this.setState({ workHours: responseArr[0].data }); 
        this.setState({ appointments: responseArr[1].data }); 
        this.setState({ services: responseArr[2].data }); 
        this.setState({ barbers: responseArr[3].data });
        this.setState({ loaded: true});
        this.calcAppointment() 
      });
    }
   // }

calcAppointment() {
    const bookedArr = [];
    const noBarberDays = [];
    const openClose = [];
    this.state.barbers.forEach((barbers) => {
    var i;
    var openDate;
    var closeDate;
    var shiftStart;
    var shiftEnd;
    for(i=0;i<10;i++){
    if(i<=5){
        openDate = moment(`1970-01-01 ${this.state.workHours[0].startHour}:00`).format('HH:mm');
        openDate = moment(`1970-01-01 ${this.state.workHours[0].endHour}:00`).format('HH:mm');
        if(i<=3){
            shiftStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].startHour}:00`).format('HH:mm');
            shiftEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].endHour}:00`).format('HH:mm');
            }
        if(i>3){
            noBarberDays.push(i);
            }
};
    if(i>5){
     openDate = moment(`1970-01-01 ${this.state.workHours[5].startHour}:00`).format('HH:mm');
     closeDate = moment(`1970-01-01 ${this.state.workHours[5].endHour}:00`).format('HH:mm');
        if(i<=8){
            noBarberDays.push(i);
        }
        if(i>8){
            shiftStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].startHour}:00`).format('HH:mm');
            shiftEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].endHour}:00`).format('HH:mm');
        }
}
if(openDate < shiftStart){openDate=shiftStart;}
if(closeDate > shiftEnd){closeDate=shiftEnd;}
openClose.push({from: openDate, to: closeDate });
}
this.setState({ openClose: openClose }); 

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
var earlyBreakStart;
var earlyBreakEnd;

if(this.state.firstWeek === true){
  earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:00`).format('HH:mm');
  earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[0].lunchTime.startHour}:30`).format('HH:mm');
  bookedHours.push({from: earlyBreakStart, to: earlyBreakEnd});
}
if(this.state.firstWeek === false){
  earlyBreakStart = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].lunchTime.startHour}:00`).format('HH:mm');
  earlyBreakEnd = moment(`1970-01-01 ${this.state.barbers[0].workHours[4].lunchTime.startHour}:30`).format('HH:mm');
  bookedHours.push({from: earlyBreakStart, to: earlyBreakEnd});
}
 var arr = [];
alreadyBooked.forEach((booked) => {
    var appointmentMonth = moment.unix(booked.from).format('MM');
    var appointmentDay = moment.unix(booked.from).format('DD');
    var appointmentHour = moment.unix(booked.from).format('HH:mm');
    arr.push({month: appointmentMonth, day: appointmentDay });
    var appointmentHourEnd;
    if(selectedMonth === appointmentMonth){
    if(selectedDay === appointmentDay){
      if(serviceTime.durationInMin === 20){
        appointmentHourEnd = moment.unix(booked.from + 1200 ).format('HH:mm');
        bookedHours.push({from: appointmentHour, to: appointmentHourEnd });
      }
      if(serviceTime.durationInMin === 30){
        appointmentHourEnd = moment.unix(booked.from + 1800 ).format('HH:mm');
        bookedHours.push({from: appointmentHour, to: appointmentHourEnd });
      }
      if(serviceTime.durationInMin === 50){
        appointmentHourEnd = moment.unix(booked.from + 3000 ).format('HH:mm');
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
      if (day.day()!==0 && day.day()!==6) businessDays++;
      day.add(1,'d');
    }
    return businessDays;
  }


  var diffInDays = calcBusinessDays(barbersFirstDay, clientSelectedDate) - 1;
  var firstWeek = Math.floor(diffInDays / 5);
  firstWeek = firstWeek % 2;
  var daysWorkedThisWeek = diffInDays % 10;
  var daysWorkedThisFiveDayWeek = diffInDays % 5 - 1;
  var barberAbsent = this.state.noBarberD.includes(daysWorkedThisWeek);
  var freeHoursOnDay = [];
  var start;
  var finish;
  var freeTime;
  var maxBooked;
  var startOfAppointment;
  var durations;
  //this.setState({fullDay: barberAbsent});
  if(daysWorkedThisFiveDayWeek < 0){daysWorkedThisFiveDayWeek = 4;}
  if(firstWeek === 0){
    this.setState({ firstWeek: false }, function () {
      console.log(this.state.firstWeek);
     });
     start = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].from}`);
     finish = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].to}`);
     durations = this.state.inputService[0].durationInMin;
     //var newDate = start.add(durations, "minutes"); moment1.isSameOrAfter(moment2);
     freeHoursOnDay.push(start.format('HH:mm'));
     /* for(var i=0;(i<=freeHoursOnDay.length)&&(freeHoursOnDay[i].start.isSameOrAfter(start)&&(freeHoursOnDay[i].start.isSameOrBefore(finish)));i++){ */
      freeTime = finish.diff(start, 'm');
      maxBooked = Math.floor(freeTime / durations);
      startOfAppointment = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].from}`);
      var firstBreak;
      var firstBreakEnd;
      for (var i = 1; i < maxBooked; i++) {
        // startOfAppointment!==this.state.bookedHours[i].from
        firstBreak = moment(`1970-01-01 ${this.state.bookedHours[0].from}`);
        firstBreakEnd = moment(`1970-01-01 ${this.state.bookedHours[0].to}`);
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
  if(firstWeek === 1){
    this.setState({ firstWeek: true }, function () {
      console.log(this.state.firstWeek);
     });
     start = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek].from}`);
     finish = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek].to}`);
     durations = this.state.inputService[0].durationInMin;
     freeHoursOnDay.push(start.format('HH:mm'));
      freeTime = finish.diff(start, 'm');
      maxBooked = Math.floor(freeTime / durations);
      startOfAppointment = moment(`1970-01-01 ${this.state.openClose[daysWorkedThisFiveDayWeek + 5].from}`);
      
      for (var k = 1; k < maxBooked; k++) {
        firstBreak = moment(`1970-01-01 ${this.state.bookedHours[0].from}`);
        firstBreakEnd = moment(`1970-01-01 ${this.state.bookedHours[0].to}`);
        if(start <= startOfAppointment && startOfAppointment<finish){
          if(startOfAppointment<firstBreak){
        freeHoursOnDay.splice(k,0, startOfAppointment.add(durations, 'minutes').format('HH:mm'))
        }
          if(startOfAppointment>=firstBreakEnd){
            freeHoursOnDay.splice(k,0, startOfAppointment.add(durations, 'minutes').format('HH:mm'))
          }
      }
      }
  }
  if(barberAbsent === true){
    this.setState({ freeHours: [{id: 0, value: 'no apointments available'}] });
    }
    if(barberAbsent === false){
      var arr = [];
      for(var j=0;i<freeHoursOnDay.length;j++){
      arr.push({id:j, value: freeHoursOnDay[j]});
      }
       this.setState({ freeHours: arr });
    }
}
  onChangeService(e) {
    e.preventDefault();
    if(e.target.value === 1){
      this.setState({ inputService: [{id: e.target.value, durationInMin: this.state.services[0].durationMinutes}] });
      this.setState({ price: this.state.services[0].price });
    }
    if(e.target.value === 2){
      this.setState({ inputService: [{id: e.target.value, durationInMin: this.state.services[1].durationMinutes}] });
      this.setState({ price: this.state.services[1].price });
    }
    if(e.target.value === 3){
      this.setState({ inputService: [{id: e.target.value, durationInMin: this.state.services[2].durationMinutes}] });
      this.setState({ price: this.state.services[2].price });
    }
  }
  onChangeTime(e){
    e.preventDefault();
    this.setState({ selectedHour: e.target.value });
  }
  onBarberChange(e){
    this.setState({ selectedBarber:e.target.value});
    if(e.target.value < 1){
      this.setState({ selectedBarber: 1});
    }
  }
  onChangeEmail(e){
    e.preventDefault();
    this.setState({ inputEmail: e.target.value });
  }
  onChangeNumber(e){
    e.preventDefault();
    this.setState({ inputNumber: e.target.value });
  }
  validateEmail(){
   var email = this.state.inputEmail;
   var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
   var validated = re.test(email);
   return validated
  }
  validateNumber(){
  var number = this.state.inputNumber;
  var re = /^(\+)([386]{3})\s*(\d{2})\s*(\d{3})\s*(\d{3})$/;
  var validated = re.test(number);
  return validated
  }

onSubmit(e) {
    e.preventDefault();
    var validatedEmail = this.validateEmail();
    var validatedNumber = this.validateNumber();
    var string = this.state.inputDate.split(/\D/);
    string = string[0] + "-" + string[1] + "-" + string[2];
    var dateString = moment(`${string} ${this.state.selectedHour}`, 'DD-MM-YYYY HH:mm');
    var epox = moment(dateString).unix();
    if(validatedEmail === true && validatedNumber === true){
          axios.post(`http://127.0.0.1:5000/appointments`, {
            "startDate": epox,
            "barberId": this.state.selectedBarber,
            "serviceId": this.state.inputService[0].id,
          })

          .then(response => {
            console.log(response);
            this.setState({ success:true });
          })
          .catch( error=> {
            console.log(error);
          });
      }
      else if(validatedEmail !== true) alert("Incorect email address format, email must be valid");
      else if(validatedNumber !== true) alert("Incorect phone number, number must start with +386");
      else alert("Incorect format, please check your inputs");
    }

  render() {
      const redirect = this.state.success;
      if (redirect === true) {
          return <Redirect to="/success" />
      }
    return (
      <div id="parentContainer">
      <div id="Pagecontainer">
        <h1>Book Your Barber</h1>
        <h2>Great Hair Doesn’t Happen By Chance. It Happens By Appointment! <br /> So, Don't Wait And Book Your Appointment Now!</h2>
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
            <option value="" disabled selected>Service: </option>
            <option value="1">Shave</option>
            <option value="2">Haircut</option>
            <option value="3">Shave and Haircut</option>
            </select>
          </div>
          <div className="inpt">
            <input type="date" name="date" min={new Date().toISOString().split("T")[0]} required onChange={(e) => this.onChangeDate(e)} />
            <select type="time" name="time" required value={this.state.selectedHour}
              onChange={(e) => this.onChangeTime(e)}>
                <option value="" disabled selected>Time: </option>
            {this.state.freeHours.map((free) => <option key={free.id} value={free.value}>{free.value}</option>)}
            </select>
          </div>
          <div className="inpt">
            <input type="number" name="price" disabled="disabled" value ={ this.state.price} required/>
          </div>
          <div className="inpt">
          <button type="submit">Submit</button>
          </div>
          </div>

        </form>
        </div>

       </div>
        </div>
        </div>
    );
  }
}
export default Form;