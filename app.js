const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Idea Service
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    idea.time = moment().format('h:mm:ss a');

    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());

// Parse JSON
app.use(express.json());

// Config Socket.io realtime APIs
app.configure(socketio());

// Enable REST service
app.configure(express.rest());

// Register Services
app.use('/ideas', new IdeaService());

// New connection to stream channel
app.on('connection', conn => app.channel('stream').join(conn));

// Publish events to stream channel
app.publish(data => app.channel('stream'));

// PORT Var
const PORT = process.env.PORT || 3030;

app
  .listen(PORT)
  .on('listening', () =>
    console.log(`Realtime server running on port ${PORT}`)
  );
