import React from "react"

class ChatRoom extends React.Component {

    state = {
        userOnline: [],
        messages: [],
        usersTyping: []
    }

    componentDidMount () {
        
        // See who is online
        this.props.io.on ("user-online", (data) => {
            this.setState ({userOnline: data})
        })

        // See who is joining 
        this.props.io.on ("send-message-from-bot", (data) => {
            let arrMessage = this.state.messages

            arrMessage.push (data)
            this.setState ({messages: arrMessage})
        })

        // Chat
        this.props.io.on ("send-user-message-back", (data) => {
            let arrMessage = this.state.messages

            arrMessage.push (data)

            this.setState ({messages: arrMessage })

            let index = null

            let usersTyping = this.state.usersTyping

            usersTyping.forEach ((el, i) => {
                if (el.username === data.from) {
                    index = i
                }
            })

            if (index !== null) {
                usersTyping.splice (index, 1)
                this.setState ({usersTyping: usersTyping})
            }
        })

        // See users typing
        this.props.io.on ("user-is-typing", (data) => {
            // console.log ( `check: ${data.message}`)

            if (data.message.length > 0) {
                // console.log ( `check: ${data.message}`)
                let index = null

                let usersTyping = this.state.usersTyping

                usersTyping.forEach ((el, i) => {
                    if (el.username === data.from) {
                        index = i
                    }
                })

                if (index === null) {
                    usersTyping.push ({
                        username: data.from,
                        
                    })

                    this.setState ({usersTyping: usersTyping})
                }

            }  
            
            // else if (data.message.length === 0) {
            //     // console.log ( `check: ${data.message}`)
            //     let index = null

            //     let usersTyping = this.state.usersTyping

            //     usersTyping.forEach ((el, i) => {
            //         if (el.username === data.from) {
            //             index = i
            //         }
            //     })

            //     if (index !== null) {
            //         usersTyping.splice (index, 1)
            //         this.setState ({usersTyping: usersTyping})
            //     }
            // }
        })
    }

    // onLeaveButton = () => {
    //     console.log ("left")
    // }

    onSendMessage = () => {
        let data = {
            username: this.props.username,
            message: this.message.value,
            room: this.props.room
        }

        this.props.io.emit ("send-user-message", data)
        this.message.value = ""
    }

    onTypingMessage = () => {
        let data = {
            username: this.props.username,
            message: this.message.value
        }

        this.props.io.emit ("user-typing-message", data)
    }

    render () {
        return (
            <div className="container">

                <div className="row mt-5 py-2 bg-primary d-flex justify-content-between">
                    <div className="mx-3">
                        <h3 className="text-light">
                            Superchat
                        </h3>
                    </div>
                    <div className="mx-3">
                        {/* <input type="button" value="Leave" className="btn btn-danger" onClick={() => this.onLeaveButton()}/> */}
                        {/* <input type="button" value="Leave" className="btn btn-danger"/> */}
                    </div>
                </div>

                <div className="row" >
                    <div className="col-3 alert-primary">
                        <div className="font-weight-bold mt-3">
                            Room:
                        </div>
                        <div>
                            {this.props.room}
                        </div>
                        <div className="font-weight-bold mt-3">
                            Members:
                        </div>
                        {
                            this.state.userOnline ?
                                this.state.userOnline.map ((el, i) => {
                                    return (
                                        <div key={i}>
                                            {el.username}
                                        </div>
                                    )
                                })
                            :
                                null
                        }
                        {/* <div>
                            (User's name here)
                        </div>
                        <div >
                            (Member's name here)
                        </div> */}
                    </div>
                    <div className="col-9 bg-light" style={{height: "500px", position: "relative", overflow:"auto"}}>
                        
                        {/* Bot */}
                        <div className="alert alert-primary rounded-lg text-center my-3 mx-3">
                            <span className="font-weight-bold">Bot: </span>
                            <span>Welcome aboard, {this.props.username} </span>
                        </div>

                        {
                            this.state.messages ?
                                this.state.messages.map ((el, i) => {
                                    if (el.from === "Bot") {
                                        return (
                                            <div key={i} className="alert alert-primary rounded-lg text-center my-3 mx-3">
                                                <span className="font-weight-bold">{el.from}: </span>
                                                <span>{el.message}</span>
                                            </div>
                                        )
                                    
                                    } else if (el.from === this.props.username) {
                                        return (
                                            <div key={i} className="d-flex flex-row-reverse">
                                                <div className="col-6 rounded-lg bg-primary my-3 mx-3 text-light">
                                                    <div className="font-italic font-weight-bold text-right">
                                                        {this.props.username} (Me)
                                                    </div>
                                                    <div className="mb-3">
                                                        {el.message}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={i} className="col-6 rounded-lg alert-primary my-3 mx-3 py-1">
                                                <div className="font-italic font-weight-bold">
                                                    {el.from}
                                                </div>
                                                <div className="mb-3">
                                                    {el.message}
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            :
                                null
                        }
                        {
                            this.state.usersTyping ?
                                this.state.usersTyping.map ((el, i) => {
                                    return (
                                        <div key={i} className="col-6 rounded-lg alert-primary my-3 mx-3 py-1">
                                            <div className="font-italic font-weight-bold">
                                                {el.username}
                                            </div>
                                            <div className="mb-3">
                                                {el.username} is typing...
                                            </div>
                                        </div>
                                    )
                                })
                            :
                                null
                        }

                        

                        {/* User */}
                        {/* <div className="d-flex flex-row-reverse">
                            <div className="col-3 rounded-lg bg-primary my-3 mx-3 text-light">
                                <div className="font-italic font-weight-bold">
                                    {this.props.username} (Me)
                                </div>
                                <div className="mb-3">
                                    Hello there..
                                </div>
                            </div>
                        </div> */}

                        {/* Member */}
                        {/* <div className="col-3 rounded-lg alert-primary my-3 mx-3 py-1">
                            <div className="font-italic font-weight-bold">
                                (Member's name)
                            </div>
                            <div className="mb-3">
                                General Kenobi...
                            </div>
                        </div> */}

                        

                    </div>
                </div>

                <div className="row bg-primary py-2 d-flex justify-content-between">
                    <div className="col-11">
                        <input type="text" className="form-control" placeholder="Write something..." ref={(e) => this.message = (e)} onChange={() => this.onTypingMessage()}/>
                    </div>
                    <div className="mr-3">
                        <input type="button" className="btn btn-success " value="Send" onClick={() => this.onSendMessage ()}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatRoom