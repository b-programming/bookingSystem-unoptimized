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
      noBarberD:[]
  };
  this.onSubmit = this.onSubmit.bind(this);
  this.getData = this.getData.bind(this);
  this.onChangeDate = this.onChangeDate.bind(this);
  this.onChangeService = this.onChangeService.bind(this);
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
            noBarberDays.push({days: i });
            }
};
    if(i>5){
    var openDate = moment(`1970-01-01 ${this.state.workHours[5].startHour}:00`).format('HH:mm');
    var closeDate = moment(`1970-01-01 ${this.state.workHours[5].endHour}:00`).format('HH:mm');
    var close2 =  moment(`1970-01-01 ${this.state.workHours[1].endHour}:00`).format('HH:mm');
        if(i<=8){
            noBarberDays.push({days: i });
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
    var currentD = moment().format('DD.MM.YYYY')
    var firstParse = moment(e.target.value).format('DD.MM.YYYY');
    if(firstParse >= currentD){
    this.setState({ inputDate: firstParse }, function () {
        console.log(this.state.inputDate);
   });
   //var barbersFirstDay = moment().set({'year': 2020, 'month': 2, 'day': 1}).format('YYYY MM DD');
   //var test = barbersFirstDay.diff(firstParse, 'days');
   var WorkedTillNow = barbersFirstDay;
   var barbersFirstDay = moment("01.02.2020", "DD.MM.YYYY");
   var clientSelectedDate = moment(firstParse, "DD.MM.YYYY");
   var diffInDays = 'Diff: ' + barbersFirstDay.diff(clientSelectedDate, 'days');
   //IMPLEMENTIRAJ DELJENJE
   console.log(diffInDays);   // =1
/*    for(var i=0;this.state.inputDate>WorkedTillNow;i++){
    const found = this.state.noBarberD.find(element => element === i);
    if(found===i){
        this.setState({fullDay: true})
        break;
    }
   WorkedTillNow = moment(WorkedTillNow).add(1, 'days').format('YYYY MM DD');
   } */
   console.log(this.state.fullDay);
  }
  else if(firstParse < currentD) {
    e.target.value = null
    //ADD USER WARNING WHEN PAST DATE
  }

}
  onChangeService(e) {
    this.setState({ inputService: e.target.value }, function () {
        console.log(this.state.inputService);
   });
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
            <input type="date" name="date" required onChange={(e) => this.onChangeDate(e)} />
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