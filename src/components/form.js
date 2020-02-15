import React from 'react'
import {Redirect } from "react-router-dom";

class Form extends React.Component {
constructor(props){
  super(props);
  this.state = {
      success: false,

  };
  this.onSubmit = this.onSubmit.bind(this);

}
onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    
  }
onSubmit(e) {
    e.preventDefault();
    console.log(e);
    this.setState({success: true})
    var d1 = new Date(1579691400);
    console.log(`Constructor: ${d1}`);
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
        </div>
    );
  }
}
export default Form;