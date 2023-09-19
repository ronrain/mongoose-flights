import { Flight } from "../models/flight.js";
import { Meal } from "../models/meal.js"

function index(req, res){
  Flight.find({})
  .then(flights => {
    res.render('flights/index', {
      flights: flights,
      title: 'All Flights'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
}

function newFlight(req, res) {
  res.render('flights/new', {
    title: 'Add Flight'
  })
}

function create( req, res) {
  Flight.create(req.body)
  .then(flight => {
    res.redirect('/flights')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
}

function show(req, res) {
  Flight.findById(req.params.flightId)
  .populate('food')
  .then(flight => {
    Meal.find({_id: {$nin: flight.food}})
    .then(meals => {
    res.render('flights/show', {
      flight: flight,
      title: 'Flight Details',
      meals: meals
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
})
.catch(err => {
  console.log(err)
  res.redirect('/flights')
})
}

function edit(req, res) {
  Flight.findById(req.params.flightId)
  .then(flight => {
    res.render('flights/edit', {
      flight: flight,
      title: 'Edit Flight'
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
}

function update(req, res){
  Flight.findByIdAndUpdate(req.params.flightId, req.body, {new: true})
  .then(flight => {
    res.redirect(`/flights/${flight._id}`)
  })
}

function deleteFlight (req, res){
  Flight.findByIdAndDelete(req.params.flightId)
  .then(flight => {
    res.redirect('/flights')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
}

function createTicket(req, res){
  Flight.findById(req.params.flightId)
  .then(flight => {
    flight.tickets.push(req.body)
    flight.save()
    .then(() => {
      res.redirect(`/flights/${flight._id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function addToFood(req, res) {
  // find the flight
  Flight.findById(req.params.flightId)
  .then(flight => {
    // add the meals document _id to cast array
    flight.food.push(req.body.mealId)
    // save the flight
    flight.save()
    .then(() => {
      // redirect back to flight show view
      res.redirect(`/flights/${flight._id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect('/flights')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/flights')
  })
}

function deleteTicket(req, res){
  //find the movie
  Flight.findById(req.params.flightId)
  .then(flight => {
     //find and delete review
    flight.tickets.id(req.params.ticketId).deleteOne()
     //save the movie
    flight.save()
    .then(() => {
      //redirecrt back to movie show view
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

export{
  index,
  newFlight as new,
  create,
  show,
  deleteFlight as delete,
  edit,
  update,
  createTicket,
  addToFood,
  deleteTicket
}