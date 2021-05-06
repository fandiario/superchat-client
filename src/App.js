import React from "react"

// Import Pages
import LandingPage from "./pages/LandingPage"
import ChatRoom from "./pages/ChatRoom"

// Import Socket io
import Socket from "socket.io-client"
const io = Socket ("http://localhost:5000")


class App extends React.Component {

  state = {
    username: null,
    room: null
  }

  onChangeState = (username, room) => {
    this.setState ({username: username, room: room})

  }


  render () {

    if (this.state.username === null) {
      return (
        <LandingPage io={io} onSubmitButton={this.onChangeState}></LandingPage>
      )
    }

    return (
      <ChatRoom io={io} username={this.state.username} room={this.state.room}></ChatRoom>
    )
  }
}

export default App;
