import React from "react"
import swal from "sweetalert"

class LandingPage extends React.Component {

    onSubmitButton = () => {
        let username = this.username.value
        let room  = this.room.value
        
        this.props.io.emit ("user-join", {username, room})

        // If there's more than 5 user in a room 
        this.props.io.on ("total-user", (data) => {

            if (data < 5) {
                // Send data to App.js
                this.props.onSubmitButton (username, room)

            } else {
                // alert ("Room is full already")
                swal({
                    title: "Full !",
                    text: "The room is full already. Max. 5 users",
                    icon: "error",
                })
            }
        })
    }   



    render () {
        return (
    
            <div className="container d-flex justify-content-center mt-5">
                <div className="card shadow border-dark col-6">
                    <div className="card-body">
                        <div className="bg-primary py-2 rounded-lg">
                            <h3 className="card-title text-center text-light">Superchat</h3>
                            <h6 className="card-subtitle mb-2 text-light text-center">Welcome !</h6>
                        </div>
                        
                        <form className="my-2">
                            <div className="form-group">
                                <label htmlFor="username">
                                    Username
                                </label>
                                <input type="text" className="form-control" placeholder="Insert your username" ref={(e) => this.username = e}></input>
                            </div>
        
                            <div className="form-group">
                                <label htmlFor="room">
                                    Room
                                </label>
                                <input type="text" className="form-control" placeholder="Insert the name of your room" ref={(e) => this.room = e}></input>
                            </div>
                        </form>
                        <input type="button" value="Submit" className="btn btn-primary" onClick={() => this.onSubmitButton()}/>
                    </div>
                </div>
            </div>
           
        )
    }
}

export default LandingPage